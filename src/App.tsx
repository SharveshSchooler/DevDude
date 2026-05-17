import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Networking from './components/Networking';
import LegacyRecap from './components/LegacyRecap';
import CodeExplorer from './components/CodeExplorer';
import LandingPage from './components/LandingPage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sun, Moon, LogIn, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage 
            onStartBuilding={() => setActiveTab('dashboard')} 
            onToggleTheme={toggleTheme} 
            onLogin={signIn}
            onLogout={logout}
            user={user}
            theme={theme} 
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'networking':
        return <Networking />;
      case 'recap':
        return <LegacyRecap />;
      case 'explain':
        return <CodeExplorer />;
      default:
        return <Dashboard />;
    }
  };

  if (activeTab === 'landing') {
    return renderContent();
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-gray-400' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-sidebar border-r border-sidebar-border p-0"
            onClick={(e) => e.stopPropagation()}
          >
             <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} />
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className={`h-12 border-b flex items-center justify-between px-4 lg:px-8 transition-colors duration-300 shrink-0 ${
          theme === 'dark' ? 'border-[#111] bg-black' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-[11px] font-black text-neon-pink uppercase tracking-[0.3em] italic neon-text-pink whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-none">
              DEVDUDE // <span className={theme === 'dark' ? 'text-white opacity-40' : 'text-gray-900 opacity-40'}>DASHBOARD</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
             <button 
                onClick={toggleTheme}
                className={`p-1.5 rounded-md transition-all ${
                  theme === 'dark' 
                    ? 'hover:bg-white/5 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
             >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
             </button>

             {user ? (
               <div className="flex items-center gap-1.5 sm:gap-3 pr-2 border-r border-border mr-1 sm:mr-2">
                 <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[9px] font-black text-foreground uppercase tracking-tight leading-none mb-0.5">{user.displayName}</span>
                   <button onClick={logout} className="text-[8px] font-bold text-neon-pink uppercase hover:underline leading-none">Logout</button>
                 </div>
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="profile" className="w-6 h-6 rounded-lg border border-neon-blue/20" />
                 ) : (
                   <div className="w-6 h-6 rounded-lg bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                     <UserIcon className="w-3 h-3 text-neon-blue" />
                   </div>
                 )}
               </div>
             ) : (
               <button 
                onClick={signIn}
                className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded bg-neon-blue/10 text-neon-blue text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-neon-blue/20 transition-all border border-neon-blue/20"
               >
                 <LogIn className="w-3 h-3" />
                 <span className="hidden xs:inline">Connect</span>
               </button>
             )}

             <div className="hidden xs:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_var(--color-neon-green)] animate-pulse" />
                <span className="text-[9px] font-black text-neon-green uppercase tracking-widest hidden sm:inline">BOB_AI_LINKED</span>
             </div>
             
             <div className="hidden md:flex gap-1.5">
                {[
                  'var(--color-neon-pink)',
                  'var(--color-neon-blue)',
                  'var(--color-neon-green)'
                ].map(c => (
                  <div key={c} className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: c, boxShadow: `0 0 5px ${c}` }} />
                ))}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' ? (
             renderContent()
          ) : (
            <ScrollArea className="h-full">
              <div className="p-10 max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
