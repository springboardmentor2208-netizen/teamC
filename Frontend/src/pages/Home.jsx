import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import {
  FileText, ThumbsUp, CheckCircle2, Leaf, ArrowRight,
  MapPin, Zap, Globe, Star, Users, UserPlus, Shield,
  TrendingUp, Clock, ChevronRight, Sparkles, Award, Heart
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Animated Counter (IntersectionObserver)
═══════════════════════════════════════════════════════ */
function useCounter(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          let cur = 0;
          const timer = setInterval(() => {
            cur += target / steps;
            if (cur >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(cur));
          }, duration / steps);
        }
      }, { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ═══════════════════════════════════════════════════════
   Step Card
═══════════════════════════════════════════════════════ */
function StepCard({ step, icon: Icon, title, description, delay, gradient }) {
  return (
    <div
      className="relative bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

      <div className="relative inline-flex items-center justify-center mb-6">
        <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
          <Icon size={28} className="text-white" />
        </div>
        <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-primary/20 text-primary text-xs font-extrabold rounded-full flex items-center justify-center shadow-md">
          {step}
        </span>
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

      {step < 3 && (
        <div className="absolute top-1/2 -right-3 hidden md:flex items-center justify-center z-10">
          <div className="w-6 h-6 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
            <ChevronRight size={12} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Stat Card with animated counter
═══════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, target, suffix = '+', color, bgColor }) {
  const [count, ref] = useCounter(target);
  return (
    <div ref={ref}
      className="relative bg-white rounded-3xl border border-gray-100 shadow-lg p-7 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 ${bgColor} rounded-t-3xl`} />
      <div className={`inline-flex items-center justify-center w-14 h-14 ${bgColor.replace('bg-', 'bg-').replace('-500', '-50')} ${color} rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <div className="text-4xl font-black text-gray-900 mb-1 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Feature Row
═══════════════════════════════════════════════════════ */
function FeatureRow({ icon: Icon, title, description, gradient }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-colors group">
      <div className={`w-11 h-11 ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Testimonial Card
═══════════════════════════════════════════════════════ */
function TestiCard({ name, role, city, quote, avatar, delay }) {
  return (
    <div
      className="bg-white rounded-3xl border border-gray-100 shadow-lg p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow">
          {avatar}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">{name}</div>
          <div className="text-gray-400 text-xs">{role} · {city}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden pt-16 pb-24">

        {/* Background decorative mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full opacity-70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-primary/5 to-transparent rounded-full" />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#F56551" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-14 lg:gap-12">

          {/* ── Left: Text ── */}
          <div className="lg:w-[52%] text-center lg:text-left animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Community-powered civic reporting
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-gray-900">Make your</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                city cleaner,
              </span>
              <br />
              <span className="text-gray-800">together.</span>
            </h1>

            <p className="text-gray-500 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Report civic issues in seconds. The community votes, authorities respond, and cities transform—one report at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Link to="/report-issue">
                <button className="group btn-shimmer flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform duration-200 text-base">
                  <FileText size={18} />
                  Report an Issue
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/view-complaints">
                <button className="flex items-center gap-2.5 text-gray-700 font-bold px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all duration-200 bg-white shadow-md text-base">
                  <Globe size={18} />
                  View Reports
                </button>
              </Link>
            </div>

            {/* Trust: avatars + text */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2.5">
                {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                  <div key={i}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `hsl(${150 + i * 15},60%,40%)` }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5"><span className="font-bold text-gray-800">10,000+</span> citizens already reporting</p>
              </div>
            </div>
          </div>

          {/* ── Right: Floating card stack ── */}
          <div className="lg:w-[48%] flex justify-center relative">
            {/* Glow behind */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl opacity-40" />
            </div>

            {/* Main floating card */}
            <div className="relative animate-float">
              <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-100/60 border border-gray-100 p-6 w-80 sm:w-96 relative overflow-hidden">
                {/* Card top gradient strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-t-3xl" />

                <div className="flex items-center justify-between mb-5 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                      <Leaf size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-900 text-sm">Issue Reported</div>
                      <div className="text-xs text-gray-400">2 minutes ago · Hyderabad</div>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-600 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">Pending</span>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-primary/5 rounded-2xl p-4 mb-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🗑️</span>
                    <p className="text-sm text-gray-800 font-semibold">Overflowing garbage bin near park</p>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> Jubilee Hills, Hyderabad</p>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-medium">Community support</span>
                    <span className="text-primary font-bold">78%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-primary-hover h-2 rounded-full w-[78%] shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['E', 'R', 'S', 'M'].map((l, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow"
                        style={{ background: `hsl(${150 + i * 18},55%,42%)` }}>
                        {l}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 text-[9px] font-bold text-xs">+7</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp size={13} className="text-primary" />
                    <span className="text-xs text-gray-500 font-semibold">11 votes</span>
                  </div>
                </div>
              </div>

              {/* Badge 1 — top right */}
              <div className="animate-float-sm absolute -top-5 -right-5 bg-white border border-yellow-100 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star size={15} className="text-yellow-500 fill-yellow-400" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-800">Clean City!</div>
                  <div className="text-[10px] text-gray-400">Top rated area</div>
                </div>
              </div>

              {/* Badge 2 — bottom left */}
              <div className="animate-float-sm absolute -bottom-5 -left-5 bg-gradient-to-r from-primary to-primary-hover shadow-xl shadow-primary/20 rounded-2xl px-4 py-2.5 flex items-center gap-2.5" style={{ animationDelay: '1s' }}>
                <CheckCircle2 size={20} className="text-white flex-shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-white">1,240+ Resolved</div>
                  <div className="text-[10px] text-primary-light/80">Issues fixed this month</div>
                </div>
              </div>

              {/* Badge 3 — middle left */}
              <div className="animate-float-sm absolute top-1/2 -left-12 -translate-y-1/2 bg-white border border-blue-100 shadow-xl rounded-2xl px-3 py-2.5 hidden lg:flex items-center gap-2" style={{ animationDelay: '0.5s' }}>
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={13} className="text-blue-500" />
                </div>
                <div className="text-xs font-extrabold text-gray-800">↑ 32%<br /><span className="font-normal text-gray-400 text-[10px]">this week</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LOGO STRIP / TRUST BAR
      ══════════════════════════════════════════════════ */}
      <div className="bg-gray-50 border-y border-gray-100 py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Trusted in cities across India</p>
            {['Hyderabad', 'Mumbai', 'Bengaluru', 'Pune', 'Chennai', 'Delhi'].map(c => (
              <span key={c} className="text-gray-400 font-bold text-sm flex items-center gap-1.5">
                <MapPin size={12} className="text-primary" /> {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-slide-up">
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Zap size={13} /> Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              How It <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Three simple steps to create real change in your community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <StepCard step={1} icon={FileText} title="Report an Issue" description="Spot a problem? Submit a report with photos, location, and description in under 60 seconds. It's that simple." delay={0.1} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
            <StepCard step={2} icon={ThumbsUp} title="Community Votes" description="Your neighbors see the report and upvote it. Higher votes mean faster attention from local authorities." delay={0.2} gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
            <StepCard step={3} icon={CheckCircle2} title="Issue Resolved" description="Authorities are notified, action gets taken, and the status updates to Resolved. Your city thanks you!" delay={0.3} gradient="bg-gradient-to-br from-primary to-primary-hover" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES SPLIT SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Left: Visual */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Big glow */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-2xl opacity-60" />
              <div className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 space-y-4 animate-slide-up">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow">
                    <Shield size={17} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-primary">Pothole on Ring Road</div>
                    <div className="text-xs text-gray-400">Banjara Hills · 3 votes</div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-600 font-bold px-2 py-1 rounded-full flex-shrink-0">Pending</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center shadow">
                    <CheckCircle2 size={17} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Broken streetlight</div>
                    <div className="text-xs text-gray-400">Madhapur · 18 votes</div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded-full flex-shrink-0">✓ Resolved</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow">
                    <Clock size={17} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Waterlogging near school</div>
                    <div className="text-xs text-gray-400">Ameerpet · 9 votes</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-full flex-shrink-0">In Progress</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
                    <Sparkles size={17} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-violet-700">Garbage dumping in park</div>
                    <div className="text-xs text-gray-400">Kondapur · 5 votes</div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-600 font-bold px-2 py-1 rounded-full flex-shrink-0">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Feature list */}
          <div className="lg:w-1/2 animate-slide-up delay-200">
            <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-5">
              <Award size={13} /> Why CleanStreet
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              Built for real<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">civic impact</span>
            </h2>
            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
              Every feature is designed to make it faster and easier for communities to solve real problems.
            </p>
            <div className="space-y-1">
              <FeatureRow icon={Zap} title="Report in Under 60 Seconds" description="Simple, mobile-friendly form with photo upload and location auto-detect." gradient="bg-gradient-to-br from-yellow-400 to-orange-500" />
              <FeatureRow icon={ThumbsUp} title="Community Upvoting System" description="Issues with more votes get prioritized — the crowd decides what matters most." gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
              <FeatureRow icon={Shield} title="Verified Status Updates" description="Real-time status updates from Pending → In Progress → Resolved." gradient="bg-gradient-to-br from-primary to-primary-hover" />
              <FeatureRow icon={Heart} title="Build Community Pride" description="See local improvements happen and take credit as an active citizen." gradient="bg-gradient-to-br from-pink-500 to-rose-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full mb-4">
              <TrendingUp size={13} /> Community Impact
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
              Real results, <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">real fast</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            <StatCard icon={FileText} label="Total Reports Submitted" target={4820} suffix="+" color="text-blue-600" bgColor="bg-blue-500" />
            <StatCard icon={CheckCircle2} label="Issues Successfully Fixed" target={1240} suffix="+" color="text-primary" bgColor="bg-primary" />
            <StatCard icon={Users} label="Active Citizen Volunteers" target={320} suffix="+" color="text-violet-600" bgColor="bg-violet-500" />
            <StatCard icon={Globe} label="Cities Covered Nationwide" target={28} suffix="" color="text-amber-600" bgColor="bg-amber-500" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-slide-up">
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Heart size={13} /> Citizens Love It
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
              What people are <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">saying</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestiCard
              name="Aarav Sharma" role="Resident" city="Hyderabad"
              quote="I reported a pothole near my house and it was fixed within 10 days. I couldn't believe how fast it happened. CleanStreet actually works!"
              avatar="A" delay={0.1} />
            <TestiCard
              name="Priya Reddy" role="School Teacher" city="Pune"
              quote="The waterlogging near our school had been a problem for years. After reporting here, with 40+ votes, the municipality came and fixed drains in 2 weeks."
              avatar="P" delay={0.2} />
            <TestiCard
              name="Rohan Malhotra" role="Software Engineer" city="Bengaluru"
              quote="Super easy to use. Took me 2 minutes to report a broken streetlight and track its progress. More cities need this kind of platform."
              avatar="R" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary" />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/30 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-2xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold px-5 py-2 rounded-full mb-6">
            <Sparkles size={15} /> Join 10,000+ citizens
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Ready to clean up<br />your city?
          </h2>
          <p className="text-primary-light/90 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            It only takes 60 seconds to report an issue and start creating real, visible change in your community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <button className="group flex items-center gap-2.5 bg-white text-primary font-extrabold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-base">
                <UserPlus size={19} />
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/view-complaints">
              <button className="flex items-center gap-2.5 border-2 border-white/40 hover:border-white/80 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-sm text-base">
                <Globe size={19} />
                Browse Reports
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf size={18} className="text-white" />
                </div>
                <span className="font-extrabold text-white text-xl tracking-tight">
                  Clean<span className="text-primary">Street</span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Community-powered civic reporting platform making Indian cities cleaner, one report at a time.
              </p>
            </div>
            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="text-white font-bold mb-3 text-sm">Platform</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link to="/view-complaints" className="hover:text-primary transition-colors">Community</Link></li>
                  <li><Link to="/report-issue" className="hover:text-primary transition-colors">Report Issue</Link></li>
                  <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-sm">Account</h4>
                <ul className="space-y-2">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                  <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                  <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
                  <li><Link to="/admin" className="hover:text-primary transition-colors">Admin</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-sm">Contact</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> Hyderabad, India</li>
                  <li>support@cleanstreet.in</li>
                  <li>+91 98765 43210</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>© 2026 CleanStreet. All rights reserved.</span>
            <div className="flex items-center gap-1.5 text-gray-500">
              Made with <Heart size={12} className="text-red-500 fill-red-500" /> for cleaner cities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
