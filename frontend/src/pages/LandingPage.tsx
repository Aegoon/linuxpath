import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  CheckCircle2, 
  Users, 
  Video, 
  Award, 
  Zap, 
  Star, 
  ChevronRight, 
  Menu,
  X,
  ShieldCheck,
  Layout,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LandingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    document.title = "LinuxPath — Master the Linux Terminal through Hands-on Labs";
    
    // SEO Meta update (simple version)
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Go from zero to SysAdmin with real interactive terminal labs, short video lessons, and automated challenge checks.');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-[#FF5F1F] selection:text-white">
      
      {/* SECTION 1: NAVBAR */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5F1F] rounded-md flex items-center justify-center text-white">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">LinuxPath</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#curriculum" className="hover:text-[#FF5F1F] transition-colors">Courses</a>
            <a href="#pricing" className="hover:text-[#FF5F1F] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#FF5F1F] transition-colors">Blog</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/placement" 
              className="hidden md:block px-5 py-2.5 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-black/5 active:scale-95"
            >
              Get started
            </Link>
            
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6 font-bold text-lg">
                <a href="#curriculum" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF5F1F] transition-colors">Courses</a>
                <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF5F1F] transition-colors">Pricing</a>
                <a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF5F1F] transition-colors">Blog</a>
                <Link 
                  to="/placement" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl text-center shadow-xl shadow-black/10 active:scale-95 transition-all"
                >
                  Get started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTION 2: HERO */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Now in early access
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Learn Linux the way it <br className="hidden md:block" /> was meant to be learned
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Real terminal. Real commands. Hands-on labs that check your work automatically. 
            Go from zero to SysAdmin at your own pace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link 
              to="/placement"
              className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all group active:scale-95 shadow-xl shadow-black/10"
            >
              Take the placement test — it's free
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-gray-300 transition-all active:scale-95"
            >
              See how it works
            </button>
          </motion.div>

          {/* Terminal Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-[#0A0A0A] p-1"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#1A1A1A]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 text-[10px] uppercase font-bold tracking-widest text-gray-500 font-mono">bash — student@linuxpath</div>
            </div>
            
            <div className="p-8 text-left font-mono text-sm md:text-base leading-relaxed text-blue-50 font-medium">
              <div className="flex gap-3 mb-2">
                <span className="text-[#27C93F]">student@linuxpath:~$</span>
                <span>ls -la /etc/nginx</span>
              </div>
              <div className="text-gray-400 mb-4 whitespace-pre">
                total 12<br />
                drwxr-xr-x 2 root root 4096 Apr 20 12:00 .<br />
                drwxr-xr-x 3 root root 4096 Apr 20 11:50 ..<br />
                -rw-r--r-- 1 root root  204 Apr 20 12:00 nginx.conf
              </div>
              <div className="flex gap-3 mb-2">
                <span className="text-[#27C93F]">student@linuxpath:~$</span>
                <span>grep "server_name" nginx.conf</span>
              </div>
              <div className="text-gray-400 mb-4">
                server_name linuxpath.com;
              </div>
              <div className="flex gap-3">
                <span className="text-[#27C93F]">student@linuxpath:~$</span>
                <span className="w-2 h-5 bg-[#FF5F1F] animate-blink" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to master Linux</h2>
            <p className="text-gray-600 max-w-xl mx-auto font-medium">Ditch the PDFs. Learn with modern tools built for the way systems engineers actually work.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-orange-500" />, title: "In-browser terminal", desc: "A real Linux shell runs in your browser. No setup, no SSH, no VM." },
              { icon: <CheckCircle2 className="text-green-500" />, title: "Lab challenge validation", desc: "Run a command — we check your output automatically." },
              { icon: <Star className="text-yellow-500" />, title: "Placement test", desc: "Answer 10 questions and get placed at the right level instantly." },
              { icon: <Video className="text-blue-500" />, title: "Video lessons", desc: "Short focused videos, never more than 8 minutes. Paired with labs." },
              { icon: <Layout className="text-purple-500" />, title: "Streak tracking", desc: "Daily streaks keep you consistent. See every day you practiced." },
              { icon: <Award className="text-red-500" />, title: "Certificates", desc: "Earn a downloadable certificate per level. Share on LinkedIn." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-black/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CURRICULUM */}
      <section id="curriculum" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">5 levels from beginner to pro</h2>
            <p className="text-gray-600 font-medium font-technical uppercase tracking-widest text-xs">The Roadmap</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "L1", name: "Linux Novice", desc: "File navigation, basic edits, terminal shortcuts", badge: "Free", color: "bg-green-100 text-green-700 border-green-200" },
              { id: "L2", name: "File Master", desc: "Permissions, hard links, globbing, ownership", badge: "Pro", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { id: "L3", name: "SysAdmin Pro", desc: "Package managers, cron jobs, user management", badge: "Pro", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { id: "L4", name: "Network Architect", desc: "IP routing, DNS setup, firewalls (iptables/ufw)", badge: "Pro", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { id: "L5", name: "Kernel Hacker", desc: "Compiling source, kernel modules, performace tuning", badge: "Pro", color: "bg-blue-100 text-blue-700 border-blue-200" },
            ].map((level, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/course/${level.id}`)}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${level.color}`}>
                  {level.badge}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xl font-bold flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-gray-400 font-mono text-sm">{level.id}</span>
                    {level.name}
                  </h4>
                </div>
                <div className="text-gray-500 text-sm font-medium sm:text-right">
                  {level.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Simple, transparent pricing</h2>
            
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${!isYearly ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-12 h-6 bg-[#1A1A1A] rounded-full relative p-1 transition-colors"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-200 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-bold ${isYearly ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>Yearly (Save 31%)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="p-10 bg-white rounded-3xl border border-gray-200 flex flex-col h-full active:scale-[0.98] transition-transform">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-500 mb-2">Free Plan</h3>
                <div className="text-4xl font-black">$0<span className="text-sm font-normal text-gray-400">/forever</span></div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Level 1: Linux Novice course",
                  "In-browser terminal access",
                  "Free placement test",
                  "Basic streak tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="w-full py-4 text-center border-2 border-gray-900 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all">
                Start for free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-10 bg-white rounded-3xl border-2 border-blue-500 flex flex-col h-full relative shadow-2xl shadow-blue-500/10 active:scale-[0.98] transition-transform">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Most popular
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-blue-600 mb-2">Pro Access</h3>
                <div className="text-4xl font-black">
                  {isYearly ? '$99' : '$12'}
                  <span className="text-sm font-normal text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "All 5 levels (Novice to DevOps)",
                  "Official LinuxPath Certificates",
                  "Unlimited Terminal use",
                  "Priority support",
                  "Advanced Lab challenges"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#1A1A1A]">
                    <Zap size={18} className="text-blue-500 fill-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-[#1A1A1A] rounded-xl font-bold text-white hover:bg-black transition-all flex items-center justify-center gap-2">
                Get Pro
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by students worldwide</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Alex Chen", role: "Junior Developer", initial: "AC", quote: "The in-browser terminal is a game changer. I never knew I could learn grep and sed this fast without breaking my machine." },
              { name: "Sarah Miller", role: "UI Designer", initial: "SM", quote: "I needed basic CLI skills for my workflow. LinuxPath made it feel like a game rather than a chore. Finished L1 in a weekend." }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-blue-600">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA BAND */}
      <section className="py-20 px-6 bg-[#1A1A1A] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-medium">Take the free placement test. No signup required to see your level.</p>
          <Link 
            to="/placement"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1A1A1A] rounded-2xl font-black text-lg hover:bg-gray-100 transition-all active:scale-95 shadow-2xl shadow-black/20"
          >
            Take the placement test — free
            <Zap size={20} className="fill-[#1A1A1A]" />
          </Link>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF5F1F] rounded flex items-center justify-center text-white">
              <Terminal size={14} />
            </div>
            <span className="font-bold tracking-tight">LinuxPath</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
          </div>

          <div className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} LinuxPath, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
