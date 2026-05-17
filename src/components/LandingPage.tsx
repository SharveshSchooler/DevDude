import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Code2, 
  Bug, 
  Users, 
  Sparkles, 
  ChevronRight,
  Monitor,
  Search,
  Cpu,
  ShieldCheck,
  Sun,
  Moon,
  Lightbulb,
  History,
  GitBranch,
  Target,
  Terminal
} from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onToggleTheme?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  user?: any;
  theme?: 'light' | 'dark';
}

export default function LandingPage({ 
  onStartBuilding, 
  onToggleTheme, 
  onLogin, 
  onLogout,
  user,
  theme 
}: LandingPageProps) {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon-pink/20 selection:text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="h-16 md:h-20 border-b border-border flex items-center justify-between px-4 sm:px-8 md:px-16 sticky top-0 bg-background/80 backdrop-blur-md z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="text-neon-pink">
            <Code2 className="w-6 h-6 md:w-8 h-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground italic">DevDude</h1>
        </div>
        
        <nav className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={scrollToFeatures}
            className="text-sm font-medium text-muted-foreground hover:text-neon-blue transition-colors hidden lg:block cursor-pointer"
          >
            Features
          </button>
          
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase hidden xs:block">{user.displayName}</span>
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-foreground hover:text-neon-pink transition-colors cursor-pointer"
              >
                Log Out
              </button>
              <Button 
                onClick={onStartBuilding}
                className="bg-neon-pink hover:bg-neon-pink/80 text-white px-4 sm:px-6 rounded-md font-semibold text-xs sm:text-sm"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <button 
                onClick={onLogin}
                className="text-sm font-medium text-foreground hover:text-neon-pink transition-colors cursor-pointer hidden xs:block"
              >
                Sign In
              </button>
              <Button 
                onClick={onStartBuilding}
                className="bg-neon-pink hover:bg-neon-pink/80 text-white px-4 sm:px-6 rounded-md font-semibold text-xs sm:text-sm"
              >
                Get Started
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-20 px-6 sm:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-6 md:mb-8 animate-pulse text-center">
          <Zap className="w-3 h-3" />
          IBM BOB Hackathon 2026 Entry
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-foreground mb-6 md:mb-8 leading-[1.1] md:leading-[1.0] italic uppercase">
          Build the <br className="hidden md:block" />
          <span className="text-neon-blue">Neural_Saga</span>
        </h2>
        <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed italic">
          Transparent AI interaction. Full-stack visibility. Real-time collaboration. 
          Powered by <span className="text-neon-green font-black uppercase">IBM BOB AI</span> for the next generation of builders.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={onStartBuilding}
            size="lg" 
             className="w-full sm:w-auto bg-neon-pink hover:bg-neon-pink/80 text-white px-10 h-12 md:h-14 text-base md:text-lg rounded-md font-bold shadow-lg shadow-neon-pink/20"
          >
            Start Syncing
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Feature Section Header */}
      <section ref={featuresRef} className="py-16 md:py-32 bg-accent/5 border-y border-border/50">
        <div className="px-6 text-center mb-16 md:mb-24">
          <span className="text-neon-pink font-bold tracking-widest uppercase text-[10px] sm:text-xs mb-4 block">Experimental Protocol v1.0</span>
          <h3 className="text-3xl sm:text-5xl font-black text-foreground italic uppercase">The_Architecture</h3>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 max-w-2xl mx-auto italic">A lightweight IDE inspired by VS Code, focused heavily on AI-assisted collaboration and code narratives.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-6 sm:px-8 md:px-16 max-w-7xl mx-auto">
          {[
            {
              icon: Lightbulb,
              title: "Idea File",
              color: "text-neon-yellow",
              tech: "Gemini 2.0 & Firebase",
              desc: "AI-based developer collaboration system. Describe your project in natural language; we find the team and repos for you."
            },
            {
              icon: History,
              title: "Legacy Story",
              color: "text-neon-pink",
              tech: "IBM BOB AI & Recharts",
              desc: "Understand messy codebases through AI storytelling. View your repo as a Netflix-style series with seasonal arcs and 'Previously on' summaries."
            },
            {
              icon: GitBranch,
              title: "Neural Impact",
              color: "text-neon-green",
              tech: "Motion & D3.js",
              desc: "Unique Hackathon Feature: Real-time visual mapping of how natural language ideas propagate into executable system logic via BOB AI."
            },
            {
              icon: Terminal,
              title: "Unified Shell",
              color: "text-neon-blue",
              tech: "Node.js & Xterm.js",
              desc: "A headless, high-performance terminal environment with built-in BOB AI heuristics for real-time debugging and fixes."
            },
            {
              icon: Search,
              title: "Concept Scanner",
              color: "text-neon-cyan",
              tech: "Firestore Vector Search",
              desc: "Detect overlapping project ideas globally. Find collaborators, similar concepts, or abandoned projects to fork."
            },
            {
              icon: Target,
              title: "Cloud Native",
              color: "text-neon-purple",
              tech: "Docker & Cloud Run",
              desc: "Seamlessly integrated with IBM BOB AI infrastructure for expert-level code generation and architecture analysis."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-sidebar border border-border rounded-2xl hover:border-neon-pink/30 hover:shadow-xl hover:shadow-neon-pink/5 transition-all group duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center ${feature.color} group-hover:bg-foreground group-hover:text-background transition-colors`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black text-muted-foreground/50 border border-border/50 px-2 py-1 rounded uppercase tracking-[0.2em]">{feature.tech}</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground italic uppercase tracking-tight">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm italic">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Vision / Hackathon Details */}
      <section className="py-20 md:py-32 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           <div className="space-y-6">
              <h3 className="text-3xl sm:text-4xl font-black italic uppercase text-foreground leading-[1.1]">Built from Scratch <br/><span className="text-neon-pink">Full-On Vibe Coding</span></h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                Our team of beginner pioneers is bridging the gap between "Idea" and "Execution" in under 24 hours. DevDude isn't just a tool; it's a technical co-builder.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="border-l-2 border-neon-green pl-4">
                   <div className="text-xs font-black uppercase text-muted-foreground">Team Pioneers</div>
                   <div className="text-xl font-bold italic">03 Engineers</div>
                </div>
                <div className="border-l-2 border-neon-blue pl-4">
                   <div className="text-xs font-black uppercase text-muted-foreground">Status</div>
                   <div className="text-xl font-bold italic">Live Deployment</div>
                </div>
              </div>
           </div>
           <div className="bg-sidebar border border-border p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Cpu className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                 <div className="text-neon-pink text-[10px] font-black uppercase tracking-[0.4em] mb-4">Core_Protocol</div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                       <span className="text-xs font-mono">idea.md ANALYSIS ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                       <span className="text-xs font-mono">NESTED_MODULAR_RECAP START</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-pink opacity-50" />
                       <span className="text-xs font-mono">HACKATHON_MODE: OVERRIDE_TRUE</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-neon-pink" />
          <span className="font-bold text-foreground italic">DevDude</span>
        </div>
        <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
          © 2026 DevDude Infrastructure. Powered by IBM BOB AI.
        </p>
      </footer>
    </div>
  );
}
