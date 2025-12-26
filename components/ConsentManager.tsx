
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Smart Consent Engine</h2>
        <button 
          onClick={() => setShowNewGrant(!showNewGrant)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-200"
        >
          + Grant Access
        </button>
      </div>

      {showNewGrant && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Doctor Name</label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none"
                value={newGrant.doctorName}
                onChange={e => setNewGrant({...newGrant, doctorName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none"
                value={newGrant.specialization}
                onChange={e => setNewGrant({...newGrant, specialization: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Access Mode</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none"
                value={newGrant.mode}
                onChange={e => setNewGrant({...newGrant, mode: e.target.value as AccessMode})}
              >
                <option value={AccessMode.STANDARD}>Standard (Full History)</option>
                <option value={AccessMode.INCOGNITO}>Incognito (Anonymous)</option>
                <option value={AccessMode.EMERGENCY}>Emergency (Critical Only)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Access Expiry</label>
              <input 
                required
                type="date"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none"
                value={newGrant.expiryDate}
                onChange={e => setNewGrant({...newGrant, expiryDate: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">
            Generate Access Token
          </button>
        </form>
      )}

      <div className="space-y-4">
        {grants.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">No active consent grants found.</p>
          </div>
        ) : (
          grants.map(grant => (
            <div key={grant.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {grant.doctorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Dr. {grant.doctorName}</h3>
                  <p className="text-xs text-slate-500">{grant.specialization} • {grant.facility}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      grant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {grant.status}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold uppercase tracking-wider">
                      {grant.mode}
                    </span>
                    <span className="text-[10px] text-slate-400 pt-0.5">Expires: {grant.expiryDate}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onRevoke(grant.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Revoke Access
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManager;
