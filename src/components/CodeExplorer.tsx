import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode, 
  HelpCircle, 
  BookOpen, 
  ChevronRight,
  Code2,
  ListTree,
  Activity,
  Box
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CodeExplorer() {
  const [file, setFile] = useState('');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const getExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, code }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 max-w-xl">
        <h2 className="text-xl font-black text-foreground tracking-widest uppercase italic neon-text-green">Module_Scan</h2>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Deep file understanding protocols</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">Buffer_Logic</span>
              <input 
                placeholder="filename.ts" 
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="bg-transparent border-none text-neon-green text-[9px] w-32 focus:outline-none font-mono tracking-tighter transition-colors"
              />
            </div>
            <textarea 
              placeholder="export async function..." 
              className="w-full bg-sidebar border border-border rounded-lg p-4 text-neon-green text-[12px] font-mono min-h-[400px] outline-none resize-none placeholder:text-muted-foreground/30 leading-relaxed shadow-inner transition-colors duration-300"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={getExplanation} 
                disabled={loading || !code}
                className="w-full bg-sidebar border border-border text-muted-foreground hover:text-neon-green hover:border-neon-green font-black text-[9px] uppercase tracking-[0.3em] h-10 transition-all"
              >
                {loading ? 'ANALYZING...' : 'EXECUTE_SCAN'}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
           {explanation ? (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="border-b border-border/50 pb-6">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] text-neon-green font-black uppercase tracking-[0.3em]">Knowledge_Node</span>
                   </div>
                   <h3 className="text-2xl font-black text-foreground italic tracking-widest uppercase">Architectural_Map</h3>
                </div>
                <div className="prose dark:prose-invert prose-sm max-w-none prose-p:text-foreground prose-strong:text-neon-green prose-code:text-neon-pink prose-li:text-foreground/80 selection:bg-neon-green/10">
                   <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20 border border-dashed border-border/50">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">Heuristic_Idle</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
