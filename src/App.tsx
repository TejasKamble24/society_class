/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  Volume2,
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
import { GoogleGenAI, Modality } from "@google/genai";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type View = 'home' | 'visitor' | 'admin';

// --- Components ---

const HearUsAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioSource) {
        audioSource.stop();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioSource, audioContext]);

  const generateAndPlay = async () => {
    if (audioBuffer && audioContext) {
      if (isPlaying) {
        if (audioSource) {
          audioSource.stop();
          setAudioSource(null);
        }
        setIsPlaying(false);
      } else {
        await audioContext.resume();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        setAudioSource(source);
        setIsPlaying(true);
      }
      return;
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Speak in a clear, professional Indian English accent. 
      Script: Welcome to Society Tuition Model. We bring world-class education to your doorstep, transforming gated societies into high-performance learning hubs. By using community spaces, we eliminate commutes and ensure safety. Our expert teachers provide personalized attention, fostering a community of learners. Join us in making quality education accessible and stress-free. Society Tuition Model – where learning meets community.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;

      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);

        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const buffer = await ctx.decodeAudioData(bytes.buffer);
        setAudioBuffer(buffer);

        await ctx.resume();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        setAudioSource(source);
        setIsPlaying(true);
      }
    } catch (error) {
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generateAndPlay}
      disabled={isLoading}
      className={cn(
        "fixed bottom-8 right-8 z-[90] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300",
        isPlaying ? "bg-emerald-500 text-white" : "bg-white text-zinc-900 border border-zinc-200"
      )}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <div className="flex gap-1 items-center h-5">
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              animate={{ height: [8, 20, 8] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
              className="w-1 bg-white rounded-full"
            />
          ))}
        </div>
      ) : (
        <Volume2 className="w-5 h-5 text-emerald-500" />
      )}
      <span className="font-bold tracking-tight">Hear Us</span>
    </motion.button>
  );
};

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
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Heart, 
                title: "Convenience for Parents", 
                desc: "Tuition classes happen within the society, so parents don't need to worry about daily travel arrangements." 
              },
              { 
                icon: ShieldCheck, 
                title: "Safe Learning Environment", 
                desc: "Students attend classes inside their own residential community, ensuring safety and peace of mind for parents." 
              },
              { 
                icon: Clock, 
                title: "Time Saving", 
                desc: "No commuting means students save valuable time that can be used for studying, sports, or relaxation." 
              },
              { 
                icon: Target, 
                title: "Better Focus on Studies", 
                desc: "Smaller group classes help teachers give more attention to each student." 
              },
              { 
                icon: Users, 
                title: "Community Learning", 
                desc: "Children learn with friends from the same society, making learning more engaging and comfortable." 
              },
              { 
                icon: CheckCircle2, 
                title: "Reduced Travel Stress", 
                desc: "Students avoid traffic, long commutes, and fatigue from travelling to tuition centers." 
              },
              { 
                icon: MessageSquare, 
                title: "Easy Communication", 
                desc: "Parents can easily interact with teachers and stay updated about their child’s progress." 
              },
              { 
                icon: Building2, 
                title: "Productive Society Spaces", 
                desc: "Clubhouses or community halls can be used effectively for educational purposes." 
              }
            ].map((item, i) => (
              <Card key={i} className="border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                <item.icon className="w-10 h-10 text-emerald-500 mb-4" />
                <h4 className="text-xl font-bold text-zinc-900 mb-2">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

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
                    <p className="text-lg font-bold text-zinc-900">+91 90755 55238</p>
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
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name'),
                  mobile: formData.get('mobile'),
                  society: formData.get('society'),
                  city: formData.get('city'),
                  district: formData.get('district'),
                  state: formData.get('state'),
                  pincode: formData.get('pincode'),
                  message: formData.get('message'),
                };
                
                try {
                  const response = await fetch('/api/enquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                  if (response.ok) {
                    alert('Enquiry sent successfully!');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert('Failed to send enquiry.');
                  }
                } catch (err) {
                  console.error(err);
                  alert('An error occurred.');
                }
              }}>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Full Name</label>
                  <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Mobile Number</label>
                  <input name="mobile" type="tel" required className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="+91 90000 00000" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">City</label>
                    <input name="city" type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Pune" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">District</label>
                    <input name="district" type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Pune" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">State</label>
                    <input name="state" type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Pincode</label>
                    <input name="pincode" type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="411001" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Society Name</label>
                  <input name="society" type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Green Valley Apartments" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Message</label>
                  <textarea name="message" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-32" placeholder="Tell us about your requirements..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
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
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEnquiries();
  }, []);

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
                <p className="text-xs font-bold text-zinc-500 uppercase">Total Monthly Revenue</p>
                <p className="text-xl font-black text-zinc-900">₹{revenueData.total.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-600 uppercase">Society Monthly Share</p>
                <p className="text-xl font-black text-emerald-700">₹{revenueData.societyShare.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-xs font-bold text-indigo-600 uppercase">Institute Monthly Rev</p>
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
              { label: "Potential Monthly Revenue / Society", val: "₹1.4L" }
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

      {/* Enquiries Section */}
      <section id="admin-enquiries">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-2xl font-bold text-zinc-900">Recent Enquiries</h3>
          </div>
          <button 
            onClick={fetchEnquiries}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <Card className="text-center py-12 text-zinc-500">No enquiries found.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {enquiries.map((enquiry) => (
              <Card key={enquiry.id} className="hover:border-indigo-200 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-zinc-900">{enquiry.name}</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">{enquiry.mobile}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-zinc-500 uppercase">
                      {enquiry.city && <span className="px-2 py-1 bg-zinc-100 rounded-md">City: {enquiry.city}</span>}
                      {enquiry.district && <span className="px-2 py-1 bg-zinc-100 rounded-md">Dist: {enquiry.district}</span>}
                      {enquiry.state && <span className="px-2 py-1 bg-zinc-100 rounded-md">State: {enquiry.state}</span>}
                      {enquiry.pincode && <span className="px-2 py-1 bg-zinc-100 rounded-md">Pin: {enquiry.pincode}</span>}
                    </div>
                    {enquiry.society && (
                      <div className="flex items-center gap-2 text-sm text-indigo-600 font-bold">
                        <Building2 className="w-4 h-4" />
                        {enquiry.society}
                      </div>
                    )}
                    <p className="text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100 italic">
                      "{enquiry.message}"
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase">
                      {new Date(enquiry.created_at).toLocaleDateString()} {new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
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

      <HearUsAudio />

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
