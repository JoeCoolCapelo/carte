const axios = require('axios');
const { pool } = require('../config/db');

// Camayenne approximated bounding box
// SouthWest: 9.5100, -13.6900
// NorthEast: 9.5500, -13.6600
const BBOX = '9.5100,-13.6900,9.5500,-13.6600';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const CATEGORIES = {
    'health': ['pharmacy', 'hospital', 'clinic', 'doctors'],
    'education': ['school', 'university', 'college', 'kindergarten'],
    'commerce': ['supermarket', 'convenience', 'shop', 'marketplace', 'mall'],
    'restaurant': ['restaurant', 'cafe', 'fast_food', 'bar'],
    'government': ['townhall', 'police', 'embassy', 'government', 'courthouse'],
    'tourism': ['hotel', 'museum', 'attraction', 'viewpoint'],
};

async function fetchOSMData() {
    console.log('Fetching data from Overpass API...');

    // Construct query for all categories
    let queryParts = [];
    for (const [cat, types] of Object.entries(CATEGORIES)) {
        for (const type of types) {
            queryParts.push(`node["amenity"="${type}"](${BBOX});`);
            queryParts.push(`way["amenity"="${type}"](${BBOX});`);
            queryParts.push(`relation["amenity"="${type}"](${BBOX});`);

            // Also check for "shop" key for commerce
            if (cat === 'commerce') {
                queryParts.push(`node["shop"="${type}"](${BBOX});`);
                queryParts.push(`way["shop"="${type}"](${BBOX});`);
            }
            // Also check for "tourism" key
            if (cat === 'tourism') {
                queryParts.push(`node["tourism"="${type}"](${BBOX});`);
                queryParts.push(`way["tourism"="${type}"](${BBOX});`);
            }
        }
    }

    const query = `
        [out:json][timeout:25];
        (
            ${queryParts.join('\n')}
        );
        out body;
        >;
        out skel qt;
    `;

    try {
        const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log(`Received ${response.data.elements.length} elements from OSM.`);
        return response.data.elements;
    } catch (error) {
        console.error('Error fetching from Overpass:', error.message);
        return [];
    }
}

function mapOSMToPlace(element) {
    if (!element.tags) return null;
    if (!element.tags.name) return null; // Skip nameless places for now

    const tags = element.tags;
    let category = 'other';
    let subcategory = null;

    // Determine category
    for (const [cat, types] of Object.entries(CATEGORIES)) {
        if (types.includes(tags.amenity) || types.includes(tags.shop) || types.includes(tags.tourism)) {
            category = cat;
            subcategory = tags.amenity || tags.shop || tags.tourism;
            break;
        }
    }

    return {
        osm_id: element.id,
        name: tags.name,
        category: category,
        subcategory: subcategory,
        description: tags.description || null,
        address: tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}`.trim() : null,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        lat: element.lat,
        lon: element.lon,
        source: 'osm'
    };
}

async function importData() {
    const elements = await fetchOSMData();
    if (elements.length === 0) {
        console.log('No data found.');
        process.exit(0);
    }

    let insertedCount = 0;

    // Connect to DB
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const element of elements) {
            // Only handle nodes for now to simplify geometry (ways/relations need centroids)
            if (element.type !== 'node') continue;

            const place = mapOSMToPlace(element);
            if (!place) continue;

            const queryText = `
                INSERT INTO places (
                    osm_id, name, category, subcategory, description, address, phone, website, location, source
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, ST_SetSRID(ST_MakePoint($9, $10), 4326), $11
                )
                ON CONFLICT (osm_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    category = EXCLUDED.category,
                    subcategory = EXCLUDED.subcategory,
                    description = EXCLUDED.description,
                    address = EXCLUDED.address,
                    phone = EXCLUDED.phone,
                    website = EXCLUDED.website,
                    location = EXCLUDED.location,
                    updated_at = NOW()
                RETURNING id;
            `;

            const values = [
                place.osm_id,
                place.name,
                place.category,
                place.subcategory,
                place.description,
                place.address,
                place.phone,
                place.website,
                place.lon,
                place.lat,
                place.source
            ];

            try {
                await client.query(queryText, values);
                insertedCount++;
                process.stdout.write('.');
            } catch (err) {
                console.error(`\nError inserting ${place.name}:`, err.message);
            }
        }

        await client.query('COMMIT');
        console.log(`\n\nSuccessfully imported ${insertedCount} places from OSM.`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

importData();
