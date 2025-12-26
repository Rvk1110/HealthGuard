
import React, { useState, useEffect, useRef } from 'react';
import { PatientProfile, MedicalRecord } from '../types';
import { createHealthChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface HealthChatProps {
  profile: PatientProfile;
  records: MedicalRecord[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const HealthChat: React.FC<HealthChatProps> = ({ profile, records }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello ${profile.name}, I'm your HealthGuard Assistant. I've reviewed your records. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sysInstruction = `You are a medical assistant for ${profile.name} (Age: ${profile.age}, Blood: ${profile.bloodGroup}).
    Known Allergies: ${profile.allergies.join(', ')}.
    Patient Records Summary: ${records.map(r => `${r.date} ${r.type}: ${r.summary}`).join(' | ')}.
    Answer user questions based on their records and profile. Be helpful, concise, and always include a medical disclaimer. Use Gemini 3 Pro capabilities for complex reasoning.`;
    
    chatRef.current = createHealthChat(sysInstruction);
  }, [profile, records]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input || isLoading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userText });
      const response = result as GenerateContentResponse;
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'I apologize, I could not generate a response.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to my medical brain.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Health Assistant</h3>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 3 Pro Active
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask about your reports or health..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">AI can make mistakes. Consult a doctor for medical advice.</p>
      </div>
    </div>
  );
};

export default HealthChat;
