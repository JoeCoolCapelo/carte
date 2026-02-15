import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

const ChatbotAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Bonjour ! Je suis votre assistant Camayenne Smart Map. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        // Simulation réponse IA contextuelle
        setTimeout(() => {
            let response = "Désolé, je ne comprends pas bien. Pouvez-vous préciser votre recherche à Camayenne ?";
            if (userMsg.toLowerCase().includes('pharmacie')) {
                response = "Il y a plusieurs pharmacies à Camayenne. La plus proche du port est ouverte 24h/24. Voulez-vous que je l'affiche sur la carte ?";
            } else if (userMsg.toLowerCase().includes('resto') || userMsg.toLowerCase().includes('manger')) {
                response = "Je vous recommande les restaurants près de la côte pour une belle vue. J'ai filtré la catégorie 'Restaurants' pour vous.";
            } else if (userMsg.toLowerCase().includes('bonjour') || userMsg.toLowerCase().includes('salut')) {
                response = "Bonjour ! Je suis l'assistant intelligent de Camayenne. Je peux vous aider à trouver un lieu ou un itinéraire.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[3000] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[380px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-6 animate-fade-up">
                    <div className="bg-blue-600 p-6 text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Sparkles size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Assistant IA</h3>
                                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Camayenne Local Guide</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Posez votre question..."
                                className="w-full bg-gray-50 border border-gray-100 py-4 pl-5 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium text-sm"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-2 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-90"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-blue-600 text-white shadow-blue-200'
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={32} fill="currentColor" />}
            </button>
        </div>
    );
};

export default ChatbotAI;
