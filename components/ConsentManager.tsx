
import React, { useState } from 'react';
import { ConsentGrant, AccessMode } from '../types';

interface ConsentManagerProps {
  grants: ConsentGrant[];
  onRevoke: (id: string) => void;
  onGrant: (grant: Omit<ConsentGrant, 'id'>) => void;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ grants, onRevoke, onGrant }) => {
  const [showNewGrant, setShowNewGrant] = useState(false);
  const [newGrant, setNewGrant] = useState({
    doctorName: '',
    specialization: '',
    facility: '',
    expiryDate: '',
    mode: AccessMode.STANDARD,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGrant({ ...newGrant, status: 'Active' });
    setShowNewGrant(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-[#004D40] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Consent Engine</h2>
          <p className="text-[#A8E6CF]/60 text-xs font-bold uppercase tracking-widest">Protocol-based Data Governance</p>
        </div>
        <button 
          onClick={() => setShowNewGrant(!showNewGrant)}
          className="bg-[#A8E6CF] text-[#004D40] px-8 py-4 rounded-2xl text-xs font-black shadow-lg transition-all hover:scale-105 active:scale-95 relative z-10 uppercase tracking-widest"
        >
          {showNewGrant ? 'Cancel Protocol' : 'Issue New Grant'}
        </button>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
      </div>

      {showNewGrant && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-[#004D40]/50 uppercase mb-2 tracking-widest ml-1">Practitioner Details</label>
                <div className="space-y-3">
                  <input 
                    placeholder="Doctor Name"
                    required
                    className="w-full p-4 bg-[#FFF8E1] border-2 border-[#A8E6CF]/30 rounded-2xl text-black focus:bg-white focus:border-[#004D40] outline-none transition-all font-bold"
                    value={newGrant.doctorName}
                    onChange={e => setNewGrant({...newGrant, doctorName: e.target.value})}
                  />
                  <input 
                    placeholder="Clinical Specialization"
                    required
                    className="w-full p-4 bg-[#FFF8E1] border-2 border-[#A8E6CF]/30 rounded-2xl text-black focus:bg-white focus:border-[#004D40] outline-none transition-all font-bold"
                    value={newGrant.specialization}
                    onChange={e => setNewGrant({...newGrant, specialization: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#004D40]/50 uppercase mb-2 tracking-widest ml-1">Lifecycle Management</label>
                <input 
                  required
                  type="date"
                  className="w-full p-4 bg-[#FFF8E1] border-2 border-[#A8E6CF]/30 rounded-2xl text-black focus:bg-white focus:border-[#004D40] outline-none transition-all font-bold"
                  value={newGrant.expiryDate}
                  onChange={e => setNewGrant({...newGrant, expiryDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-[#004D40]/50 uppercase mb-2 tracking-widest ml-1">Privacy Tier & Mode</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { mode: AccessMode.STANDARD, label: 'Standard Mode', desc: 'Right data for the right doctor' },
                  { mode: AccessMode.EMERGENCY, label: 'Emergency Mode', desc: 'Life-saving data only' },
                  { mode: AccessMode.INCOGNITO, label: 'Incognito Mode', desc: 'Privacy first, identity last' },
                ].map(item => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setNewGrant({...newGrant, mode: item.mode})}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      newGrant.mode === item.mode 
                      ? 'bg-[#004D40] border-[#004D40] text-white' 
                      : 'bg-[#FFF8E1] border-transparent hover:border-[#A8E6CF] text-[#004D40]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-xs uppercase tracking-tight">{item.label}</span>
                      {newGrant.mode === item.mode && <svg className="w-4 h-4 text-[#A8E6CF]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>}
                    </div>
                    <p className={`text-[10px] leading-tight font-medium italic ${newGrant.mode === item.mode ? 'text-[#A8E6CF]/80' : 'text-slate-500'}`}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#004D40] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#004D40]/20 hover:bg-black transition-all">
            Initiate Secure Handshake
          </button>
        </form>
      )}

      <div className="space-y-4">
        {grants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-[#A8E6CF]/30">
            <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#A8E6CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-1.121A11.95 11.95 0 0012 17c4.418 0 8 3.582 8 8M0 8c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
            </div>
            <p className="text-[#004D40]/30 font-bold uppercase text-xs tracking-[0.2em]">Zero active vital connections</p>
          </div>
        ) : (
          grants.map(grant => (
            <div key={grant.id} className="bg-white p-6 rounded-[2rem] shadow-lg border-4 border-white flex justify-between items-center group hover:border-[#A8E6CF] transition-all relative overflow-hidden">
               {grant.mode === AccessMode.EMERGENCY && <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12"></div>}
              <div className="flex gap-4 items-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#A8E6CF] flex items-center justify-center text-[#004D40] font-black text-xl shadow-lg border-2 border-white">
                  {grant.doctorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#004D40] text-lg">Dr. {grant.doctorName}</h3>
                  <p className="text-[10px] text-[#004D40]/40 font-black uppercase tracking-widest">{grant.specialization}</p>
                  <div className="flex gap-2 mt-3 items-center">
                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                      grant.status === 'Active' ? 'bg-[#A8E6CF] text-[#004D40]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {grant.status}
                    </span>
                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                      grant.mode === AccessMode.EMERGENCY ? 'bg-orange-500 text-white shadow-sm' : 
                      grant.mode === AccessMode.INCOGNITO ? 'bg-indigo-500 text-white shadow-sm' :
                      'bg-[#004D40] text-[#A8E6CF]'
                    }`}>
                      {grant.mode}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold ml-2">Until {grant.expiryDate}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onRevoke(grant.id)}
                className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent relative z-10"
              >
                Revoke Protocol
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManager;
