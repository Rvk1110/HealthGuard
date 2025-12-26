
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
  const [brief, setBrief] = useState<string>('Analyzing records for critical brief...');
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(brief)}`;

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
              <p className="text-sm font-bold text-[#004D40]">Active Vitality Handshake</p>
              <p className="text-xs text-[#004D40]/60">{activeGrants.length} clinician(s) are currently connected to your profile.</p>
            </div>
          </div>
          <button 
            onClick={() => onRevoke(activeGrants[0].id)}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-100 px-3 py-1.5 rounded-lg shadow-sm"
          >
            Revoke All
          </button>
        </div>
      )}

      {/* Hero Profile Card */}
      <div className="bg-[#004D40] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1">Stay Healthy, {profile.name}</h2>
              <p className="text-[#A8E6CF]/60 text-xs font-bold uppercase tracking-[0.2em]">Bio-Identifier: {profile.id}</p>
            </div>
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-[#A8E6CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 002 2z"></path></svg>
              <span className="text-xs font-bold">Life QR</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1">Blood Type</p>
              <p className="text-2xl font-bold text-[#A8E6CF]">{profile.bloodGroup}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1">Age Cycles</p>
              <p className="text-2xl font-bold text-[#A8E6CF]">{profile.age}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl col-span-2">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1">Biological Sensitivity</p>
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
            <h3 className="text-lg font-bold text-[#004D40] mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#A8E6CF] animate-pulse" />
              Emergency Care Snapshot
            </h3>
            <div className="bg-[#FFF8E1] border-2 border-[#A8E6CF]/20 p-5 rounded-2xl">
              <p className="text-sm text-[#004D40] leading-relaxed font-semibold italic">
                "{brief}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <svg className="w-3 h-3 text-[#A8E6CF]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                AI Biological Optimization
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A8E6CF]/20">
            <h3 className="text-lg font-bold text-[#004D40] mb-4">Nature's Health Scan</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {records.slice(0, 2).map(record => (
                <div key={record.id} className="p-4 bg-[#A8E6CF]/10 rounded-2xl border border-[#A8E6CF]/20">
                  <span className="text-[10px] font-black text-[#004D40] bg-[#A8E6CF] px-2 py-1 rounded mb-2 inline-block uppercase">{record.type}</span>
                  <p className="text-sm font-bold text-[#004D40] mb-2">{record.facility}</p>
                  <ul className="space-y-1">
                    {record.insights?.slice(0, 2).map((ins, i) => (
                      <li key={i} className="text-xs text-[#004D40]/60 flex items-start gap-2 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#004D40]/20 mt-1 shrink-0" />
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
            <h3 className="text-lg font-bold text-[#004D40] mb-3">Transparency Log</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full pl-9 pr-4 py-3 bg-[#FFF8E1] border border-[#A8E6CF]/30 rounded-xl text-xs text-[#004D40] focus:ring-4 focus:ring-[#A8E6CF]/20 focus:outline-none transition-all placeholder:text-slate-400"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
              <svg className="w-4 h-4 text-[#004D40]/30 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar mt-4">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              <div key={log.id} className="border-l-2 border-[#A8E6CF] pl-4 py-1 relative hover:bg-[#A8E6CF]/5 transition-colors">
                <div className="absolute w-2 h-2 rounded-full bg-[#004D40] -left-[5px] top-2" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{log.timestamp}</p>
                <p className="text-sm font-bold text-[#004D40]">{log.actor}</p>
                <p className="text-xs text-[#004D40]/60">{log.action}</p>
              </div>
            )) : (
              <p className="text-center text-xs text-slate-400 py-4">No data found</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-[#004D40] text-xs text-[#A8E6CF] rounded-xl font-bold shadow-lg shadow-[#004D40]/10">Security Analytics</button>
        </div>
      </div>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#004D40]/80 backdrop-blur-md"
            onClick={() => setIsQrModalOpen(false)}
          />
          <div className="relative bg-[#FFF8E1] rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-white">
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-6 right-6 text-[#004D40]/40 hover:text-[#004D40] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A8E6CF] rounded-2xl flex items-center justify-center text-[#004D40] mx-auto mb-6 shadow-xl shadow-[#A8E6CF]/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#004D40] mb-2">Life Scan QR</h3>
              <p className="text-sm text-[#004D40]/60 mb-8 px-2">Access key for first responders to view your biological criticals.</p>
              
              <div className="bg-white p-4 rounded-3xl inline-block border-8 border-white shadow-2xl mb-8">
                <img 
                  src={qrUrl} 
                  alt="Emergency Brief QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="text-left bg-[#004D40] p-5 rounded-2xl text-[#A8E6CF]">
                <p className="text-[10px] font-black uppercase mb-2 tracking-widest opacity-50">Secure Manifest</p>
                <p className="text-xs italic leading-relaxed">
                  "{brief}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
