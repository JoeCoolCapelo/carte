# MAQUETTES DÉTAILLÉES
## Application de Cartographie de Camayenne - Conakry, Guinée

---

## 1. CHARTE GRAPHIQUE

### 1.1 Palette de couleurs

**Couleurs principales**
- **Primaire** : #2196F3 (Bleu ciel) - Navigation, boutons principaux
- **Primaire foncé** : #1976D2 - États hover, headers
- **Secondaire** : #4CAF50 (Vert) - Succès, validations, lieux vérifiés
- **Accent** : #FF9800 (Orange) - Alertes, signalements, actions importantes
- **Erreur** : #F44336 (Rouge) - Erreurs, suppressions
- **Background** : #F5F5F5 (Gris très clair) - Fond de l'application
- **Surface** : #FFFFFF (Blanc) - Cartes, modales, panneaux
- **Texte principal** : #212121 (Noir presque pur)
- **Texte secondaire** : #757575 (Gris moyen)

**Couleurs des catégories de lieux**
- Restaurant : #FF5722 (Orange-rouge)
- Santé/Pharmacie : #00BCD4 (Cyan)
- Éducation : #9C27B0 (Violet)
- Commerce : #FFC107 (Jaune-orange)
- Tourisme : #E91E63 (Rose)
- Administration : #607D8B (Gris-bleu)

### 1.2 Typographie

**Famille de polices** : Roboto (Android/Web) OU SF Pro (iOS)

**Hiérarchie**
- **H1** : 24px, Bold, Couleur primaire
- **H2** : 20px, Bold, Texte principal
- **H3** : 18px, Medium, Texte principal
- **Body** : 16px, Regular, Texte principal
- **Caption** : 14px, Regular, Texte secondaire
- **Button** : 16px, Medium, ALL CAPS

### 1.3 Iconographie

**Bibliothèque** : Material Icons OU SF Symbols

**Icônes principales**
- Navigation : `navigation` (boussole)
- Recherche : `search`
- Localisation : `my_location`
- Favoris : `favorite` / `favorite_border`
- Menu : `menu`
- Signalement : `report_problem`
- Itinéraire : `directions`
- Plus : `add_circle`
- Fermer : `close`
- Retour : `arrow_back`

### 1.4 Composants de base

**Boutons**
- **Primaire** : Fond bleu #2196F3, texte blanc, border-radius 8px, padding 12px 24px
- **Secondaire** : Bordure bleu, texte bleu, fond transparent
- **Flottant (FAB)** : Cercle 56px, ombre portée, icône blanche

**Cartes (Cards)**
- Fond blanc
- Border-radius 12px
- Ombre : `0 2px 8px rgba(0,0,0,0.1)`
- Padding : 16px

**Champs de saisie**
- Border : 1px solid #E0E0E0
- Border-radius : 8px
- Padding : 12px 16px
- Focus : Border bleu #2196F3, ombre

---

## 2. MAQUETTES ÉCRAN PAR ÉCRAN

### ÉCRAN 1 : Écran d'accueil / Carte principale

#### Vue mobile (375x667px - iPhone SE)

```
┌─────────────────────────────────────┐
│ ☰  [Recherche un lieu...] 🔍      │ ← Header fixe, blanc, ombre
│─────────────────────────────────────│
│                                     │
│        🗺️ CARTE INTERACTIVE        │
│                                     │
│   📍 (Marqueur position actuelle)   │
│                                     │
│   🏪 (Marqueurs lieux d'intérêt)   │
│   🏥  🍴  🏫                        │
│                                     │
│   📌 (Marqueurs signalements)       │
│                                     │
│                                     │
│                                     │
│                   [➕] [📍]        │ ← Boutons flottants
│                   Zoom  Ma pos.     │
│                                     │
│─────────────────────────────────────│
│ [🧭] [⭐] [🚨] [👤]               │ ← Barre navigation
│ Carte Favoris Signaler Profil      │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header (hauteur 56px)**
   - Menu hamburger (gauche) : icône 3 barres, 24x24px
   - Barre de recherche (centre-droite) :
     - Largeur : 80% de l'écran
     - Placeholder : "Rechercher un lieu..."
     - Icône loupe à droite
     - Background : #F5F5F5
     - Border-radius : 24px

2. **Carte (hauteur variable, occupe l'espace restant)**
   - Tuiles OSM
   - Marqueur position actuelle : Cercle bleu pulsant avec précision (cercle translucide)
   - Marqueurs lieux : Pins colorés selon catégorie (15 icônes max visibles)
   - Marqueurs signalements : Triangles orange avec point d'exclamation
   - Zoom : Niveaux 13-18 (Camayenne)

3. **Boutons flottants (en bas à droite)**
   - **Bouton Zoom +/-** : 
     - 2 boutons superposés verticalement
     - Taille : 40x40px chacun
     - Background blanc, ombre
     - Icônes + et - grises
   - **Bouton "Ma position"** :
     - En dessous du zoom
     - Taille : 48x48px
     - Cercle bleu avec icône GPS blanche
     - Au clic : recentre la carte sur position actuelle

4. **Barre de navigation inférieure (hauteur 64px)**
   - 4 onglets équitablement répartis
   - Actif : Icône et texte en bleu
   - Inactif : Icône et texte en gris

**Interactions**
- **Tap sur marqueur lieu** → Affiche bottom sheet avec détails (voir Écran 3)
- **Tap sur marqueur signalement** → Affiche détails signalement
- **Long press sur carte** → Menu contextuel (Ajouter un favori / Itinéraire vers ici)
- **Recherche** → Affiche overlay résultats (voir Écran 2)
- **Swipe menu depuis gauche** → Ouvre menu latéral

---

### ÉCRAN 2 : Résultats de recherche

#### Overlay après saisie dans barre de recherche

```
┌─────────────────────────────────────┐
│ ←  [pharmacie camaye...] ✕         │
│─────────────────────────────────────│
│ Filtres: [Tous ▼] [Distance ▼]    │
│─────────────────────────────────────│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Pharmacie Kaloum              │ │
│ │ 📍 Avenue de la République       │ │
│ │ 🕒 Ouvert · 350m · ⭐ 4.2      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Pharmacie Tombo               │ │
│ │ 📍 Route de Donka                │ │
│ │ 🕒 Fermé · 1.2km · ⭐ 4.5      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Pharmacie Centrale            │ │
│ │ 📍 Quartier Madina               │ │
│ │ 🕒 Ouvert · 2.8km · ⭐ 4.0     │ │
│ └─────────────────────────────────┘ │
│                                     │
│      [Afficher sur la carte]        │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header recherche**
   - Flèche retour (gauche)
   - Champ de recherche avec texte saisi
   - Bouton effacer (X) à droite

2. **Filtres (hauteur 48px)**
   - 2 dropdowns côte à côte
   - **Catégorie** : Tous / Restaurant / Santé / Commerce / Tourisme / Éducation
   - **Tri** : Distance / Note / Nom

3. **Liste des résultats**
   - Cartes blanches avec ombre légère
   - Espacement : 12px entre cartes
   - Chaque carte contient :
     - Icône catégorie (32x32px, colorée)
     - Nom du lieu (18px, bold)
     - Adresse (14px, gris)
     - Statut ouvert/fermé (14px, vert/rouge)
     - Distance depuis position actuelle
     - Note moyenne avec étoile

4. **Bouton "Afficher sur la carte"**
   - En bas de la liste
   - Bleu, largeur pleine
   - Montre tous les résultats sur la carte

**Interactions**
- **Tap sur résultat** → Ouvre fiche détaillée (Écran 3)
- **Tap "Afficher sur carte"** → Retour à carte avec marqueurs des résultats
- **Scroll infini** → Charge plus de résultats (pagination)

---

### ÉCRAN 3 : Fiche détaillée d'un lieu

#### Bottom sheet qui apparaît au tap sur un marqueur

```
┌─────────────────────────────────────┐
│                                     │ ← Carte en arrière-plan (grisée)
│          📍 (Marqueur actif)        │
│                                     │
│════════════════════════════════════│
│ ┄┄┄ (Handle pour swipe)            │
│                                     │
│ 🏥  PHARMACIE KALOUM                │
│                                     │
│ ⭐⭐⭐⭐⭐ 4.5 (128 avis)           │
│                                     │
│ 📍 Avenue de la République          │
│    Camayenne, Conakry               │
│                                     │
│ 🕒 Ouvert · Ferme à 20h00           │
│    Lun-Sam: 8h-20h · Dim: Fermé     │
│                                     │
│ 📞 +224 622 XX XX XX                │
│                                     │
│ 💵 Prix: Moyen (€€)                 │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│ [📷 Photos (12)] [💬 Avis (128)]   │ ← Onglets
│                                     │
│ [🧭 ITINÉRAIRE]  [⭐ FAVORI]      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│ ✓ Informations vérifiées            │
│ 📝 Dernière mise à jour: Il y a 2j  │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Handle (en haut, 32x4px)**
   - Barre grise arrondie
   - Permet de swiper pour agrandir/réduire

2. **En-tête du lieu**
   - Icône catégorie large (48x48px)
   - Nom en gros (22px, bold)
   - Notes avec étoiles dorées
   - Nombre d'avis cliquable

3. **Informations clés (icônes + texte)**
   - Adresse complète avec icône pin
   - Horaires avec icône horloge
   - Téléphone cliquable (lance appel) avec icône téléphone
   - Gamme de prix (optionnel)

4. **Onglets de contenu**
   - Photos : Galerie horizontale scrollable
   - Avis : Liste des derniers avis avec notes

5. **Boutons d'action (hauteur 48px)**
   - **Itinéraire** : Bouton primaire bleu, icône navigation
   - **Favori** : Bouton secondaire, icône cœur (vide → plein)

6. **Métadonnées**
   - Badge "Vérifié" si validé par admin
   - Date dernière mise à jour

**États du bottom sheet**
- **Fermé** : Hauteur 0, caché
- **Petit** : 40% de hauteur écran (état par défaut)
- **Grand** : 80% de hauteur écran (après swipe up)
- **Plein écran** : 100% (après second swipe up)

**Interactions**
- **Swipe down** → Réduit/ferme le bottom sheet
- **Swipe up** → Agrandit le bottom sheet
- **Tap "Itinéraire"** → Ouvre écran calcul itinéraire (Écran 4)
- **Tap "Favori"** → Ajoute/retire des favoris (cœur s'anime)
- **Tap téléphone** → Ouvre l'application téléphone
- **Tap avis** → Ouvre liste complète des avis
- **Tap photos** → Ouvre galerie plein écran

---

### ÉCRAN 4 : Calcul d'itinéraire

```
┌─────────────────────────────────────┐
│ ← Itinéraire                        │
│─────────────────────────────────────│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔵 Ma position actuelle          │ │
│ │ Camayenne, près du marché        │ │
│ └─────────────────────────────────┘ │
│        │││ (Ligne pointillée)      │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Pharmacie Kaloum              │ │
│ │ Avenue de la République          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Mode de transport:                  │
│ [🚶 Marche] [🚗 Voiture] [🚌 Bus] │ ← Onglets actif=bleu
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│ 📏 Distance: 1.2 km                 │
│ ⏱️ Durée: 15 minutes                │
│ 🛣️ Via Avenue de la République     │
│                                     │
│        [DÉMARRER LA NAVIGATION]      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│        🗺️ APERÇU ITINÉRAIRE        │
│                                     │
│   [Mini carte avec tracé bleu]      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                     │
│ Instructions:                       │
│ 1️⃣ Partir vers le sud (50m)        │
│ 2️⃣ Tourner à droite sur Ave...     │
│ 3️⃣ Continuer tout droit (800m)     │
│ 4️⃣ Tourner à gauche (200m)         │
│ 5️⃣ Arrivée à destination           │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Sélection départ/arrivée**
   - 2 cartes blanches empilées
   - Icône cercle bleu pour départ
   - Icône pin pour destination
   - Ligne pointillée verticale entre les deux
   - Texte modifiable au tap

2. **Choix du mode de transport (48px hauteur)**
   - 3 onglets côte à côte
   - Icônes : Piéton / Voiture / Bus
   - Actif : Background bleu, icône blanche
   - Inactif : Background transparent, icône grise

3. **Résumé de l'itinéraire**
   - Distance totale avec icône règle
   - Durée estimée avec icône horloge
   - Nom de la rue principale

4. **Bouton "Démarrer la navigation"**
   - Large, bleu, hauteur 56px
   - Texte blanc, 18px, bold
   - Icône navigation à gauche

5. **Mini carte aperçu**
   - Hauteur 150px
   - Montre tracé complet de l'itinéraire en bleu
   - Points départ (vert) et arrivée (rouge)
   - Zoom auto pour montrer tout l'itinéraire

6. **Instructions détaillées**
   - Liste numérotée
   - Icônes de direction (flèches)
   - Distance pour chaque étape
   - Scrollable si > 5 étapes

**Interactions**
- **Tap départ/arrivée** → Ouvre recherche pour modifier
- **Tap mode transport** → Recalcule itinéraire
- **Tap "Démarrer"** → Lance navigation guidée (Écran 5)
- **Tap mini carte** → Agrandit en plein écran

**Cas particuliers**
- Si aucun itinéraire trouvé : Message "Aucun itinéraire disponible" avec suggestion
- Si mode Bus sans données : "Données transport non disponibles, essayez Marche"

---

### ÉCRAN 5 : Navigation guidée (en cours de route)

```
┌─────────────────────────────────────┐
│ ✕ Arrêter                     🔊 ON │
│─────────────────────────────────────│
│                                     │
│                                     │
│        🗺️ CARTE EN MOUVEMENT       │
│                                     │
│         📍 (Position actuelle       │
│             centrée, orientée)      │
│                                     │
│         ➡️ (Flèche direction)      │
│                                     │
│                                     │
│═════════════════════════════════════│
│                                     │
│  ⬆️ DANS 200M                       │ ← Instruction actuelle
│  Tourner à droite                   │    (fond bleu foncé)
│  sur Avenue de la République        │
│                                     │
│═════════════════════════════════════│
│                                     │
│ Encore 800m · 10 min                │ ← Barre de progression
│ ████████░░░░░░░░░░ 60%             │
│                                     │
│─────────────────────────────────────│
│ Suivant: Continuer tout droit       │ ← Prochaine instruction
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header compact (40px)**
   - Bouton "Arrêter" à gauche (rouge)
   - Icône son ON/OFF à droite (toggle instructions vocales)
   - Background noir translucide

2. **Carte en mode navigation**
   - Vue centrée sur position actuelle
   - Orientation selon boussole (nord en haut par défaut)
   - Tracé de l'itinéraire en bleu épais (4px)
   - Portion déjà parcourue en gris
   - Flèche de direction large et visible

3. **Panneau instruction actuelle (120px hauteur)**
   - Background bleu foncé (#1565C0)
   - Texte blanc, 24px pour distance
   - Icône de direction grande (64x64px)
   - Nom de rue en 18px
   - Position fixe en bas de carte

4. **Barre de progression**
   - Distance restante et temps
   - Barre de progression visuelle
   - Background blanc avec ombre

5. **Instruction suivante (preview)**
   - 1 ligne, texte petit (14px)
   - Gris clair sur fond blanc

**Interactions**
- **Tap "Arrêter"** → Confirme arrêt → Retour écran précédent
- **Tap icône son** → Active/désactive guidage vocal
- **Tap carte** → Affiche menu (Recentrer / Options / Quitter)
- **Arrivée à destination** → Écran de félicitations + bouton "Terminer"

**Guidage vocal**
- À 200m de l'action : "Dans 200 mètres, tournez à droite"
- À 50m : "Tournez à droite maintenant"
- Après action : "Continuez tout droit pendant 800 mètres"

---

### ÉCRAN 6 : Signaler un problème

```
┌─────────────────────────────────────┐
│ ← Signaler un problème         [✓] │
│─────────────────────────────────────│
│                                     │
│ Catégorie *                         │
│ ┌─────────────────────────────────┐ │
│ │ 🚧 Problème de voirie        ▼ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Titre *                             │
│ ┌─────────────────────────────────┐ │
│ │ Nid-de-poule avenue...         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description *                       │
│ ┌─────────────────────────────────┐ │
│ │ Grand nid-de-poule dangereux   │ │
│ │ sur la chaussée principale...  │ │
│ │                                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Photos * (min 1, max 5)             │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐           │
│ │📷 │ │ + │ │   │ │   │           │
│ └───┘ └───┘ └───┘ └───┘           │
│                                     │
│ Localisation                        │
│ 📍 Position actuelle détectée       │
│ Camayenne, près du marché           │
│ [📌 Modifier sur la carte]          │
│                                     │
│ Priorité                            │
│ ( ) Faible  (•) Normale  ( ) Urgente│
│                                     │
│                                     │
│      [ENVOYER LE SIGNALEMENT]       │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header**
   - Flèche retour
   - Titre "Signaler un problème"
   - Icône validation (grisée jusqu'à formulaire valide)

2. **Champ Catégorie (dropdown)**
   - Options :
     - 🚧 Problème de voirie
     - 💡 Éclairage public
     - 🗑️ Déchets / Insalubrité
     - 💧 Eau / Assainissement
     - 🚦 Signalisation
     - ⚠️ Autre

3. **Champ Titre (texte, max 100 caractères)**
   - Placeholder : "Résumez le problème en quelques mots"

4. **Champ Description (textarea, max 500 caractères)**
   - Placeholder : "Décrivez le problème en détail"
   - Compteur de caractères : "250/500"

5. **Section Photos**
   - Grille 4 colonnes
   - 1ère photo : Aperçu de la photo prise (70x70px)
   - Autres : Boutons "+" pour ajouter photos
   - Tap photo → Options : Voir / Supprimer / Remplacer
   - Tap "+" → Choix : Appareil photo / Galerie

6. **Section Localisation**
   - Icône pin avec texte auto-détecté
   - Adresse approximative
   - Bouton "Modifier" → Ouvre carte pour déplacer pin

7. **Section Priorité (radio buttons)**
   - 3 options horizontales
   - Faible (vert) / Normale (orange, par défaut) / Urgente (rouge)

8. **Bouton Envoyer**
   - Désactivé (gris) si formulaire incomplet
   - Actif (bleu) si tous les champs requis (*) remplis
   - Hauteur 56px, largeur pleine

**Validation**
- Catégorie : obligatoire
- Titre : obligatoire, min 10 caractères
- Description : obligatoire, min 20 caractères
- Photos : minimum 1, maximum 5
- Localisation : auto-détectée, modifiable

**Interactions**
- **Tap appareil photo** → Ouvre caméra native
- **Tap "Modifier localisation"** → Ouvre carte en mode sélection
- **Tap "Envoyer"** → 
  1. Affiche loader "Envoi en cours..."
  2. Upload photos vers serveur
  3. Envoi données formulaire
  4. Confirmation "Signalement envoyé ! N° #12345"
  5. Retour à la carte avec nouveau marqueur

**Écran de confirmation**
```
┌─────────────────────────────────────┐
│                                     │
│          ✅                         │
│                                     │
│   Signalement envoyé !              │
│                                     │
│   Numéro de suivi: #12345           │
│                                     │
│   Vous serez notifié des mises      │
│   à jour sur ce signalement.        │
│                                     │
│   [VOIR SUR LA CARTE]               │
│   [FAIRE UN AUTRE SIGNALEMENT]      │
│                                     │
└─────────────────────────────────────┘
```

---

### ÉCRAN 7 : Liste des favoris

```
┌─────────────────────────────────────┐
│ ← Mes favoris                  [✎] │
│─────────────────────────────────────│
│                                     │
│ Catégories: [Tous] [🏠] [💼] [🛒] │
│─────────────────────────────────────│
│                                     │
│ 🏠 DOMICILE                         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏠 Maison                        │ │
│ │ ⭐ Quartier Hamdallaye           │ │
│ │ 📍 850m · [🧭] [✏️] [🗑️]     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💼 TRAVAIL                          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Bureau                        │ │
│ │ ⭐ Avenue de la République       │ │
│ │ 📍 2.3km · [🧭] [✏️] [🗑️]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🛒 COURSES                          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏪 Marché Madina                 │ │
│ │ ⭐ Quartier Madina               │ │
│ │ 📍 1.5km · [🧭] [✏️] [🗑️]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Pharmacie habituelle          │ │
│ │ ⭐ Camayenne Centre              │ │
│ │ 📍 500m · [🧭] [✏️] [🗑️]     │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header**
   - Titre "Mes favoris"
   - Icône édition (crayon) → Mode édition

2. **Filtres par catégorie**
   - Chips horizontaux scrollables
   - Tous / Domicile / Travail / Courses / Autre
   - Catégorie active : bleu avec background

3. **Groupes de favoris**
   - Séparés par sections avec titres (H3, gris)
   - Organisation automatique par catégorie

4. **Cartes de favoris**
   - Icône de catégorie
   - Nom du favori (éditable)
   - Adresse
   - Distance depuis position actuelle
   - 3 boutons d'action :
     - 🧭 Itinéraire (bleu)
     - ✏️ Modifier (gris)
     - 🗑️ Supprimer (rouge)

**Mode édition (après tap icône crayon)**
- Checkboxes apparaissent à gauche de chaque carte
- Barre d'actions en bas : "Supprimer (X sélectionnés)" / "Annuler"
- Possibilité de sélection multiple

**Interactions**
- **Tap carte** → Ouvre fiche détaillée du lieu
- **Tap itinéraire** → Lance calcul itinéraire
- **Tap modifier** → Modal pour changer nom/catégorie/notes
- **Tap supprimer** → Confirmation → Suppression
- **Long press** → Sélection multiple + mode édition

**État vide**
```
┌─────────────────────────────────────┐
│                                     │
│          ⭐                         │
│                                     │
│   Aucun favori pour le moment       │
│                                     │
│   Ajoutez vos lieux préférés pour   │
│   y accéder rapidement !            │
│                                     │
│   [EXPLORER LA CARTE]               │
│                                     │
└─────────────────────────────────────┘
```

---

### ÉCRAN 8 : Menu latéral (Drawer)

```
┌─────────────────────┐
│                     │
│  👤 Utilisateur     │
│  user@email.com     │
│                     │
│─────────────────────│
│                     │
│ 🗺️  Carte          │
│                     │
│ 🔍  Recherche       │
│                     │
│ ⭐  Mes favoris     │
│                     │
│ 🚨  Mes signalements│
│                     │
│ 📊  Statistiques    │
│                     │
│─────────────────────│
│                     │
│ ⚙️  Paramètres      │
│                     │
│ ℹ️  À propos        │
│                     │
│ 📄  Mentions légales│
│                     │
│ 🚪  Déconnexion     │
│                     │
└─────────────────────┘
```

**Éléments détaillés**

1. **En-tête utilisateur (hauteur 120px)**
   - Background bleu dégradé
   - Avatar circulaire (64x64px)
   - Nom utilisateur (blanc, 18px)
   - Email (blanc, 14px, opacity 0.8)

2. **Menu principal**
   - Items de menu (hauteur 48px chacun)
   - Icône à gauche (24x24px)
   - Texte (16px, noir)
   - Ripple effect au tap

3. **Séparateur** (ligne grise fine)

4. **Menu secondaire**
   - Même style que menu principal
   - Items moins critiques

**Interactions**
- **Tap item** → Navigation vers écran correspondant + fermeture drawer
- **Tap "Déconnexion"** → Confirmation → Logout → Écran connexion
- **Swipe depuis gauche** → Ouvre drawer
- **Swipe vers gauche sur drawer** → Ferme drawer
- **Tap en dehors du drawer** → Ferme drawer

---

### ÉCRAN 9 : Profil utilisateur

```
┌─────────────────────────────────────┐
│ ← Profil                      [✏️] │
│─────────────────────────────────────│
│                                     │
│         👤                          │ ← Avatar 96x96px
│                                     │
│      Mamadou Diallo                 │
│      mamadou@email.com              │
│                                     │
│─────────────────────────────────────│
│                                     │
│ 📊 Mes statistiques                 │
│                                     │
│ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ │   12    │ │   45    │ │   3    ││
│ │ Signale-│ │ Lieux   │ │ Avis   ││
│ │  ments  │ │ visités │ │ donnés ││
│ └─────────┘ └─────────┘ └────────┘│
│                                     │
│─────────────────────────────────────│
│                                     │
│ 🏆 Badges obtenus                   │
│                                     │
│ [🗺️ Explorateur] [📸 Photographe]  │
│ [⭐ Contributeur] [🎯 Précis]       │
│                                     │
│─────────────────────────────────────│
│                                     │
│ Informations personnelles           │
│                                     │
│ Nom complet     Mamadou Diallo    › │
│ Email           mamadou@email...  › │
│ Téléphone       +224 622...       › │
│ Langue          Français          › │
│                                     │
│─────────────────────────────────────│
│                                     │
│ Préférences                         │
│                                     │
│ Notifications       [ON]            │
│ Partage position    [ON]            │
│ Mode sombre         [OFF]           │
│                                     │
│─────────────────────────────────────│
│                                     │
│ [CHANGER LE MOT DE PASSE]           │
│                                     │
│ [SUPPRIMER LE COMPTE]               │
│                                     │
└─────────────────────────────────────┘
```

**Éléments détaillés**

1. **Header profil**
   - Avatar avec possibilité de changer (tap → upload nouvelle photo)
   - Nom et email

2. **Statistiques**
   - 3 cartes côte à côte
   - Nombre en gros (24px)
   - Libellé en petit (12px)

3. **Badges/Achievements**
   - Grille de badges gagnés
   - Gris si non obtenu
   - Coloré si obtenu
   - Tap → Détails du badge

4. **Informations personnelles**
   - Liste de champs modifiables
   - Icône chevron à droite
   - Tap → Écran d'édition

5. **Préférences**
   - Toggles pour activer/désactiver
   - Changement immédiat

6. **Actions sensibles**
   - Boutons en bas
   - Style différent (bordure pour distinction)

**Interactions**
- **Tap avatar** → Upload nouvelle photo (caméra/galerie)
- **Tap statistique** → Détails (ex: liste de mes signalements)
- **Tap badge** → Modal explication + progression
- **Tap champ info** → Modal édition
- **Tap "Changer mot de passe"** → Formulaire avec ancien/nouveau
- **Tap "Supprimer compte"** → Confirmation double → Suppression

---

### ÉCRAN 10 : Vue desktop (responsive)

#### Écran large (1440x900px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ CAMAYENNE MAP    [Rechercher...]         👤 Mamadou  🔔      │ ← Header 64px
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│  📍 Carte    │                                                      │
│  🔍 Recherche│                                                      │
│  ⭐ Favoris  │              🗺️ CARTE PRINCIPALE                    │
│  🚨 Signaler │                                                      │
│  📊 Stats    │          (Largeur: 70% de l'écran)                  │
│              │                                                      │
│  ⚙️ Réglages │                                                      │
│              │                                                      │
│              │                                                      │
│   SIDEBAR    │                [Contrôles zoom]                      │
│   (280px)    │                [Bouton localisation]                 │
│              │                                                      │
│              │                                                      │
│              │                                                      │
│              │═══════════════════════════════════════════════════ │
│              │ PANNEAU DÉTAILS (si lieu sélectionné)               │
│              │                                                      │
│              │ 🏥  PHARMACIE KALOUM                                │
│              │ ⭐⭐⭐⭐⭐ 4.5 (128 avis)                          │
│              │ 📍 Avenue de la République                          │
│              │                                                      │
│              │ [ITINÉRAIRE]    [FAVORIS]    [AVIS]                │
│              └──────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────────┘
```

**Layout**

1. **Header horizontal fixe (hauteur 64px)**
   - Logo + nom app à gauche
   - Barre de recherche au centre (400px largeur)
   - Profil + notifications à droite

2. **Sidebar gauche fixe (largeur 280px)**
   - Navigation principale
   - Toujours visible
   - Scrollable si contenu dépasse

3. **Zone carte (70% de largeur restante)**
   - Carte en plein écran
   - Contrôles en overlay
   - Responsive selon largeur fenêtre

4. **Panneau détails (30% largeur ou overlay)**
   - Apparaît au tap sur marqueur
   - Peut être redimensionné
   - Bouton fermer en haut à droite

**Breakpoints responsive**

- **Desktop large (> 1440px)** : Layout 3 colonnes (sidebar + carte + panneau fixe)
- **Desktop (1024-1440px)** : Layout ci-dessus (sidebar + carte + panneau overlay)
- **Tablette (768-1024px)** : Sidebar réduite (icônes seulement) + carte + panneau
- **Mobile (< 768px)** : Carte plein écran + menu hamburger + bottom sheets

---

## 3. FLUX UTILISATEUR COMPLETS

### 3.1 Flux : Premier lancement de l'application

```
1. [Splash screen 2s]
   Logo Camayenne Map + loader

2. [Onboarding - Slide 1/3]
   Illustration carte
   "Explorez Camayenne facilement"
   → Swipe ou bouton "Suivant"

3. [Onboarding - Slide 2/3]
   Illustration navigation
   "Naviguez en temps réel"
   → Swipe ou bouton "Suivant"

4. [Onboarding - Slide 3/3]
   Illustration signalement
   "Contribuez à améliorer votre quartier"
   → Bouton "COMMENCER"

5. [Demande permissions localisation]
   Modal système OS
   "Camayenne Map souhaite accéder à votre position"
   → Autoriser / Refuser

6. [Écran carte principale]
   Si autorisé : carte centrée sur position
   Si refusé : carte centrée sur Camayenne
   → Utilisation normale
```

### 3.2 Flux : Recherche et navigation vers un lieu

```
1. [Écran carte]
   Tap barre de recherche en haut

2. [Overlay recherche]
   Saisie "pharmacie"
   → Autocomplétion en temps réel
   
3. [Résultats de recherche]
   Liste de 5 pharmacies
   Tap "Pharmacie Kaloum"

4. [Bottom sheet détails]
   Informations complètes du lieu
   Tap "ITINÉRAIRE"

5. [Écran calcul itinéraire]
   Départ: Ma position
   Arrivée: Pharmacie Kaloum
   Mode: Marche (par défaut)
   → Affiche: 1.2km, 15 min
   Tap "DÉMARRER LA NAVIGATION"

6. [Navigation guidée]
   Carte centrée, instructions vocales
   Suivi en temps réel jusqu'à arrivée

7. [Arrivée]
   Modal "Vous êtes arrivé !"
   Propositions: Ajouter avis / Favori / Terminer
```

### 3.3 Flux : Signalement d'un problème

```
1. [Écran carte]
   Tap bouton "Signaler" (navigation bas)

2. [Écran signalement vide]
   Formulaire à remplir
   Position GPS auto-détectée

3. [Sélection catégorie]
   Tap dropdown
   Choix "Problème de voirie"

4. [Saisie titre]
   "Nid-de-poule dangereux"

5. [Saisie description]
   "Grand trou sur la chaussée principale..."

6. [Ajout photos]
   Tap bouton "+"
   Choix "Appareil photo"
   Prise de 2 photos

7. [Vérification localisation]
   Position correcte
   (Sinon: Tap "Modifier" → Déplacer pin sur carte)

8. [Choix priorité]
   Sélection "Normale"

9. [Envoi]
   Tap "ENVOYER LE SIGNALEMENT"
   → Loader 2s
   → Confirmation avec numéro #12345

10. [Retour carte]
    Nouveau marqueur orange visible
    Toast "Signalement envoyé avec succès"
```

---

## 4. ÉTATS ET VARIANTES

### 4.1 États des composants

#### Boutons
- **Normal** : Couleur pleine, texte visible
- **Hover** : Légère surbrillance (+10% luminosité)
- **Pressed** : Effet ripple Android / Assombrissement iOS
- **Disabled** : Opacité 0.5, gris, non cliquable
- **Loading** : Spinner circulaire au centre

#### Champs de saisie
- **Empty** : Placeholder gris clair
- **Focused** : Bordure bleue, ombre
- **Filled** : Texte noir, fond blanc
- **Error** : Bordure rouge, message erreur en dessous
- **Disabled** : Gris, non éditable

#### Cartes
- **Normal** : Fond blanc, ombre légère
- **Hover** (desktop) : Ombre plus prononcée, légère élévation
- **Selected** : Bordure bleue 2px
- **Loading** : Skeleton loader (rectangles gris animés)

### 4.2 Modes sombre (optionnel post-MVP)

**Palette mode sombre**
- Background : #121212
- Surface : #1E1E1E
- Primaire : #64B5F6 (Bleu plus clair)
- Texte : #FFFFFF
- Texte secondaire : #B0B0B0

**Carte en mode sombre**
- Tiles OSM Dark (ou Mapbox Dark)
- Marqueurs avec contours lumineux
- Bottom sheets : fond #1E1E1E

---

## 5. ANIMATIONS ET MICRO-INTERACTIONS

### 5.1 Animations de transition

- **Ouverture bottom sheet** : Slide up 300ms, easing ease-out
- **Navigation entre écrans** : Slide horizontal 250ms
- **Apparition modal** : Fade in 200ms + scale up 0.9→1.0
- **Chargement** : Spinner rotation infinie, 1s par tour
- **Ajout favori** : Cœur scale up + remplissage rouge, 400ms
- **Markers** : Drop from top 500ms avec bounce

### 5.2 Feedback tactile

- **Tap bouton** : Ripple effect
- **Long press** : Vibration légère (50ms)
- **Erreur** : Shake animation (3 va-et-vient rapides)
- **Succès** : Toast vert avec icône ✓
- **Swipe refresh** : Pull to refresh avec loader circulaire

### 5.3 Micro-interactions carte

- **Zoom** : Animation fluide 300ms
- **Recentrage** : Pan + zoom animé vers position, 500ms
- **Apparition marqueurs** : Fade in + drop sequentiel (50ms décalage)
- **Sélection marqueur** : Bounce + changement couleur
- **Tracé itinéraire** : Dessin progressif du tracé (dash offset animation)

---

## 6. ACCESSIBILITÉ

### 6.1 Normes WCAG 2.1

- **Contraste** : Minimum 4.5:1 pour texte normal, 3:1 pour texte large
- **Taille touche** : Minimum 48x48dp pour zones cliquables
- **Navigation clavier** : Tab order logique, focus visible
- **Screen readers** : Labels ARIA sur tous les éléments interactifs
- **Texte** : Taille minimum 16px, scalable jusqu'à 200%

### 6.2 Adaptations

- **Daltonisme** : Éviter rouge/vert seul, ajouter icônes/textures
- **Malvoyants** : Mode haute lisibilité (texte gras, contrastes élevés)
- **Mobilité réduite** : Boutons larges, long press alternatifs
- **Audio** : Transcription des instructions vocales en texte

---

## 7. RESPONSIVE BREAKPOINTS

### Grille de breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile S | 320px | 1 col, stack vertical |
| Mobile M | 375px | 1 col, stack vertical |
| Mobile L | 425px | 1 col, stack vertical |
| Tablette | 768px | 2 cols, sidebar + carte |
| Laptop | 1024px | 2-3 cols, full layout |
| Desktop | 1440px | 3 cols, panneau fixe |
| Large | 1920px+ | 3 cols, large spacing |

### Adaptations par breakpoint

**< 768px (Mobile)**
- Menu hamburger
- Bottom navigation bar
- Carte plein écran
- Bottom sheets pour détails
- 1 colonne pour listes

**768-1024px (Tablette)**
- Sidebar icônes seulement (64px)
- Carte + panneau latéral (60/40%)
- 2 colonnes pour listes
- Touch optimisé

**> 1024px (Desktop)**
- Sidebar complète (280px)
- Carte + panneau (70/30%)
- Hover states
- 3 colonnes pour listes
- Keyboard navigation

---

## 8. VERSIONS ET ITÉRATIONS

### Version 1.0 (MVP - 2 jours)
✅ Écrans 1-6 (Carte, Recherche, Détails, Itinéraire, Navigation, Signalement)
✅ Fonctionnalités de base
❌ Authentification simplifiée ou absente
❌ Mode sombre
❌ Badges/Gamification

### Version 1.1 (+1 semaine)
✅ Écrans 7-9 (Favoris, Menu, Profil)
✅ Authentification complète
✅ Système d'avis
✅ Notifications push

### Version 2.0 (+1 mois)
✅ Mode sombre
✅ Mode hors-ligne
✅ Gamification (badges)
✅ Dashboard admin
✅ Analytics

---

**Document créé le** : 9 février 2026
**Version** : 1.0 - Maquettes détaillées
**Lié au cahier des charges** : Version 1.0

**Note** : Ces maquettes sont des descriptions textuelles détaillées. Pour des maquettes visuelles (Figma, Sketch), se référer aux fichiers de design séparés ou utiliser ces spécifications pour créer les designs finaux.
