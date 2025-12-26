
import React, { useEffect, useState } from 'react';
import { PatientProfile, MedicalRecord, AccessLog, ConsentGrant } from '../types';
import { getEmergencyBrief } from '../services/geminiService';

interface DashboardProps {
  profile: PatientProfile;
  records: MedicalRecord[];
  logs: AccessLog[];
  grants: ConsentGrant[];
  onRevoke: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, records, logs, grants, onRevoke }) => {
  const [brief, setBrief] = useState<string>('Synthesizing your emergency medical signature...');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  const activeGrants = grants.filter(g => g.status === 'Active');

  useEffect(() => {
    const fetchBrief = async () => {
      const text = await getEmergencyBrief(profile, records);
      setBrief(text || '');
    };
    fetchBrief();
  }, [profile, records]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(brief)}`;

  const filteredLogs = logs.filter(log => 
    log.actor.toLowerCase().includes(logSearch.toLowerCase()) || 
    log.action.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Active Access Alert Banner */}
      {activeGrants.length > 0 && (
        <div className="bg-[#A8E6CF]/20 border border-[#A8E6CF] rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A8E6CF] flex items-center justify-center text-[#004D40]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#004D40]">Active Data Handshake</p>
              <p className="text-xs text-[#004D40]/60">{activeGrants.length} verified clinicial node(s) currently synchronized.</p>
            </div>
          </div>
          <button 
            onClick={() => onRevoke(activeGrants[0].id)}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-100 px-3 py-1.5 rounded-lg shadow-sm"
          >
            Revoke Node
          </button>
        </div>
      )}

      {/* Hero Profile Card */}
      <div className="bg-[#004D40] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1 font-['Poppins']">Welcome, {profile.name}</h2>
              <p className="text-[#A8E6CF]/60 text-xs font-bold uppercase tracking-[0.2em]">Patient Node: {profile.id}</p>
            </div>
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="bg-[#A8E6CF] hover:bg-emerald-400 p-4 rounded-2xl border-4 border-white/20 transition-all flex items-center gap-3 shadow-xl group"
            >
              <svg className="w-6 h-6 text-[#004D40] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 002 2z"></path></svg>
              <span className="text-xs font-black text-[#004D40] uppercase tracking-widest">Emergency QR</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1 tracking-widest">Blood Type</p>
              <p className="text-2xl font-bold text-[#A8E6CF]">{profile.bloodGroup}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1 tracking-widest">Age Cycles</p>
              <p className="text-2xl font-bold text-[#A8E6CF]">{profile.age}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl col-span-2">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1 tracking-widest">Critical Sensitivities</p>
              <p className="text-sm font-bold truncate text-orange-200">{profile.allergies.join(', ')}</p>
            </div>
          </div>
        </div>
        {/* Leafy organic shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8E6CF]/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A8E6CF]/20">
            <h3 className="text-lg font-bold text-[#004D40] mb-4 flex items-center gap-2 font-['Poppins']">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Emergency Care Signature
            </h3>
            <div className="bg-[#FFF8E1] border-2 border-[#A8E6CF]/20 p-5 rounded-2xl relative overflow-hidden group">
              <p className="text-sm text-[#004D40] leading-relaxed font-semibold italic relative z-10">
                "{brief}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
                <svg className="w-3 h-3 text-[#A8E6CF]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                Gemini-Synthesized Response (30 words)
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-6 transition-transform">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm1 5a2 2 0 012 2v1a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1zm3 4a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1h-3z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A8E6CF]/20">
            <h3 className="text-lg font-bold text-[#004D40] mb-4 font-['Poppins']">Recent Clinical Events</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {records.slice(0, 2).map(record => (
                <div key={record.id} className="p-4 bg-[#A8E6CF]/10 rounded-2xl border border-[#A8E6CF]/30 hover:border-[#004D40]/30 transition-all">
                  <span className="text-[10px] font-black text-[#004D40] bg-[#A8E6CF] px-2 py-1 rounded mb-2 inline-block uppercase tracking-widest">{record.type}</span>
                  <p className="text-sm font-bold text-[#004D40] mb-2">{record.facility}</p>
                  <ul className="space-y-1">
                    {record.insights?.slice(0, 2).map((ins, i) => (
                      <li key={i} className="text-xs text-[#004D40]/70 flex items-start gap-2 font-medium leading-tight">
                        <div className="w-1 h-1 rounded-full bg-[#004D40]/30 mt-1.5 shrink-0" />
                        {ins}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A8E6CF]/20 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#004D40] mb-3 font-['Poppins']">Access Protocol Log</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search audit trail..." 
                className="w-full pl-9 pr-4 py-3 bg-[#FFF8E1] border border-[#A8E6CF]/30 rounded-xl text-xs text-black focus:ring-4 focus:ring-[#A8E6CF]/20 focus:outline-none transition-all placeholder:text-slate-400 font-bold"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
              <svg className="w-4 h-4 text-[#004D40]/30 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar mt-4">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              <div key={log.id} className="border-l-2 border-[#A8E6CF] pl-4 py-1 relative hover:bg-[#A8E6CF]/5 transition-colors group">
                <div className="absolute w-2 h-2 rounded-full bg-[#004D40] -left-[5px] top-2 group-hover:scale-125 transition-transform" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{log.timestamp}</p>
                <p className="text-sm font-bold text-[#004D40]">{log.actor}</p>
                <p className="text-xs text-[#004D40]/60">{log.action}</p>
              </div>
            )) : (
              <p className="text-center text-xs text-slate-400 py-4 font-bold uppercase tracking-widest">Clear Audit Trail</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-[#004D40] text-xs text-[#A8E6CF] rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#004D40]/10 hover:scale-[1.02] transition-transform">Download Security Audit</button>
        </div>
      </div>

      {/* QR Modal - Life Signature */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#004D40]/90 backdrop-blur-md"
            onClick={() => setIsQrModalOpen(false)}
          />
          <div className="relative bg-[#FFF8E1] rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border-8 border-white">
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-6 right-6 text-[#004D40]/40 hover:text-[#004D40] transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6 shadow-xl animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#004D40] mb-2 font-['Poppins']">Life Signature</h3>
              <p className="text-xs text-[#004D40]/60 mb-8 px-2 font-bold uppercase tracking-tight">For First Responders & Emergency Triage</p>
              
              <div className="bg-white p-4 rounded-3xl inline-block border-8 border-white shadow-2xl mb-8 group overflow-hidden">
                <img 
                  src={qrUrl} 
                  alt="Emergency Brief QR Code" 
                  className="w-56 h-56 mx-auto group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="text-left bg-[#004D40] p-5 rounded-2xl text-[#A8E6CF] border border-white/10 shadow-inner">
                <p className="text-[10px] font-black uppercase mb-2 tracking-widest opacity-50">Decoded Payload</p>
                <p className="text-xs italic leading-relaxed font-medium">
                  "{brief}"
                </p>
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified by HealthGuard Protocol Node</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
