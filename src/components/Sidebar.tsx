import React from 'react';
import { 
  Users, 
  Bug, 
  BookOpen, 
  LayoutDashboard, 
  FileCode,
  Network,
  Zap,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'IDE', icon: LayoutDashboard },
    { id: 'networking', label: 'Network', icon: Users },
    { id: 'recap', label: 'Stories', icon: Zap },
    { id: 'explain', label: 'Explore', icon: FileCode },
  ];

  return (
    <div className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col p-6 gap-8 transition-colors duration-300">
      <div className="flex items-center gap-3 px-2">
        <Zap className="text-neon-pink w-6 h-6 drop-shadow-[0_0_8px_var(--color-neon-pink)]" />
        <h1 className="text-lg font-black text-foreground tracking-widest uppercase italic selection:bg-neon-pink selection:text-black">DevDude</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1 pt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-md transition-all text-[10px] font-black uppercase tracking-[0.2em] group outline-none",
              activeTab === item.id 
                ? "bg-accent text-neon-blue" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === item.id ? "text-neon-blue" : "text-muted-foreground")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-sidebar-border">
        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">
          BOB_AI // SYSTEM_READY
        </div>
      </div>
    </div>
  );
}
