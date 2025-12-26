
import React, { useState } from 'react';
import { MedicalRecord, ConsentGrant, AccessLog, PatientProfile, AccessMode } from './types';
import Dashboard from './components/Dashboard';
import Vault from './components/Vault';
import ConsentManager from './components/ConsentManager';
import Login from './components/Login';
import DoctorDashboard from './components/DoctorDashboard';

const MOCK_PROFILE: PatientProfile = {
  id: 'HG-66-1029-X',
  name: 'Rahul Sharma',
  age: 32,
  bloodGroup: 'B+',
  allergies: ['Penicillin', 'Peanuts'],
  chronicConditions: ['Type 1 Diabetes']
};

const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    date: 'Oct 24, 2024',
    type: 'Blood Test',
    facility: 'Metropolis Labs',
    doctor: 'Lab Assistant',
    summary: 'Routine CBC and Vitamin D screening. Vitamin D found deficient (15ng/ml).',
    insights: ['Vitamin D Deficiency (Low)', 'Hemoglobin Normal']
  },
  {
    id: '2',
    date: 'Sep 12, 2024',
    type: 'Consultation',
    facility: 'AIIMS Delhi',
    doctor: 'Dr. Vikram Seth',
    summary: 'Quarterly diabetic follow-up. Blood sugar levels are stable. Advised to maintain current insulin pump dosage.',
    insights: ['Good Glycemic Control', 'No dosage change']
  }
];

const MOCK_GRANTS: ConsentGrant[] = [
  {
    id: 'g1',
    doctorName: 'Vikram Seth',
    specialization: 'Endocrinologist',
    facility: 'AIIMS Delhi',
    expiryDate: '2024-12-31',
    mode: AccessMode.STANDARD,
    status: 'Active'
  }
];

const MOCK_LOGS: AccessLog[] = [
  { id: 'l1', timestamp: '2h ago', actor: 'Dr. Vikram Seth', action: 'Accessed Lab Reports', purpose: 'Consultation' },
  { id: 'l2', timestamp: '1d ago', actor: 'Rahul Sharma', action: 'Uploaded MRI Scan', purpose: 'Self Management' }
];

type View = 'dashboard' | 'vault' | 'consent';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [grants, setGrants] = useState<ConsentGrant[]>(MOCK_GRANTS);
  const [logs, setLogs] = useState<AccessLog[]>(MOCK_LOGS);

  const handleLogin = (role: 'patient' | 'doctor') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentView('dashboard');
  };

  const addRecord = (record: MedicalRecord) => {
    setRecords(prev => [record, ...prev]);
    setLogs(prev => [{
      id: Math.random().toString(),
      timestamp: 'Just now',
      actor: 'Rahul Sharma',
      action: 'Added New Record',
      purpose: 'Self Management'
    }, ...prev]);
  };

  const addGrant = (grant: Omit<ConsentGrant, 'id'>) => {
    const newGrant = { ...grant, id: Math.random().toString() };
    setGrants(prev => [newGrant, ...prev]);
    setLogs(prev => [{
      id: Math.random().toString(),
      timestamp: 'Just now',
      actor: 'Rahul Sharma',
      action: `Granted Access to Dr. ${grant.doctorName}`,
      purpose: 'Care Continuity'
    }, ...prev]);
  };

  const revokeGrant = (id: string) => {
    setGrants(prev => prev.filter(g => g.id !== id));
    setLogs(prev => [{
      id: Math.random().toString(),
      timestamp: 'Just now',
      actor: 'Rahul Sharma',
      action: 'Revoked Access Grant',
      purpose: 'Privacy'
    }, ...prev]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = userRole === 'patient' ? [
    { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { id: 'vault', label: 'Vitality Stream', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
    { id: 'consent', label: 'Consent Engine', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> },
  ] : [
    { id: 'dashboard', label: 'Workspace', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex">
      {/* Collapsible Sidebar */}
      <nav 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`fixed left-0 top-0 bottom-0 bg-[#004D40] text-white z-[100] transition-all duration-300 ease-in-out shadow-2xl flex flex-col border-r border-white/5 ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-5 flex items-center gap-4 border-b border-white/10 h-20">
          <div className="w-10 h-10 bg-[#A8E6CF] rounded-2xl flex items-center justify-center text-[#004D40] font-black shrink-0 shadow-lg rotate-3">HG</div>
          {isSidebarExpanded && <span className="font-black text-lg tracking-tight animate-in fade-in slide-in-from-left-2">HealthGuard</span>}
        </div>

        <div className="mt-8 flex-1 px-3 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                currentView === item.id 
                ? 'bg-[#A8E6CF] text-[#004D40] shadow-xl' 
                : 'text-[#A8E6CF]/40 hover:text-[#A8E6CF] hover:bg-white/5'
              }`}
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
              {isSidebarExpanded && <span className="font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2">{item.label}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-300 hover:bg-red-500/20 transition-all group ${!isSidebarExpanded && 'justify-center'}`}
          >
            <svg className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {isSidebarExpanded && <span className="font-bold animate-in fade-in slide-in-from-left-2">Protocol Termination</span>}
          </button>
        </div>
      </nav>

      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 flex items-center px-8 justify-between bg-white/70 backdrop-blur-xl border-b border-[#A8E6CF]/30 sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[#004D40]/5 rounded-full flex items-center gap-2 border border-[#004D40]/10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-[#004D40] uppercase tracking-widest">{currentView}</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-[#004D40] leading-none">
                {userRole === 'doctor' ? 'Dr. Vikram Seth' : MOCK_PROFILE.name}
              </p>
              <p className="text-[9px] font-black text-emerald-600 uppercase mt-1 tracking-widest opacity-60">Verified {userRole} Interface</p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-8 animate-in fade-in duration-700">
          {userRole === 'patient' ? (
            <>
              {currentView === 'dashboard' && (
                <Dashboard 
                  profile={MOCK_PROFILE} 
                  records={records} 
                  logs={logs} 
                  grants={grants} 
                  onRevoke={revokeGrant}
                />
              )}
              {currentView === 'vault' && <Vault records={records} onAddRecord={addRecord} />}
              {currentView === 'consent' && <ConsentManager grants={grants} onGrant={addGrant} onRevoke={revokeGrant} />}
            </>
          ) : (
            <DoctorDashboard 
              doctorName="Vikram Seth" 
              sharedPatients={[{ profile: MOCK_PROFILE, records: records, grant: grants[0] }]} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
