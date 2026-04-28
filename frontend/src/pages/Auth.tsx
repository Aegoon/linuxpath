import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Terminal, ChevronRight } from 'lucide-react';

type Step = 'login' | 'signup' | 'verify';

export function Auth() {
  const [step, setStep] = useState<Step>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    if (!firstName || !lastName || !email || !password || !gender || !birthMonth || !birthDay || !birthYear) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            birth_date: `${birthYear}-${birthMonth}-${birthDay}`,
            gender,
          }
        }
      });
      if (error) throw error;
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    if (!verifyCode) {
      setError('Please enter the verification code.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verifyCode,
        type: 'signup'
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = Array.from({length: 31}, (_, i) => String(i + 1));
  const years = Array.from({length: 80}, (_, i) => String(new Date().getFullYear() - 16 - i));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF5F1F] rounded-md flex items-center justify-center text-white">
            <Terminal size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">LinuxPath</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* LOGIN */}
          {step === 'login' && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-500 mb-8">Sign in to continue learning Linux</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  <ChevronRight size={16} />
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <button onClick={() => { setStep('signup'); setError(''); }} className="text-[#FF5F1F] font-semibold hover:underline">
                  Create account
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP */}
          {step === 'signup' && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-gray-500 mb-8">Start your Linux journey today</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

              <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Youssef"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Amrani"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Date of birth</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={birthMonth}
                      onChange={e => setBirthMonth(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="">Month</option>
                      {months.map((m, i) => (
                        <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={birthDay}
                      onChange={e => setBirthDay(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="">Day</option>
                      {days.map(d => (
                        <option key={d} value={d.padStart(2, '0')}>{d}</option>
                      ))}
                    </select>
                    <select
                      value={birthYear}
                      onChange={e => setBirthYear(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="">Year</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                          gender === g
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-[#FF5F1F] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating account...' : 'Submit'}
                  <ChevronRight size={16} />
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <button onClick={() => { setStep('login'); setError(''); }} className="text-[#FF5F1F] font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* VERIFY */}
          {step === 'verify' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Terminal size={28} className="text-[#FF5F1F]" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-gray-500 mb-2">We sent a 6-digit verification code to</p>
              <p className="font-semibold text-[#1A1A1A] mb-8">{email}</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-1.5 text-left">Verification code</label>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify & continue'}
                <ChevronRight size={16} />
              </button>

              <p className="text-sm text-gray-400 mt-4">
                Didn't receive it?{' '}
                <button
                  onClick={handleSignup}
                  className="text-[#FF5F1F] font-semibold hover:underline"
                >
                  Resend code
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}