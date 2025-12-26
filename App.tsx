
import React, { useState } from 'react';
import { MedicalRecord, ConsentGrant, AccessLog, PatientProfile, AccessMode } from './types';
import Dashboard from './components/Dashboard';
import Vault from './components/Vault';
import ConsentManager from './components/ConsentManager';
import HealthChat from './components/HealthChat';
import Login from './components/Login';

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

type View = 'dashboard' | 'vault' | 'consent' | 'chat';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  return (
    <div className="min-h-screen pb-28 md:pb-0 md:pl-24 bg-[#FFF8E1]">
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-[#A8E6CF]/30 z-50 h-20 flex items-center px-8 justify-between md:left-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#004D40] rounded-2xl flex items-center justify-center text-[#A8E6CF] font-black shadow-lg shadow-[#004D40]/10">HG</div>
          <div>
            <span className="font-black text-[#004D40] text-lg">HealthGuard</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vitality System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#004D40] leading-none">{MOCK_PROFILE.name}</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Authenticated {userRole}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-12 h-12 rounded-2xl border-4 border-[#FFF8E1] bg-[#A8E6CF] overflow-hidden hover:bg-red-400 transition-colors flex items-center justify-center group"
          >
            <span className="text-white font-bold group-hover:hidden">RS</span>
            <svg className="w-6 h-6 text-white hidden group-hover:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-24 px-4 sm:px-6">
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
        {currentView === 'chat' && <HealthChat profile={MOCK_PROFILE} records={records} />}
      </main>

      {/* Modern Fixed Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-[#004D40]/90 backdrop-blur-lg text-white rounded-[2rem] shadow-2xl p-3 flex justify-around items-center z-50 md:bottom-auto md:top-6 md:left-6 md:bottom-6 md:right-auto md:flex-col md:w-20 md:gap-6 md:rounded-[2.5rem] border border-white/10">
        <button onClick={() => setCurrentView('dashboard')} className={`p-4 rounded-2xl transition-all ${currentView === 'dashboard' ? 'bg-[#A8E6CF] text-[#004D40] shadow-xl' : 'text-[#A8E6CF]/40 hover:text-[#A8E6CF]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        </button>
        <button onClick={() => setCurrentView('vault')} className={`p-4 rounded-2xl transition-all ${currentView === 'vault' ? 'bg-[#A8E6CF] text-[#004D40] shadow-xl' : 'text-[#A8E6CF]/40 hover:text-[#A8E6CF]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </button>
        <button onClick={() => setCurrentView('chat')} className={`p-4 rounded-2xl transition-all ${currentView === 'chat' ? 'bg-[#A8E6CF] text-[#004D40] shadow-xl' : 'text-[#A8E6CF]/40 hover:text-[#A8E6CF]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
        <button onClick={() => setCurrentView('consent')} className={`p-4 rounded-2xl transition-all ${currentView === 'consent' ? 'bg-[#A8E6CF] text-[#004D40] shadow-xl' : 'text-[#A8E6CF]/40 hover:text-[#A8E6CF]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
