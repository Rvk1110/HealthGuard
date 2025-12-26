
import React, { useState } from 'react';
import { MedicalRecord, PatientProfile, AccessMode, ConsentGrant } from '../types';

interface DoctorDashboardProps {
  doctorName: string;
  sharedPatients: { profile: PatientProfile; records: MedicalRecord[]; grant: ConsentGrant }[];
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctorName, sharedPatients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const selectedData = sharedPatients.find(p => p.profile.id === selectedPatientId);

  // Mock patient discovery
  const searchResults = searchQuery.length > 3 ? [
    { id: 'HG-12-9981-Y', name: 'Ananya Verma', age: 28, status: 'Not Connected' },
    { id: 'HG-88-2234-A', name: 'Vikram Malhotra', age: 45, status: 'Not Connected' }
  ].filter(p => !sharedPatients.some(sp => sp.profile.id === p.id)) : [];

  const handleRequestAccess = (id: string) => {
    setRequestSent(id);
    setTimeout(() => setRequestSent(null), 3000);
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#004D40] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-1">Clinical Workspace</h2>
          <p className="text-[#A8E6CF]/60 text-xs font-bold uppercase tracking-[0.2em]">Practitioner: Dr. {doctorName}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 min-w-[150px]">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-1">Active Patients</p>
              <p className="text-2xl font-bold text-[#A8E6CF]">{sharedPatients.length}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[250px]">
              <p className="text-[10px] uppercase font-black text-[#A8E6CF]/60 mb-2">Patient Discovery (ID Search)</p>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Enter Patient ID (e.g., HG-12-9981-Y)..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-2 text-sm text-white focus:outline-none focus:bg-white/20 placeholder:text-white/40 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="w-4 h-4 text-white/40 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8E6CF]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 border-4 border-[#A8E6CF]/20 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-[#004D40]/40 uppercase tracking-widest mb-6">Discovery Results</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {searchResults.map(p => (
              <div key={p.id} className="flex items-center justify-between p-5 bg-[#FFF8E1] rounded-2xl border-2 border-white shadow-sm">
                <div>
                  <p className="font-black text-[#004D40]">{p.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {p.id} • {p.age} yrs</p>
                </div>
                <button 
                  onClick={() => handleRequestAccess(p.id)}
                  disabled={requestSent === p.id}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    requestSent === p.id ? 'bg-emerald-500 text-white' : 'bg-[#004D40] text-[#A8E6CF] hover:scale-105'
                  }`}
                >
                  {requestSent === p.id ? 'Request Sent' : 'Request Access'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Patient List Sidebar */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#A8E6CF]/20 flex flex-col h-full">
          <h3 className="text-sm font-black text-[#004D40]/30 uppercase tracking-widest mb-6">Patient Registry</h3>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {sharedPatients.map(({ profile, grant }) => (
              <button
                key={profile.id}
                onClick={() => setSelectedPatientId(profile.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedPatientId === profile.id 
                  ? 'bg-[#004D40] border-[#004D40] text-white shadow-lg' 
                  : 'bg-[#FFF8E1] border-transparent hover:border-[#A8E6CF] text-[#004D40]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{profile.name}</p>
                  <p className={`text-[9px] font-black uppercase tracking-tighter opacity-60`}>ID: {profile.id}</p>
                </div>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black border ml-2 shrink-0 ${
                  grant.mode === AccessMode.EMERGENCY ? 'bg-orange-500/20 border-orange-500 text-orange-700' : 
                  grant.mode === AccessMode.INCOGNITO ? 'bg-indigo-500/20 border-indigo-500 text-indigo-700' :
                  'bg-sky-500/20 border-sky-500 text-sky-700'
                }`}>
                  {grant.mode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Record Viewer */}
        <div className="md:col-span-2">
          {selectedData ? (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-white p-6 rounded-[2rem] border-4 border-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-black text-[#004D40]">
                    {selectedData.grant.mode === AccessMode.INCOGNITO ? 'Anonymized Subject' : selectedData.profile.name}
                  </h3>
                  <p className="text-xs text-[#004D40]/60 font-bold uppercase tracking-widest">
                    {selectedData.profile.age} Years • {selectedData.profile.bloodGroup} Blood Type
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  selectedData.grant.mode === AccessMode.EMERGENCY ? 'bg-orange-50 border-orange-200 text-orange-700' :
                  selectedData.grant.mode === AccessMode.INCOGNITO ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                  'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  <span className="text-[10px] font-black uppercase">{selectedData.grant.mode} Protocol Active</span>
                </div>
              </div>

              {selectedData.grant.mode === AccessMode.EMERGENCY ? (
                <div className="bg-white p-8 rounded-[2rem] border-4 border-white shadow-sm space-y-6">
                  <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                    <h4 className="text-[10px] font-black text-orange-600 uppercase mb-3 tracking-widest">Emergency Criticals Only</h4>
                    <p className="text-lg font-bold text-[#004D40] leading-relaxed italic">
                      "Life-saving data sharing active. Patient allergies: {selectedData.profile.allergies.join(', ')}. Chronic conditions include {selectedData.profile.chronicConditions.join(', ')}."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FFF8E1] p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-[#004D40]/40 uppercase mb-1">Primary Allergy</p>
                      <p className="text-sm font-bold text-red-600">{selectedData.profile.allergies[0] || 'None Known'}</p>
                    </div>
                    <div className="bg-[#FFF8E1] p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-[#004D40]/40 uppercase mb-1">Blood Group</p>
                      <p className="text-sm font-bold text-[#004D40]">{selectedData.profile.bloodGroup}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center opacity-50">
                    <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Longitudinal history hidden by Emergency Protocol</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-[#004D40]/30 uppercase tracking-widest pl-4">Clinical Stream</h4>
                  {selectedData.records.map(record => (
                    <div key={record.id} className="bg-white p-6 rounded-[2rem] border-4 border-white shadow-sm hover:border-[#A8E6CF] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[9px] font-black text-[#004D40] bg-[#A8E6CF] px-3 py-1 rounded-full uppercase">{record.type}</span>
                          <h4 className="text-lg font-bold text-[#004D40] mt-2">{record.facility}</h4>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">{record.date}</p>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{record.summary}"</p>
                      {record.insights && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {record.insights.map((ins, i) => (
                            <span key={i} className="text-[8px] bg-[#FFF8E1] text-[#004D40] px-2 py-1 rounded-lg border border-[#A8E6CF]/30 font-bold uppercase">{ins}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-20">
              <div className="w-24 h-24 bg-[#004D40] rounded-full flex items-center justify-center text-[#A8E6CF] mb-6 shadow-2xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-[#004D40]">Protocol Checkpoint: Select patient profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
