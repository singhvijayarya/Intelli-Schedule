// src/pages/Index.tsx
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  CalendarCheck,
  Shield,
  Users,
  BarChart3,
  Clock,
  Star,
  Quote,
  Calendar,
  Info,
  Github,
} from "lucide-react";

export default function Index(): JSX.Element {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  // 3D Orbs Animation
  useEffect(() => {
    if (!orbsRef.current) return;

    const orbs = orbsRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;

      orbs.style.setProperty('--mouse-x', `${x}%`);
      orbs.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated Wave Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawWaves = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Primary wave
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height * 0.7 + 
          Math.sin(x * 0.01 + time) * 20 +
          Math.cos(x * 0.005 + time * 0.7) * 15;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(255, 0, 100, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 255, 200, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fill();

      time += 0.02;
      animationFrameId = requestAnimationFrame(drawWaves);
    };

    resizeCanvas();
    drawWaves();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Foldable left panel effect
  useEffect(() => {
    if (!leftPanelRef.current) return;

    const panel = leftPanelRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      const panelRect = panel.getBoundingClientRect();
      const panelCenter = panelRect.left + panelRect.width / 2;
      const distanceFromCenter = (clientX - panelCenter) / panelRect.width;
      
      // 3D tilt effect
      panel.style.transform = `
        perspective(1000px) 
        rotateY(${distanceFromCenter * 5}deg)
        rotateX(${Math.abs(distanceFromCenter) * -3}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    };

    const handleMouseLeave = () => {
      panel.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };

    panel.addEventListener('mousemove', handleMouseMove);
    panel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      panel.removeEventListener('mousemove', handleMouseMove);
      panel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060612] text-white">

      {/* Animated Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* 3D Floating Orbs */}
      <div
        ref={orbsRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={
          {
            '--mouse-x': '50%',
            '--mouse-y': '50%',
          } as React.CSSProperties
        }
      >
        {/* Large Central Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
          <div className="absolute inset-10 rounded-full bg-gradient-to-r from-green-400/10 to-blue-400/10 blur-2xl animate-spin-slow" />
        </div>

        {/* Floating Orbs */}
        {[
          { color: 'red', size: 'w-32 h-32', top: '20%', left: '10%', delay: '0s' },
          { color: 'orange', size: 'w-24 h-24', top: '70%', left: '85%', delay: '1s' },
          { color: 'yellow', size: 'w-28 h-28', top: '80%', left: '15%', delay: '2s' },
          { color: 'green', size: 'w-20 h-20', top: '30%', left: '90%', delay: '3s' },
          { color: 'blue', size: 'w-36 h-36', top: '60%', left: '5%', delay: '4s' },
        ].map((orb, index) => (
          <div
            key={index}
            className={`absolute ${orb.size} rounded-full bg-gradient-to-br from-${orb.color}-400/30 to-${orb.color}-600/20 backdrop-blur-sm border border-${orb.color}-300/20 animate-float`}
            style={{
              top: orb.top,
              left: orb.left,
              animationDelay: orb.delay,
              transform: 'translate(var(--mouse-x, 50%), var(--mouse-y, 50%)) translate(-50%, -50%)',
              transition: 'transform 0.3s ease-out',
            }}
          />
        ))}
      </div>

      {/* Rotating Neon Rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-red-400/30 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-green-400/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-400/40 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }} />
      </div>

      {/* Moving Diagonal Beam */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 animate-beam-move"
        style={{
          background: "linear-gradient(120deg, transparent 0%, rgba(255,0,100,0.3) 20%, rgba(255,140,0,0.3) 40%, rgba(255,230,0,0.3) 60%, rgba(0,255,90,0.3) 80%, transparent 100%)",
          width: "200%",
          height: "200%",
          top: "-50%",
          left: "-50%",
          filter: "blur(60px)",
          transform: "rotate(15deg)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 mix-blend-screen opacity-30 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_70%)]" />

      {/* HERO SECTION - Compact & Attractive Design */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Panel - Compact Attractive Design */}
            <div 
              ref={leftPanelRef}
              className="relative group perspective-1000 transform-gpu transition-all duration-700 ease-out hover:scale-[1.02]"
            >
              {/* Foldable Card Container */}
              <div className="relative bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 lg:p-8 transform-gpu transition-all duration-500 hover:shadow-3xl">
                
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  
                  {/* Compact Animated Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 shadow-lg transform-gpu transition-all duration-500 group-hover:scale-105">
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span className="text-xs font-semibold tracking-widest text-cyan-100 uppercase">
                      Smart India Hackathon 2025
                    </span>
                  </div>

                  {/* Sub Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-pink-400/30 ml-2">
                    <span className="text-xs font-medium tracking-wide text-pink-100">
                      SIH25091 • NEP 2020
                    </span>
                  </div>

                  {/* Main Title with Compact Layout */}
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 animate-gradient block">
                        Intelli-Schedule
                      </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 block text-3xl lg:text-4xl mt-2">
                        AI-Powered Timetable Engine
                      </span>
                    </h1>

                    {/* Compact Description */}
                    <p className="text-base lg:text-lg text-gray-200 leading-relaxed font-light">
                      A <span className="text-cyan-300 font-semibold">future-ready academic scheduling system</span> built for{' '}
                      <span className="text-purple-300 font-semibold">NEP-2020</span>. Experience{' '}
                      <span className="text-pink-300 font-semibold">fully-automated</span>,{' '}
                      <span className="text-green-300 font-semibold">conflict-free</span>,{' '}
                      <span className="text-yellow-300 font-semibold">fairness-optimized timetables</span> — powered by intelligent heuristics.
                    </p>
                  </div>

                  {/* Compact CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      className="relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-4 rounded-xl shadow-xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-2xl group/btn overflow-hidden text-sm"
                      onClick={() => navigate("/login")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>

                    <Button
                      className="relative backdrop-blur-xl bg-white/10 border border-white/20 text-white font-bold px-6 py-4 rounded-xl transform-gpu transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/30 group/btn2 overflow-hidden text-sm"
                      onClick={() => navigate("/documentation")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover/btn2:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Documentation</span>
                    </Button>
                  </div>

                  {/* Quick Features */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-1 text-xs text-cyan-300">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      Zero Conflicts
                    </div>
                    <div className="flex items-center gap-1 text-xs text-purple-300">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      AI Optimized
                    </div>
                    <div className="flex items-center gap-1 text-xs text-pink-300">
                      <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                      Real-time Sync
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-300">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      NEP 2020 Ready
                    </div>
                  </div>

                  {/* Floating Elements Inside Card */}
                  <div className="absolute top-3 right-3 w-6 h-6 bg-cyan-400/20 rounded-full blur-sm animate-bounce" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 bg-purple-400/20 rounded-full blur-sm animate-bounce delay-300" />
                </div>
              </div>

              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-2xl rounded-3xl transform translate-y-6 scale-95 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            </div>

            {/* Right Panel - Visual Elements */}
            <div className="relative hidden lg:block">
              {/* Animated Geometric Shapes */}
              <div className="relative w-full h-80">
                {/* Rotating Cube */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-2xl rotate-45 animate-spin-slow" />
                  <div className="absolute inset-4 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-xl -rotate-45 animate-spin-slow reverse" />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-float" />
                <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-float delay-1000" />
                <div className="absolute top-6 right-8 w-10 h-10 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-full animate-float delay-2000" />

                {/* Pulsing Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-cyan-400/20 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-purple-400/20 rounded-full animate-ping delay-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, number: "50K+", label: "Students Served" },
            { icon: BarChart3, number: "98%", label: "Accuracy Rate" },
            { icon: Clock, number: "5min", label: "Generation Time" },
            { icon: Star, number: "4.9/5", label: "User Rating" },
          ].map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <metric.icon className="w-8 h-8 mx-auto mb-4 text-yellow-300" />
              <div className="text-2xl font-bold text-white">{metric.number}</div>
              <div className="text-gray-400 text-sm mt-2">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING GLASS BOXES SECTION */}
      <section className="relative z-10 container mx-auto px-6 pb-20 grid gap-10 md:grid-cols-3">
        {[
          {
            icon: Cpu,
            title: "AI-Driven Optimization",
            desc: "Advanced heuristics + constraints + fairness models for NEP-compliant scheduling.",
          },
          {
            icon: CalendarCheck,
            title: "Zero Conflicts",
            desc: "Auto-resolve faculty clashes, room overlaps, subject collisions and batch bottlenecks.",
          },
          {
            icon: Shield,
            title: "Precision + Reliability",
            desc: "Timetables generated with academic logic, audit logs, and perfect allocation.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-3xl p-8 bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 hover:-translate-y-2 transition transform group"
          >
            <item.icon className="w-10 h-10 mb-4 text-yellow-300 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 3D TIMETABLE PREVIEW */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive Timetable Preview
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our dynamic 3D timetable visualization with real-time updates
          </p>
        </div>

        <div className="relative h-96 max-w-4xl mx-auto">
          {/* 3D Cube Container */}
          <div className="absolute inset-0 perspective-1000">
            <div className="relative w-full h-full preserve-3d animate-rotate-3d">
              {/* Front Face - Student View */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 transform translate-z-48 p-6">
                <div className="text-center">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
                  <h3 className="text-xl font-bold mb-3 text-white">B.Ed Student Schedule</h3>
                  <div className="grid grid-cols-6 gap-1 text-[10px]">
                    {/* Header Row */}
                    <div className="text-center font-bold text-yellow-300 p-1">Time/Day</div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <div key={day} className="text-center font-bold text-yellow-300 p-1">{day}</div>
                    ))}
                    
                    {/* Period Rows */}
                    {[
                      { time: '9-10', mon: 'Pedagogy', tue: 'Psychology', wed: 'ICT Lab', thu: 'Assessment', fri: 'Teaching' },
                      { time: '10-11', mon: 'Curriculum', tue: 'Philosophy', wed: 'Special Edu', thu: 'Guidance', fri: 'Practice' },
                      { time: '11-12', mon: null, tue: null, wed: null, thu: null, fri: null },
                      { time: '12-1', mon: 'Language', tue: 'Mathematics', wed: 'Science', thu: 'Social', fri: 'Arts' },
                      { time: '2-3', mon: 'Workshop', tue: 'Seminar', wed: 'Project', thu: 'Research', fri: 'Lab' },
                    ].map((period, periodIndex) => (
                      <React.Fragment key={periodIndex}>
                        <div className="text-center font-semibold text-blue-300 p-1 bg-white/5 rounded">
                          {period.time}
                        </div>
                        {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => (
                          <div 
                            key={day} 
                            className={`text-center p-1 rounded ${
                              period[day as keyof typeof period] === null 
                                ? 'bg-white/5' 
                                : 'bg-green-500/20 hover:bg-green-500/30 cursor-pointer text-white'
                            }`}
                            title={period[day as keyof typeof period] as string || 'Free Period'}
                          >
                            {period[day as keyof typeof period] === null 
                              ? '' 
                              : (period[day as keyof typeof period] as string).split(' ')[0]
                            }
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back Face - Faculty View */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 p-6"
                style={{ transform: 'rotateY(180deg) translateZ(48px)' }}
              >
                <div className="text-center">
                  <Users className="w-10 h-10 mx-auto mb-3 text-green-300" />
                  <h3 className="text-xl font-bold mb-3 text-white">M.Ed Faculty Schedule</h3>
                  <div className="grid grid-cols-6 gap-1 text-[10px]">
                    {/* Header Row */}
                    <div className="text-center font-bold text-green-300 p-1">Time/Day</div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <div key={day} className="text-center font-bold text-green-300 p-1">{day}</div>
                    ))}
                    
                    {/* Period Rows */}
                    {[
                      { time: '9-10', mon: 'Research Methods', tue: 'Thesis Guide', wed: 'Leadership', thu: 'Policy', fri: 'Seminar' },
                      { time: '10-11', mon: 'Advanced Pedagogy', tue: 'Statistics', wed: 'Curriculum Dev', thu: 'Evaluation', fri: 'Workshop' },
                      { time: '11-12', mon: null, tue: null, wed: null, thu: null, fri: null },
                      { time: '12-1', mon: 'PhD Guidance', tue: 'Paper Review', wed: 'Consultation', thu: 'Mentoring', fri: 'Lab Session' },
                      { time: '2-3', mon: 'Dept Meeting', tue: 'Research Lab', wed: 'Journal Club', thu: 'Grant Writing', fri: null },
                    ].map((period, periodIndex) => (
                      <React.Fragment key={periodIndex}>
                        <div className="text-center font-semibold text-green-300 p-1 bg-white/5 rounded">
                          {period.time}
                        </div>
                        {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => (
                          <div 
                            key={day} 
                            className={`text-center p-1 rounded ${
                              period[day as keyof typeof period] === null 
                                ? 'bg-white/5' 
                                : period[day as keyof typeof period] === 'Dept Meeting'
                                ? 'bg-purple-500/30 text-purple-200'
                                : 'bg-blue-500/20 hover:bg-blue-500/30 cursor-pointer text-white'
                            }`}
                            title={period[day as keyof typeof period] as string || 'Free Period'}
                          >
                            {period[day as keyof typeof period] === null 
                              ? '' 
                              : period[day as keyof typeof period] === 'Dept Meeting' 
                                ? 'Meeting'
                                : (period[day as keyof typeof period] as string).split(' ')[0]
                            }
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/20 rounded"></div>
              <span>B.Ed Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/20 rounded"></div>
              <span>M.Ed Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500/30 rounded"></div>
              <span>Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/5 rounded border border-white/10"></div>
              <span>Free Period</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Simple 4-step process to transform your academic scheduling
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {[
            { step: "01", title: "Upload Data", desc: "Import faculty, rooms, and course information" },
            { step: "02", title: "Set Constraints", desc: "Define preferences and scheduling rules" },
            { step: "03", title: "AI Generation", desc: "Our engine creates optimal timetables" },
            { step: "04", title: "Review & Export", desc: "Finalize and export your perfect schedule" },
          ].map((item, index) => (
            <div key={index} className="flex items-center mb-12 last:mb-0">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-lg">
                {item.step}
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block flex-shrink-0 w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 ml-6" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Educators
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what institutions are saying about Intelli-Schedule
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Prof. R.K.Dwivedi",
              role: "FOE DEAN",
              content: "Reduced our timetable creation time from 2 weeks to 5 minutes. Absolutely revolutionary!",
              rating: 4.8
            },
            {
              name: "Prof. Kumar",
              role: "Head of Department",
              content: "The AI optimization eliminated all faculty conflicts we used to manually resolve for hours.",
              rating: 4.5
            },
            {
              name: "Ms. Shalini",
              role: "BCA Coordinator",
              content: "NEP-2020 compliance made simple. Our flexible credit system works perfectly now.",
              rating: 4.8
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-yellow-300 mb-4" />
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: Math.round(testimonial.rating) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG GLASS PANEL — TAGLINE */}
      <div className="relative z-10 container mx-auto px-6 pb-40">
        <div className="p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl text-center hover:scale-[1.01] transition transform">
          <h2 className="text-4xl md:text-5xl font-bold">
            Designed for Universities of Tomorrow
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Built for large-scale institutions needing automated faculty management, NEP-2020 aligned
            flexibility, room-capacity validation, batch-wise fairness, and export-ready academic data.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 text-black px-10 py-3 font-semibold shadow-xl hover:scale-105 transform transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Start Scheduling Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* ========================= FOOTER (embedded in Index.tsx) ========================= */}
      <footer className="mt-12">
        {/* Inline style block for custom animations (kept inside component for portability) */}
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes floaty {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}</style>

        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/about")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("/about"); } }}
          aria-label="About Intelli-Schedule - click to learn more"
          className="max-w-7xl mx-auto px-6 lg:px-8 py-10 rounded-3xl shadow-2xl cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-emerald-300/30"
          style={{
            // rich multicolor gradient (brown/orange/green/blue/yellow) with animated background-position
            background:
              "linear-gradient(90deg, #7a3f1a 0%, #ff8a3d 20%, #2fa14a 40%, #1764d0 70%, #ffd24d 100%)",
            backgroundSize: "300% 300%",
            animation: "gradientShift 9s ease infinite, floaty 6s ease-in-out infinite",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* LEFT: Brand + Description (polymorphic card) */}
              <div className="rounded-2xl p-5 bg-white/6 backdrop-blur-sm border border-white/8 shadow-lg transform transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.15)" }}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white">Intelli-Schedule</h3>
                    <p className="mt-2 text-sm text-white/90 max-w-sm leading-relaxed">
                      AI-powered timetable automation aligned with NEP 2020. Designed for universities, colleges and multidisciplinary institutions — automates schedule creation while honoring constraints, fairness and faculty availability.
                    </p>
                  </div>
                </div>
              </div>

              {/* MIDDLE: Quick Links (polymorphic vertical list) */}
              <div className="rounded-2xl p-5 bg-white/4 border border-white/6 shadow-inner flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate("/about"); }}
                        className="inline-block text-white/95 hover:text-white hover:underline transition"
                      >
                        About Intelli-Schedule
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate("/documentation"); }}
                        className="inline-block text-white/90 hover:text-white hover:underline transition"
                      >
                        How it works
                      </a>
                    </li>
                    <li>
                      <a
                        href="#docs"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate("/documentation"); }}
                        className="inline-block text-white/90 hover:text-white hover:underline transition"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#roadmap"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-white/90 hover:text-white hover:underline transition"
                      >
                        Roadmap
                      </a>
                    </li>
                    <li>
                      <a
                        href="#support"
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate("/help"); }}
                        className="inline-block text-white/90 hover:text-white hover:underline transition"
                      >
                        Support
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="text-xs text-white/80">© {new Date().getFullYear()} Intelli-Schedule. All Rights Reserved.</div>
                </div>
              </div>

              {/* RIGHT: Support/Contact (polymorphic) */}
              <div className="rounded-2xl p-5 bg-white/6 border border-white/8 shadow-lg transform transition-transform duration-300 hover:translate-y-0.5">
                <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                <div className="text-sm text-white/90 space-y-3 mb-4">
                  <div>Privacy Policy</div>
                  <div>Terms &amp; Conditions</div>
                </div>

                <div className="text-sm text-white/95">
                  <div className="font-medium mb-2">Contact:</div>
                  <div className="text-xs text-white/90">sih@aicte-india.org</div>
                  <div className="text-xs text-white/90 mt-1">+91 11 29581239</div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate("/documentation"); }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/8 hover:bg-white/12 transition"
                      aria-label="Open documentation"
                    >
                      <Info className="w-4 h-4 text-white" />
                      Docs
                    </button>

                    <a
                      href="https://github.com/your-repo"
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/8 hover:bg-white/12 transition"
                      aria-label="Open GitHub"
                    >
                      <Github className="w-4 h-4 text-white" />
                      Repo
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle small moving accent bar */}
            <div className="mt-6 h-1 rounded-full overflow-hidden">
              <div
                style={{
                  height: 6,
                  borderRadius: 9999,
                  background:
                    "linear-gradient(90deg, rgba(122,63,26,0.95), rgba(255,138,61,0.95), rgba(47,161,74,0.95), rgba(23,100,208,0.95), rgba(255,210,77,0.95))",
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 6s ease-in-out infinite",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </div>
      </footer>
      {/* ========================= END FOOTER ========================= */}
    </div>
  );
}
