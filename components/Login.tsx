
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: 'patient' | 'doctor') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [otpSent, setOtpSent] = useState(false);
  const [credentials, setCredentials] = useState({
    mobile: '',
    otp: '',
    email: '',
    licenseId: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8E1] overflow-hidden relative font-['Nunito']">
      {/* Decorative Organic Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A8E6CF] rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#004D40] rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#004D40] rounded-3xl flex items-center justify-center text-[#A8E6CF] font-black text-2xl mx-auto shadow-2xl mb-4 rotate-3">HG</div>
          <h1 className="text-4xl font-bold text-[#004D40] font-['Poppins']">HealthGuard</h1>
          <p className="text-sm font-semibold text-[#004D40]/60 uppercase tracking-widest mt-2">Verified Vitality Portal</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border-4 border-white rounded-[3rem] p-8 shadow-2xl shadow-[#004D40]/5">
          {/* Role Selection */}
          <div className="flex bg-[#FFF8E1] p-2 rounded-2xl mb-8">
            <button 
              onClick={() => { setRole('patient'); setOtpSent(false); }}
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

          <h2 className="text-2xl font-bold text-[#004D40] mb-2 text-center font-['Poppins']">
            {role === 'patient' ? 'Secure Biometric Login' : 'Practitioner Verification'}
          </h2>
          <p className="text-center text-slate-500 text-sm mb-8">
            {role === 'patient' 
              ? 'Passwordless entry via verified mobile node.' 
              : 'Authorized access for medical professionals.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {role === 'patient' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">Mobile Number</label>
                  <div className="relative">
                    <input 
                      required
                      type="tel"
                      name="mobile"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-black placeholder:text-slate-300 font-bold"
                      value={credentials.mobile}
                      onChange={handleInputChange}
                    />
                    {!otpSent && (
                      <button 
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="absolute right-2 top-2 px-4 py-2 bg-[#A8E6CF] text-[#004D40] font-black text-[10px] rounded-xl uppercase shadow-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                </div>
                {otpSent && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">One-Time Password</label>
                    <input 
                      required
                      type="text"
                      name="otp"
                      placeholder="6-Digit Verification Code"
                      className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-black placeholder:text-slate-300 font-bold tracking-[1em] text-center"
                      value={credentials.otp}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">Professional Email</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    placeholder="doctor@hospital.com"
                    className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-black placeholder:text-slate-300 font-bold"
                    value={credentials.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">Medical License ID</label>
                  <input 
                    required
                    type="text"
                    name="licenseId"
                    placeholder="NPI / NMC Registration No."
                    className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-black placeholder:text-slate-300 font-bold"
                    value={credentials.licenseId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#004D40] uppercase tracking-widest ml-4">Secure Password</label>
                  <input 
                    required
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/5 outline-none transition-all text-black placeholder:text-slate-300 font-bold"
                    value={credentials.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-[#004D40] text-white font-bold rounded-2xl shadow-xl shadow-[#004D40]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 text-[#A8E6CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Access Vital Hub
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-[#004D40]/30">
            <div className="h-[1px] flex-1 bg-current"></div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Cryptographic Handshake</span>
            <div className="h-[1px] flex-1 bg-current"></div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs">
          Professional users must maintain valid registration. <br/> 
          Patients: OTP verification replaces legacy passwords for <span className="underline font-bold">Privacy-First</span> security.
        </p>
      </div>
    </div>
  );
};

export default Login;
