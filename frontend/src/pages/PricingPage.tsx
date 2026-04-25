import React, { useState } from 'react';
import { Check, Zap, Shield, Rocket, HelpCircle, ChevronRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import api from '../lib/axios';

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = async (tier: string) => {
    if (tier === 'free') return;
    try {
      const response = await api.post('/api/billing/create-checkout', { 
        cycle: billingCycle 
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 pb-48">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="font-technical text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--accent)] mb-4 inline-block">Expansion Modules</span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase mb-6 leading-none">Choose your path to mastery.</h1>
        <p className="font-editorial text-xl italic text-slate-500">
          Level L1 is free forever. Unlock the deep kernel with our professional tier.
        </p>
      </div>

      {/* Cycle Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-white border border-slate-100 p-1 rounded-sm flex items-center shadow-sm">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "px-6 py-2 font-technical text-[10px] uppercase font-bold tracking-widest transition-all",
              billingCycle === 'monthly' ? "bg-[var(--ink)] text-white" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              "px-6 py-2 font-technical text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-2",
              billingCycle === 'yearly' ? "bg-[var(--ink)] text-white" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Yearly <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">-30%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Free Plan */}
        <PricingCard 
          title="Free Core"
          price="0"
          desc="Perfect for beginners starting their terminal journey."
          features={[
            "Full access to Level L1",
            "Basic terminal commands",
            "Browser-based sandbox",
            "Community support",
            "L1 Completion certificate"
          ]}
          cta="Start Learning"
          onCta={() => handleSubscribe('free')}
        />

        {/* Pro Plan */}
        <PricingCard 
          title="Pro Kernel"
          price={billingCycle === 'monthly' ? "12" : "9"}
          cycle={billingCycle === 'monthly' ? "mo" : "mo, billed yearly"}
          desc="Complete curriculum from L2-L5 plus advanced tools."
          features={[
            "Everything in Free",
            "Access to Levels L2-L5",
            "Advanced SysAdmin modules",
            "Unlimited sandbox hours",
            "Priority industry support",
            "Verified PDF Certificates",
            "Early access to new labs"
          ]}
          cta="Unlock Everything"
          highlight
          onCta={() => handleSubscribe('pro')}
        />
      </div>

      {/* Trust Badges */}
      <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-slate-100 pt-16">
         <TrustItem icon={<Shield size={20} />} text="Encrypted Payments" />
         <TrustItem icon={<Zap size={20} />} text="Instant Activation" />
         <TrustItem icon={<Rocket size={20} />} text="Cloud Sandboxes" />
         <TrustItem icon={<HelpCircle size={20} />} text="Expert Support" />
      </div>
    </div>
  );
}

function PricingCard({ title, price, desc, features, cta, cycle, highlight, onCta }: any) {
  return (
    <div className={cn(
      "p-12 border flex flex-col transition-all relative overflow-hidden",
      highlight 
        ? "bg-white border-[var(--ink)] shadow-2xl scale-105 z-10" 
        : "bg-slate-50 border-slate-200"
    )}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-[var(--accent)] text-white font-technical text-[8px] uppercase font-bold tracking-[0.2em] px-6 py-2 rotate-45 translate-x-12 -translate-y-2">
          Best Value
        </div>
      )}

      <div className="mb-10">
        <h3 className="font-technical text-xs uppercase font-bold tracking-[0.2em] text-slate-400 mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter text-[var(--ink)]">${price}</span>
          {cycle && <span className="text-slate-400 font-technical text-[10px] uppercase">/{cycle}</span>}
        </div>
        <p className="text-slate-500 font-editorial italic mt-4 text-sm leading-relaxed">{desc}</p>
      </div>

      <div className="flex-1 space-y-4 mb-12">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-start gap-3">
             <Check size={16} className={cn("shrink-0 mt-0.5", highlight ? "text-[var(--accent)]" : "text-slate-400")} />
             <span className="text-xs text-slate-600 leading-tight">{f}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onCta}
        className={cn(
          "w-full py-5 font-technical uppercase text-xs font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2",
          highlight 
            ? "bg-[var(--ink)] text-white hover:bg-[var(--accent)]" 
            : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
        )}
      >
        {cta} <ChevronRight size={16} />
      </button>
    </div>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
       <div className="text-slate-300">{icon}</div>
       <span className="font-technical text-[9px] uppercase font-bold tracking-widest text-slate-400">{text}</span>
    </div>
  );
}
