import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Share2, Brain, FileCode, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Node {
  id: string;
  label: string;
  type: 'concept' | 'file' | 'collaborator';
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

export default function NeuralMap({ ideaContent }: { ideaContent: string }) {
  // Simulate AI extraction of concepts from the idea file
  const nodes: Node[] = useMemo(() => [
    { id: '1', label: 'AI Signal Optimization', type: 'concept', x: 50, y: 50 },
    { id: '2', label: 'AuthService.ts', type: 'file', x: 200, y: 150 },
    { id: '3', label: 'TrafficModel.py', type: 'file', x: 150, y: -50 },
    { id: '4', label: 'Developer_X (Matches)', type: 'collaborator', x: -100, y: 80 },
    { id: '5', label: 'Project_Signal_Fork', type: 'collaborator', x: -50, y: -100 },
    { id: '6', label: 'Real-time Logic', type: 'concept', x: 250, y: 0 },
  ], []);

  const edges: Edge[] = [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '1', to: '5' },
    { from: '3', to: '6' },
    { from: '6', to: '2' },
  ];

  return (
    <div className="relative w-full h-full bg-sidebar/50 rounded-xl border border-border overflow-hidden flex items-center justify-center p-10">
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <h4 className="text-[10px] font-black uppercase text-neon-green tracking-widest flex items-center gap-2">
          <Brain className="w-3 h-3" />
          Neural_Impact_Map active
        </h4>
        <span className="text-[9px] text-muted-foreground italic uppercase">Analyzing idea.md propagating logic...</span>
      </div>

      <div className="relative w-full h-full">
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-border" />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)!;
            const toNode = nodes.find(n => n.id === edge.to)!;
            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                x1={`calc(50% + ${fromNode.x}px)`}
                y1={`calc(50% + ${fromNode.y}px)`}
                x2={`calc(50% + ${toNode.x}px)`}
                y2={`calc(50% + ${toNode.y}px)`}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="absolute p-3 rounded-lg border bg-background flex flex-col items-center gap-2 shadow-sm cursor-pointer group hover:border-neon-blue transition-colors"
            style={{ 
              left: `calc(50% + ${node.x}px)`, 
              top: `calc(50% + ${node.y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`p-2 rounded md ${
              node.type === 'concept' ? 'bg-neon-yellow/10 text-neon-yellow' : 
              node.type === 'file' ? 'bg-neon-blue/10 text-neon-blue' : 
              'bg-neon-pink/10 text-neon-pink'
            }`}>
              {node.type === 'concept' ? <Brain className="w-4 h-4" /> : 
               node.type === 'file' ? <FileCode className="w-4 h-4" /> : 
               <Users className="w-4 h-4" />}
            </div>
            <span className="text-[10px] font-bold uppercase italic tracking-tight whitespace-nowrap">{node.label}</span>
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Card className="bg-sidebar border-border p-3 flex gap-4 items-center shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-muted-foreground">Collaboration Readiness</span>
            <span className="text-xs font-bold text-neon-green uppercase">88% Match Found</span>
          </div>
          <Button size="sm" className="bg-neon-blue text-white h-7 text-[10px] gap-2 font-black uppercase">
            <Share2 className="w-3 h-3" />
            Invite_Team
          </Button>
        </Card>
      </div>
    </div>
  );
}
