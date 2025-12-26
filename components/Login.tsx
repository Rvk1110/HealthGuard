
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: 'patient' | 'doctor') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8E1] overflow-hidden relative">
      {/* Decorative Organic Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A8E6CF] rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#004D40] rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#004D40] rounded-3xl flex items-center justify-center text-[#A8E6CF] font-black text-2xl mx-auto shadow-2xl mb-4 rotate-3">HG</div>
          <h1 className="text-4xl font-bold text-[#004D40]">HealthGuard</h1>
          <p className="text-sm font-semibold text-[#004D40]/60 uppercase tracking-widest mt-2">Digital Vitality Hub</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border-4 border-white rounded-[3rem] p-8 shadow-2xl shadow-[#004D40]/5">
          {/* Role Selection */}
          <div className="flex bg-[#FFF8E1] p-2 rounded-2xl mb-8">
            <button 
              onClick={() => setRole('patient')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${role === 'patient' ? 'bg-[#004D40] text-white shadow-lg' : 'text-[#004D40]/50'}`}
            >
              Patient
            </button>
            <button 
              onClick={() => setRole('doctor')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${role === 'doctor' ? 'bg-[#004D40] text-white shadow-lg' : 'text-[#004D40]/50'}`}
            >
              Doctor
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[#004D40] mb-2 text-center">Welcome Back</h2>
          <p className="text-center text-slate-500 text-sm mb-8">Choose your preferred login method to access your records securely.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Method Tabs */}
            <div className="flex gap-4 border-b-2 border-[#A8E6CF]/20 mb-6">
              <button 
                type="button"
                onClick={() => setMethod('email')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${method === 'email' ? 'border-[#004D40] text-[#004D40]' : 'border-transparent text-slate-400'}`}
              >
                Email Address
              </button>
              <button 
                type="button"
                onClick={() => setMethod('phone')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${method === 'phone' ? 'border-[#004D40] text-[#004D40]' : 'border-transparent text-slate-400'}`}
              >
                Phone Number
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">
                {method === 'email' ? 'Corporate or Personal Email' : 'Verified Mobile Number'}
              </label>
              <input 
                required
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={method === 'email' ? 'name@example.com' : '+1 234 567 890'}
                className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-[#004D40] placeholder:text-slate-300"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-[#004D40] text-white font-bold rounded-2xl shadow-xl shadow-[#004D40]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 text-[#A8E6CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Access Vault
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-[#004D40]/30">
            <div className="h-[1px] flex-1 bg-current"></div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Biometric Secure</span>
            <div className="h-[1px] flex-1 bg-current"></div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs">
          By accessing HealthGuard, you agree to our <span className="underline cursor-pointer">Privacy Charter</span> and <span className="underline cursor-pointer">Handshake Protocols</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
