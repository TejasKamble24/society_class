/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Calculator, 
  PieChart as PieChartIcon, 
  LayoutDashboard, 
  ChevronLeft,
  Building2,
  GraduationCap,
  CheckCircle2,
  BarChart3,
  Target,
  IndianRupee,
  Eye,
  Heart,
  Mail,
  MessageSquare,
  Star,
  Phone,
  Globe,
  Lock,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type View = 'home' | 'visitor' | 'admin';

// --- Components ---

const Card = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string; key?: React.Key }) => (
  <div id={id} className={cn("bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm", className)}>
    {children}
  </div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{children}</h2>
    {subtitle && <p className="text-zinc-500 mt-2 text-lg">{subtitle}</p>}
  </div>
);

// --- Home View ---
const HomeView = ({ onNavigate }: { onNavigate: (view: View) => void }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin@2411') {
      onNavigate('admin');
      setShowPasswordModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          Society Tuition Model
        </h1>
        <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
          Revolutionizing education by bringing quality learning to the doorstep of every student.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('visitor')}
          className="group text-left"
          id="visitor-entry-card"
        >
          <Card className="h-full border-2 border-transparent group-hover:border-emerald-500 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Visitor</h3>
            <p className="text-zinc-500 text-lg">
              Understand the concept of Society Tuition Model.
            </p>
            <div className="mt-6 flex items-center text-emerald-600 font-semibold">
              Explore Concept <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Card>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdminClick}
          className="group text-left"
          id="admin-entry-card"
        >
          <Card className="h-full border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Admin</h3>
            <div className="mt-6 flex items-center text-indigo-600 font-semibold">
              View Insights <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Card>
        </motion.button>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Admin Access</h3>
                <p className="text-zinc-500 mb-8">Please enter the administrator password to continue.</p>
                
                <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
                  <div className="space-y-2">
                    <input
                      type="password"
                      autoFocus
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter password"
                      className={cn(
                        "w-full px-4 py-4 rounded-2xl border-2 outline-none transition-all text-center text-lg font-bold tracking-widest",
                        error ? "border-red-500 bg-red-50" : "border-zinc-100 bg-zinc-50 focus:border-indigo-500 focus:bg-white"
                      )}
                    />
                    {error && (
                      <p className="text-red-500 text-sm font-bold">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Verify & Enter
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Visitor Dashboard ---
const VisitorDashboard = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Sub-Navigation for Visitor Dashboard */}
      <div className="sticky top-[73px] z-40 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-200 py-3 overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap">
          {[
            { label: 'Home', id: 'visitor-home' },
            { label: 'Mission-Vision', id: 'visitor-mission' },
            { label: 'How we help you', id: 'visitor-help' },
            { label: 'Testimonials', id: 'visitor-testimonials' },
            { label: 'Contact', id: 'visitor-contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 space-y-32">
        {/* Home Section (Hero) */}
        <section id="visitor-home" className="text-center space-y-6 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wider">
              Welcome to the Future of Education
            </span>
            <h1 className="text-6xl font-black text-zinc-900 mt-6 mb-4 leading-tight">Society Tuition Model</h1>
            <p className="text-2xl text-zinc-600 font-medium">Bringing quality tuition classes inside residential societies.</p>
            <p className="text-xl text-zinc-500 max-w-3xl mx-auto mt-6 leading-relaxed">
              A collaboration between tuition institutes and gated communities where tuition classes are conducted within the society premises, ensuring safety, convenience, and excellence.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => scrollToSection('visitor-help')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Learn How We Help
              </button>
              <button 
                onClick={() => scrollToSection('visitor-contact')}
                className="px-8 py-4 bg-white text-zinc-900 border-2 border-zinc-200 rounded-2xl font-bold text-lg hover:border-emerald-600 transition-all"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>
        </section>

        {/* Mission-Vision Section */}
        <section id="visitor-mission" className="scroll-mt-24">
          <SectionTitle subtitle="Our core purpose and future outlook.">Mission & Vision</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-emerald-50 border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-48 h-48 text-emerald-900" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Our Mission</h3>
                <p className="text-zinc-600 text-lg leading-relaxed">
                  To democratize access to high-quality education by eliminating geographical barriers and safety concerns, making learning a seamless part of every student's daily life within their own community.
                </p>
              </div>
            </Card>
            <Card className="bg-indigo-50 border-indigo-100 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Eye className="w-48 h-48 text-indigo-900" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Our Vision</h3>
                <p className="text-zinc-600 text-lg leading-relaxed">
                  To see a world-class tuition center in every gated society, creating a nationwide network of safe, high-performance learning hubs that empower the next generation of leaders.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* How we help you Section */}
        <section id="visitor-help" className="scroll-mt-24 space-y-20">
          <SectionTitle subtitle="Solving real problems with innovative solutions.">How We Help You</SectionTitle>
          
          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Long Distances", desc: "Students often travel 5-10km for quality coaching, wasting energy." },
              { icon: ShieldCheck, title: "Safety Concerns", desc: "Late evening commutes raise safety worries for parents and students." },
              { icon: Clock, title: "Wasted Time", desc: "Hours lost in traffic could be used for self-study, hobbies, or rest." }
            ].map((item, i) => (
              <Card key={i} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                <item.icon className="w-10 h-10 text-red-500 mb-4" />
                <h4 className="text-xl font-bold text-zinc-900 mb-2">{item.title}</h4>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* Solution Flow */}
          <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 text-white">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">The Solution Flow</h2>
              <p className="text-zinc-400 mt-2">A seamless, collaborative ecosystem for better learning.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
              {[
                { icon: Building2, text: "Society provides space" },
                { icon: GraduationCap, text: "Institute provides teachers" },
                { icon: CheckCircle2, text: "Classes happen inside" },
                { icon: Users, text: "Students enroll" }
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center space-y-4 z-10">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-lg max-w-[150px]">{step.text}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-zinc-700 relative">
                      <div className="absolute right-0 -top-1.5">
                        <ArrowRight className="w-4 h-4 text-zinc-700" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Example Scenario */}
          <Card className="bg-zinc-50 border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-zinc-900">Real-World Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-600 font-medium">Example Society Size</span>
                    <span className="text-2xl font-bold text-emerald-600">500 Flats</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-600 font-medium">Students Enrolled</span>
                    <span className="text-2xl font-bold text-emerald-600">170+</span>
                  </div>
                </div>
                <p className="text-zinc-500 leading-relaxed">
                  By centralizing education, we've seen a 40% increase in student productivity and a 100% reduction in commute-related stress for parents.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative">
                <div className="absolute top-4 right-4 text-emerald-100">
                  <GraduationCap className="w-12 h-12" />
                </div>
                <p className="text-lg text-zinc-700 leading-relaxed italic relative z-10">
                  "Having tuition inside the society makes it significantly easier for parents and students. Parents don't need to worry about pick-up and drop-off, and students save valuable time that can be used for extracurriculars or additional study."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Community Impact</p>
                    <p className="text-sm text-zinc-500">Enhanced safety & convenience</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Testimonials Section */}
        <section id="visitor-testimonials" className="scroll-mt-24">
          <SectionTitle subtitle="What parents and students are saying about us.">Testimonials</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Mrs. Sharma",
                role: "Parent, Green Valley Society",
                text: "The Society Tuition Model has been a lifesaver. My daughter finishes her classes and is home in 2 minutes. I no longer worry about her safety in traffic.",
                rating: 5
              },
              {
                name: "Aryan Kapoor",
                role: "Class 12 Student",
                text: "I save nearly 2 hours every day by not traveling to the city center for coaching. That extra time is now spent on my physics numericals and it shows in my grades!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="hover:border-emerald-200 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-700 text-lg mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="visitor-contact" className="scroll-mt-24 pb-20">
          <SectionTitle subtitle="Ready to bring this model to your society?">Contact Us</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-xl text-zinc-600 leading-relaxed">
                Whether you are a society committee member or a tuition institute looking to partner, we'd love to hear from you.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500 uppercase">Email Us</p>
                    <p className="text-lg font-bold text-zinc-900">hello@societytuition.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500 uppercase">Call Us</p>
                    <p className="text-lg font-bold text-zinc-900">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500 uppercase">Visit Us</p>
                    <p className="text-lg font-bold text-zinc-900">www.societytuition.com</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-zinc-50 border-zinc-200">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Society Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Green Valley Apartments" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-32" placeholder="Tell us about your requirements..."></textarea>
                </div>
                <button className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                  Send Inquiry
                </button>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard = () => {
  const [calcStudents, setCalcStudents] = useState(70);
  const [calcFee, setCalcFee] = useState(2000);
  const [calcShare, setCalcShare] = useState(20);

  const revenueData = useMemo(() => {
    const total = calcStudents * calcFee;
    const societyShare = (total * calcShare) / 100;
    const instituteRevenue = total - societyShare;
    return { total, societyShare, instituteRevenue };
  }, [calcStudents, calcFee, calcShare]);

  const funnelData = [
    { name: 'Total Families', value: 200, fill: '#94a3b8' },
    { name: 'Total Students', value: 260, fill: '#64748b' },
    { name: 'Current Tuition', value: 170, fill: '#475569' },
    { name: 'Target Enrollment', value: 70, fill: '#10b981' },
  ];

  const pieData = [
    { name: 'Institute Revenue', value: revenueData.instituteRevenue, fill: '#6366f1' },
    { name: 'Society Share', value: revenueData.societyShare, fill: '#10b981' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900">Admin Insights</h1>
          <p className="text-zinc-500 text-lg">Detailed business metrics and expansion strategy.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold border border-indigo-100">
          <TrendingUp className="w-5 h-5" />
          Growth Mode Active
        </div>
      </div>

      {/* Market Data & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card id="market-data">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-zinc-900">Market Data Funnel</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {funnelData.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{item.value}</p>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{item.name}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card id="revenue-calculator">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-zinc-900">Revenue Calculator</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Number of Students: {calcStudents}</label>
                <input 
                  type="range" min="10" max="200" step="5" 
                  value={calcStudents} 
                  onChange={(e) => setCalcStudents(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Average Monthly Fee: ₹{calcFee}</label>
                <input 
                  type="range" min="500" max="10000" step="100" 
                  value={calcFee} 
                  onChange={(e) => setCalcFee(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Society Revenue Share: {calcShare}%</label>
                <input 
                  type="range" min="5" max="40" step="1" 
                  value={calcShare} 
                  onChange={(e) => setCalcShare(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <p className="text-xs font-bold text-zinc-500 uppercase">Total Revenue</p>
                <p className="text-xl font-black text-zinc-900">₹{revenueData.total.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-600 uppercase">Society Share</p>
                <p className="text-xl font-black text-emerald-700">₹{revenueData.societyShare.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-xs font-bold text-indigo-600 uppercase">Institute Rev</p>
                <p className="text-xl font-black text-indigo-700">₹{revenueData.instituteRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Opportunity & Expansion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-zinc-900">Market Opportunity</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: "Avg Students / Society", val: "70" },
              { label: "Societies in City (Tier 1)", val: "450+" },
              { label: "Potential Revenue / Society", val: "₹1.4L / mo" }
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-zinc-100 last:border-0">
                <span className="text-zinc-500 font-medium">{stat.label}</span>
                <span className="text-xl font-bold text-zinc-900">{stat.val}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-zinc-900">Expansion Strategy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-zinc-600 leading-relaxed">
                The model is highly scalable. A single institute can partner with multiple societies using the same curriculum and management framework.
              </p>
              <div className="p-4 bg-indigo-900 text-white rounded-2xl">
                <p className="text-sm font-bold text-indigo-300 uppercase mb-1">Scale Example</p>
                <p className="text-2xl font-black">10 Societies</p>
                <p className="text-indigo-200 mt-2">
                  700 students × ₹2000 fee = <span className="text-white">₹14,00,000</span> monthly revenue.
                </p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [view, setView] = useState<View>('home');

  const handleNavigate = (newView: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      {view !== 'home' && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-bold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </button>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                view === 'visitor' ? "bg-emerald-500" : "bg-indigo-500"
              )} />
              <span className="font-black text-zinc-900 uppercase tracking-tighter">
                {view === 'visitor' ? 'Visitor Portal' : 'Admin Dashboard'}
              </span>
            </div>
          </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, x: view === 'home' ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {view === 'home' && <HomeView onNavigate={handleNavigate} />}
          {view === 'visitor' && <VisitorDashboard />}
          {view === 'admin' && <AdminDashboard />}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-black text-zinc-900 tracking-tighter">SOCIETY TUITION</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Society Tuition Model. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
