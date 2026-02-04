"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    MoreVertical,
    Phone,
    Video,
    Send,
    Smile,
    Paperclip,
    Camera,
    Mic,
    CheckCheck
} from "lucide-react";
import { useState, useEffect } from "react";

const messages = [
    { id: 1, text: "Bonjour ! Je voudrais voir le menu.", sender: "user", time: "14:20" },
    { id: 2, text: "Bonjour ! Bienvenue chez Mafal-IA 🍽️. Voici notre menu du jour :", sender: "bot", time: "14:21" },
    { id: 3, text: "• Poulet Yassa - 3500 FCFA\n• Thieboudienne - 4000 FCFA\n• Jus de Bissap - 500 FCFA", sender: "bot", time: "14:21" },
    { id: 4, text: "Je vais prendre un Thieboudienne et un Bissap s'il vous plaît.", sender: "user", time: "14:22" },
    { id: 5, text: "Excellent choix ! 👍\n\nRécapitulatif :\n• Thieboudienne x1 : 4000 FCFA\n• Jus de Bissap x1 : 500 FCFA\n\nTotal : 4500 FCFA. Je confirme la commande ?", sender: "bot", time: "14:22" },
];

export function WhatsAppMockup() {
    const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const showNextMessage = (index: number) => {
            if (index >= messages.length) return;

            const nextMessage = messages[index];

            // Simulate typing for bot
            if (nextMessage.sender === "bot") {
                setIsTyping(true);
                timeout = setTimeout(() => {
                    setIsTyping(false);
                    setVisibleMessages(prev => [...prev, nextMessage]);
                    setTimeout(() => showNextMessage(index + 1), 2000);
                }, 1500);
            } else {
                timeout = setTimeout(() => {
                    setVisibleMessages(prev => [...prev, nextMessage]);
                    setTimeout(() => showNextMessage(index + 1), 1000);
                }, 1000);
            }
        };

        showNextMessage(0);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative w-full max-w-[380px] aspect-[9/18] bg-[#0b141a] rounded-[3rem] border-[8px] border-[#222c32] shadow-2xl overflow-hidden flex flex-col font-sans select-none">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#222c32] rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-black/20 rounded-full mb-1" />
            </div>

            {/* Header */}
            <div className="bg-[#202c33] p-4 pt-10 flex items-center justify-between text-white border-b border-[#2a3942] z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold relative">
                        M
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202c33]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold leading-none">Mafal-IA</h3>
                        <span className="text-xs text-green-400">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#aebac1]">
                    <Video size={20} />
                    <Phone size={20} />
                    <MoreVertical size={20} />
                </div>
            </div>

            {/* Chat Background with pattern overlay */}
            <div className="flex-1 overflow-hidden relative bg-[#0b141a]">
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: `url('https://wweb.dev/assets/whatsapp-chat-wallpaper.png')`, backgroundSize: '400px' }}
                />

                <div className="relative h-full overflow-y-auto p-4 flex flex-col gap-2 scrollbar-none">
                    <AnimatePresence initial={false}>
                        {visibleMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-2 px-3 rounded-lg text-sm relative shadow-md ${msg.sender === "user"
                                            ? "bg-[#005c4b] text-white rounded-tr-none"
                                            : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    <div className="flex justify-end items-center gap-1 mt-1">
                                        <span className="text-[10px] opacity-60">{msg.time}</span>
                                        {msg.sender === "user" && <CheckCheck size={14} className="text-blue-400" />}
                                    </div>

                                    {/* Bubble Tail */}
                                    <div className={`absolute top-0 w-2 h-3 ${msg.sender === "user"
                                            ? "-right-1 bg-[#005c4b] [clip-path:polygon(0_0,0_100%,100%_0)]"
                                            : "-left-1 bg-[#202c33] [clip-path:polygon(100%_0,100%_100%,0_0)]"
                                        }`} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-[#202c33] text-[#e9edef] p-2 px-3 rounded-lg rounded-tl-none flex items-center gap-2">
                                <span className="text-xs italic opacity-70">typing...</span>
                                <div className="flex gap-1">
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#202c33] p-3 flex items-center gap-2 text-[#aebac1]">
                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center gap-3">
                    <Smile size={22} className="shrink-0" />
                    <div className="text-sm flex-1 text-[#8696a0]">Message</div>
                    <Paperclip size={22} className="shrink-0 -rotate-45" />
                    <Camera size={22} className="shrink-0" />
                </div>
                <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Mic size={24} />
                </div>
            </div>

            {/* iOS Home Bar */}
            <div className="h-6 bg-[#202c33] flex justify-center items-center pb-2">
                <div className="w-32 h-1 bg-[#aebac1]/30 rounded-full" />
            </div>
        </div>
    );
}
