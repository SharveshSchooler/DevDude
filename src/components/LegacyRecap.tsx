import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  History, 
  Tv, 
  Layers, 
  Sparkles,
  RotateCcw,
  BookOpen,
  Send,
  Zap,
  Code as CodeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export default function LegacyRecap() {
  const [code, setCode] = useState('');
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecap = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.recap) {
        setRecap(data.recap);
      }
    } catch (error) {
      console.error('Failed to generate recap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neon-pink">
            <Tv className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Saga_Engine_v5.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase text-foreground">Legacy_Storyteller</h2>
          <p className="text-muted-foreground text-xs sm:text-sm italic underline decoration-neon-pink/30 underline-offset-4">
            Paste your messy legacy code. Get a cinematic short story recap.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => { setCode(''); setRecap(''); }}
            className="flex-1 sm:flex-none text-[9px] sm:text-[10px] uppercase font-black tracking-widest h-8 border-border hover:border-neon-pink hover:text-neon-pink px-2 sm:px-4"
          >
            <RotateCcw className="w-3 h-3 mr-1 sm:mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <Card className="bg-sidebar border-border overflow-hidden flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-3.5 h-3.5 text-neon-blue" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Source_Payload</span>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your legacy code or architectural mess here..."
              className="w-full h-full bg-transparent p-6 text-sm font-mono text-foreground focus:outline-none resize-none custom-scrollbar placeholder:text-muted-foreground/30"
            />
            <div className="absolute bottom-6 right-6">
              <Button 
                onClick={generateRecap}
                disabled={loading || !code.trim()}
                className="bg-neon-pink hover:bg-neon-pink/80 text-white font-black uppercase tracking-widest italic h-10 px-6 shadow-lg shadow-neon-pink/20"
              >
                {loading ? (
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Generate Story
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Area */}
        <Card className="bg-sidebar border-border overflow-hidden flex flex-col h-[500px] border-dashed">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-neon-pink" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recap_Narrative</span>
            </div>
          </div>
          <CardContent className="p-0 flex-1 overflow-y-auto bg-black/10 custom-scrollbar">
            {recap ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 prose prose-invert prose-sm max-w-none"
              >
                <div className="markdown-body">
                  <Markdown>{recap}</Markdown>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-muted-foreground/20">
                  <Play className="w-8 h-8 fill-current" />
                </div>
                <p className="text-sm italic text-muted-foreground max-w-[200px]">
                  {loading ? "BOB AI is synthesizing the narrative..." : "Ready to broadcast your code story."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { icon: Sparkles, title: "Narrative Sync", desc: "Turns variable names into character motives." },
           { icon: Layers, title: "Drama Detection", desc: "Identifies circular dependencies as plot twists." },
           { icon: History, title: "Legacy Context", desc: "Understands the historical weight of your tech debt." }
         ].map((item, i) => (
           <Card key={i} className="bg-sidebar border-border p-5 border-dashed group hover:border-neon-blue/50 transition-colors">
              <item.icon className="w-5 h-5 text-neon-blue mb-3" />
              <h5 className="text-[10px] font-black uppercase text-foreground mb-1 tracking-widest">{item.title}</h5>
              <p className="text-[11px] italic text-muted-foreground">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  );
}
