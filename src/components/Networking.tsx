import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, Zap, Github, Globe, Sparkles, UserPlus, Save } from 'lucide-react';
import { Developer } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveUserProfile, getAllUserProfiles, getUserProfile } from '../services/firestoreService';

export default function Networking() {
  const { user } = useAuth();
  const [stack, setStack] = useState('');
  const [interests, setInterests] = useState('');
  const [matches, setMatches] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all profiles initially or when scann is initiated
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profiles = await getAllUserProfiles();
        if (profiles && profiles.length > 0) {
          // Flatten profiles into Developer type
          const formatted = profiles.map((p: any) => ({
            id: p.id,
            name: p.name,
            role: p.role,
            bio: p.bio,
            stack: p.stack || [],
            interests: p.interests || []
          }));
          setMatches(formatted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const getMatches = async () => {
    setLoading(true);
    try {
      // Mocking AI match by filtering local Firestore profiles
      const profiles = await getAllUserProfiles();
      if (profiles) {
        const filtered = profiles
          .filter((p: any) => {
            const stackMatch = !stack || p.stack?.some((s: string) => s.toLowerCase().includes(stack.toLowerCase()));
            const interestMatch = !interests || p.interests?.some((i: string) => i.toLowerCase().includes(interests.toLowerCase()));
            return stackMatch || interestMatch;
          })
          .map((p: any) => ({
             id: p.id,
             name: p.name,
             role: p.role,
             bio: p.bio,
             stack: p.stack || [],
             interests: p.interests || []
          }));
        setMatches(filtered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const syncProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveUserProfile(user.uid, {
        name: user.displayName || 'Anonymous Developer',
        role: 'Full Stack Engineer', // Default
        bio: 'Syncing via BOB AI Infrastructure.',
        stack: stack.split(',').map(s => s.trim()).filter(Boolean),
        interests: interests.split(',').map(i => i.trim()).filter(Boolean),
      });
      alert('Profile synced to Sync_Network');
      getMatches();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 max-w-xl">
        <h2 className="text-lg sm:text-xl font-black text-foreground tracking-widest uppercase italic neon-text-blue">Sync_Network</h2>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Validated developer matching engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          <div className="bg-sidebar/30 p-4 sm:p-6 rounded-2xl border border-border/50 space-y-6 lg:p-0 lg:bg-transparent lg:border-0 lg:rounded-none">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Stack.Target</label>
              <input 
                placeholder="React, Rust..." 
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                className="w-full bg-transparent border-b border-border text-neon-blue text-[11px] font-mono py-2 outline-none focus:border-neon-blue/40 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Meta_Interests</label>
              <input 
                placeholder="AI, Cryptography..." 
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full bg-transparent border-b border-border text-neon-pink text-[11px] font-mono py-2 outline-none focus:border-neon-pink/40 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4 pt-2">
              <Button 
                onClick={getMatches} 
                disabled={loading}
                className="w-full bg-sidebar border border-border text-[9px] text-muted-foreground hover:text-neon-blue hover:border-neon-blue font-black uppercase tracking-[0.3em] h-10 transition-all"
              >
                {loading ? 'SCANN_ACTIVE...' : 'SCANN_INIT'}
              </Button>
              {user && (
                <Button 
                  onClick={syncProfile} 
                  disabled={saving}
                  className="w-full bg-neon-blue/5 border border-neon-blue/20 text-[9px] text-neon-blue hover:bg-neon-blue/10 font-black uppercase tracking-[0.3em] h-10 transition-all"
                >
                  {saving ? 'SYNCING...' : 'SYNC_MY_PROFILE'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {matches.length > 0 ? (
              matches.map((dev, i) => (
                <div key={i} className="group border-b border-border pb-6 sm:pb-8 last:border-0 hover:bg-accent/5 px-2 sm:px-4 rounded-lg transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sidebar border border-border flex items-center justify-center font-black italic text-neon-blue text-lg shadow-inner shrink-0">
                      {dev.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-foreground font-black text-sm uppercase italic tracking-widest">{dev.name}</h4>
                          <span className="text-neon-blue text-[9px] font-black uppercase tracking-widest block mt-1">{dev.role}</span>
                        </div>
                        <Button size="sm" className="bg-sidebar border border-border text-muted-foreground hover:text-neon-green hover:border-neon-green text-[9px] font-black uppercase tracking-widest h-7 px-4">
                          SYNC
                        </Button>
                      </div>
                      <p className="text-foreground/90 text-xs sm:text-[11px] mt-3 leading-relaxed max-w-2xl font-medium italic">
                        {dev.bio || "High-performance systems engineer working on low-latency reactive architectures."}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-4 mt-6">
                        {dev.stack.map((s, j) => (
                          <span key={j} className="text-[8px] sm:text-[9px] text-muted-foreground font-black uppercase tracking-widest bg-accent/20 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex items-center justify-center opacity-10">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">Network_Idle</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
