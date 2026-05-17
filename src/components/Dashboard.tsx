import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Sparkles, 
  Terminal as TerminalIcon, 
  CheckCircle2,
  Play,
  RotateCcw,
  Search,
  Settings,
  Files,
  Layout,
  Code2,
  ChevronRight,
  ChevronDown,
  X,
  Activity,
  FileCode,
  FileJson,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Cloud,
  CloudOff
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Code
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveFile, subscribeToFiles, deleteFile as deleteFileFromFirestore } from '../services/firestoreService';
import NeuralMap from './NeuralMap';
import LegacyRecap from './LegacyRecap';
import Networking from './Networking';
import { Brain, Tv, Users } from 'lucide-react';

// Custom theme CSS for Prism - defined here to inject or in index.css
// I'll inject it into a style tag for simplicity in this component
const prismStyles = `
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6272A4;
    font-style: italic;
  }
  .token.punctuation {
    color: var(--foreground);
    opacity: 0.7;
  }
  .token.namespace {
    opacity: .7;
  }
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: var(--color-neon-pink);
  }
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: var(--color-neon-green);
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: var(--foreground);
  }
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: var(--color-neon-pink);
    font-weight: bold;
    text-shadow: 0 0 5px rgba(255, 121, 198, 0.3);
  }
  .token.function,
  .token.class-name {
    color: var(--color-neon-blue);
    text-shadow: 0 0 5px rgba(139, 233, 253, 0.3);
  }
  .token.regex,
  .token.important,
  .token.variable {
    color: var(--color-neon-blue);
  }
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }
  .token.entity {
    cursor: help;
  }
`;

const INITIAL_FILES = {
  'index.js': {
    name: 'index.js',
    language: 'javascript',
    content: `import React, { useState } from 'react';\n\nconst DevDudeInterface = () => {\n  const [active, setActive] = useState(true);\n\n  // Initialize the core engine for rendering\n  const initialize = (config) => {\n    return new Promise((resolve) => {\n      console.log("DevDude System loading...");\n      resolve({ status: 'ready' });\n    });\n  };\n\n  return (\n    <div className="devdude-container">\n      <h1>System Active</h1>\n      {active && <StatusGlow />}\n    </div>\n  );\n};\n\nexport default DevDudeInterface;`
  },
  'App.tsx': {
    name: 'App.tsx',
    language: 'tsx',
    content: `import React from 'react';\nimport Dashboard from './components/Dashboard';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-[#0a0a0c] text-white">\n      <Dashboard />\n    </div>\n  );\n}\n\nexport default App;`
  },
  'package.json': {
    name: 'package.json',
    language: 'json',
    content: `{\n  "name": "devdude-pro",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "@google/genai": "^0.1.0",\n    "react": "^18.2.0",\n    "lucide-react": "latest",\n    "prismjs": "latest",\n    "react-simple-code-editor": "latest"\n  }\n}`
  },
  'script.py': {
    name: 'script.py',
    language: 'python',
    content: `def greet(name):\n    print(f"Hello, {name}!")\n\nif __name__ == "__main__":\n    greet("DevDude")`
  },
  'module.rb': {
    name: 'module.rb',
    language: 'ruby',
    content: `class Greeter\n  def initialize(name)\n    @name = name\n  end\n\n  def greet\n    puts "Hello, #{@name}!"\n  end\nend\n\ngreeter = Greeter.new("DevDude")\ngreeter.greet`
  },
  'idea.md': {
    name: 'idea.md',
    language: 'markdown',
    content: `# Project Concept: AI-Based Traffic Optimization System\n\n## Vision\nBuilding an AI-based traffic signal optimization system for Indian cities using neural networks to analyze real-time CCTV footage and sensor data.\n\n## Features\n- Real-time vehicle density analysis\n- Emergency vehicle priority protocols\n- Predictive modeling for peak hours\n- Collaboration with city municipality APIs\n\n## Technical Stack\n- Python (FastAPI)\n- React + Tailwind (Frontend)\n- IBM Cloud Pak for Data\n- IBM BOB AI for logic mapping`
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [files, setFiles] = useState<{ [key: string]: any }>(INITIAL_FILES);
  const [openFileIds, setOpenFileIds] = useState(Object.keys(INITIAL_FILES).concat(['dashboard.log']));
  const [activeFileId, setActiveFileId] = useState('idea.md');
  const [bottomPanelHeight, setBottomPanelHeight] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [logs, setLogs] = useState('TypeError: Cannot read properties of undefined (reading \'price\')\n    at calculateTotal (index.js:5:21)');
  const [outputLogs, setOutputLogs] = useState('[info] Rendering engine initialized successfully.\n[warn] StatusGlow component detected outside main bundle.\n[success] DevDude context synchronised in 42ms.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('terminal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isFindReplaceVisible, setIsFindReplaceVisible] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNeuralMap, setShowNeuralMap] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'src']));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  // Sync files with Firestore
  useEffect(() => {
    if (!user) {
      setFiles(INITIAL_FILES);
      setOpenFileIds(Object.keys(INITIAL_FILES).concat('dashboard.log'));
      return;
    }

    const unsubscribe = subscribeToFiles(user.uid, (firestoreFiles) => {
      if (firestoreFiles.length > 0) {
        const fileMap: { [key: string]: any } = {};
        firestoreFiles.forEach(f => {
          fileMap[f.id] = f;
        });
        setFiles(fileMap);
        
        // Ensure open files are still valid
        setOpenFileIds(prev => {
          const validIds = prev.filter(id => id === 'dashboard.log' || fileMap[id]);
          return validIds.length > 0 ? validIds : [firestoreFiles[0].id, 'dashboard.log'];
        });

        if (!fileMap[activeFileId] && activeFileId !== 'dashboard.log') {
          setActiveFileId(firestoreFiles[0].id);
        }
      } else {
        // If no files in Firestore, push initial ones
        Object.entries(INITIAL_FILES).forEach(([id, file]) => {
          saveFile(user.uid, id, file);
        });
      }
    });

    return unsubscribe;
  }, [user]);

  const saveToCloud = useCallback(async (id: string, content: string) => {
    if (!user || !files[id]) return;
    setIsSyncing(true);
    try {
      await saveFile(user.uid, id, { ...files[id], content });
    } finally {
      setIsSyncing(false);
    }
  }, [user, files]);

  const formatCode = () => {
    const lines = activeFile.content.split('\n');
    const formatted = lines
      .map(line => line.trimEnd())
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n');
    updateActiveFileContent(formatted);
    
    setOutputLogs(prev => prev + `[info] Formatted ${activeFileId}\n`);
  };

  const handleReplace = (all = false) => {
    if (!findText) return;
    const content = activeFile.content;
    let newContent;
    if (all) {
      newContent = content.split(findText).join(replaceText);
    } else {
      newContent = content.replace(findText, replaceText);
    }
    updateActiveFileContent(newContent);
  };

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const editor = document.querySelector('.editor-container textarea') as HTMLTextAreaElement;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = activeFile.content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const newContent = `${before}${prefix}${selected}${suffix}${after}`;
    updateActiveFileContent(newContent);
    
    // Restore focus and selection
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const createFile = () => {
    if (!newItemName) return;
    const newFileId = newItemName.includes('.') ? newItemName : `${newItemName}.js`;
    
    let lang = 'javascript';
    if (newFileId.endsWith('.json')) lang = 'json';
    else if (newFileId.endsWith('.tsx')) lang = 'tsx';
    else if (newFileId.endsWith('.py')) lang = 'python';
    else if (newFileId.endsWith('.rb')) lang = 'ruby';

    const newFile = {
      name: newFileId,
      language: lang,
      content: lang === 'python' ? `# ${newFileId} created\n` : lang === 'ruby' ? `# ${newFileId} created\n` : `// ${newFileId} created\n`
    };

    if (user) {
      saveFile(user.uid, newFileId, newFile);
    } else {
      setFiles(prev => ({
        ...prev,
        [newFileId]: newFile
      }));
    }
    
    setNewItemName('');
    setIsCreatingFile(false);
    openFile(newFileId);
  };

  const createFolder = () => {
    setIsCreatingFolder(false);
    setNewItemName('');
  };

  const activeFile = files[activeFileId] || { name: 'dashboard.log', language: 'javascript', content: logs };
  const isIdeaFile = activeFile.name.toLowerCase() === 'idea.md';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        formatCode();
        if (user) {
          saveToCloud(activeFileId, activeFile.content);
        }
        setOutputLogs(prev => prev + `[success] Saved ${activeFileId}\n`);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsFindReplaceVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, activeFile.content, user, saveToCloud]);

  const openFile = (id: string) => {
    if (!openFileIds.includes(id)) {
      setOpenFileIds(prev => [...prev, id]);
    }
    setActiveFileId(id);
  };

  const closeFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newOpenFiles = openFileIds.filter(fid => fid !== id);
    setOpenFileIds(newOpenFiles);
    if (activeFileId === id) {
      if (newOpenFiles.length > 0) {
        setActiveFileId(newOpenFiles[newOpenFiles.length - 1]);
      } else {
        setActiveFileId('');
      }
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 200) {
        setBottomPanelHeight(newHeight);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleActivityClick = (activity: string) => {
    if (activity === 'ai_mobile') {
      setActiveBottomTab(prev => prev === 'ai' ? '' : 'ai');
      setIsSidebarOpen(false);
      return;
    }

    if (activeActivity === activity && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveActivity(activity);
      setIsSidebarOpen(true);
      // Close bottom panel on mobile when opening sidebar explorer to save space
      if (window.innerWidth < 1024) {
        setActiveBottomTab('');
      }
    }
  };

  const updateActiveFileContent = (newContent: string) => {
    if (!files[activeFileId]) return;
    setFiles(prev => ({
      ...prev,
      [activeFileId]: {
        ...prev[activeFileId],
        content: newContent
      }
    }));
  };

  const analyzeBugs = async () => {
    setLoading(true);
    setActiveBottomTab('ai');
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs, context: activeFile.content }),
      });
      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveBottomTab('output');
    
    const startTimeString = new Date().toLocaleTimeString();
    
    // Interpreter for basic logic
    const evaluateLogic = (code: string): string => {
      try {
        const lines = code.split('\n');
        const vars: { [key: string]: number } = {};
        let output = '';

        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

          // Simple variable assignment: x = 10
          const assignMatch = trimmed.match(/^(?:var|let|const)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/);
          if (assignMatch) {
            const varName = assignMatch[1];
            let valueExpr = assignMatch[2].replace(/;$/, '').trim();
            
            try {
              Object.keys(vars).forEach(v => {
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                valueExpr = valueExpr.replace(regex, vars[v].toString());
              });
              
              if (/^[\d\s+\-*/().]+$/.test(valueExpr)) {
                // eslint-disable-next-line no-eval
                vars[varName] = eval(valueExpr);
              }
            } catch (e) { /* ignore */ }
            return;
          }

          // Simple print: print(expr) or console.log(expr) or puts(expr) or puts expr
          const printMatch = trimmed.match(/^(?:print|console\.log|puts)\s*\((.*)\)\s*;?$/) || trimmed.match(/^puts\s+(.*)$/);
          if (printMatch) {
            let expr = printMatch[1].trim();
            
            try {
              Object.keys(vars).forEach(v => {
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                expr = expr.replace(regex, vars[v].toString());
              });

              if (/^[\d\s+\-*/().]+$/.test(expr)) {
                // eslint-disable-next-line no-eval
                output += eval(expr).toString() + '\n';
              } else if (/^f?["'](.*)["']$/.test(expr)) {
                // Handle f-strings or regular strings
                const inner = expr.match(/^f?["'](.*)["']$/)?.[1] || '';
                let result = inner;
                Object.keys(vars).forEach(v => {
                  result = result.replace(`{${v}}`, vars[v].toString());
                });
                output += result + '\n';
              } else {
                output += expr + '\n';
              }
            } catch (e) {
              output += expr + '\n';
            }
          }
        });
        return output.trim();
      } catch (e) { return ''; }
    };

    const interpreterOutput = evaluateLogic(activeFile.content);

    setOutputLogs(prev => prev + `\n\n[system] ${startTimeString} - Initiating build for project: devdude-pro\n`);
    
    const commandMap: any = {
      'javascript': `node ${activeFileId}`,
      'tsx': `tsx ${activeFileId}`,
      'python': `python3 ${activeFileId}`,
      'ruby': `ruby ${activeFileId}`,
      'json': `cat ${activeFileId}`
    };
    
    setOutputLogs(prev => prev + `[system] Executing: ${commandMap[activeFile.language] || `run ${activeFileId}`}\n`);
    
    setTimeout(() => {
      setOutputLogs(prev => prev + `[success] Virtual build container spawned in 0.4s\n`);
    }, 300);

    setTimeout(() => {
      const output = interpreterOutput || (activeFileId === 'package.json' 
        ? '[info] Validating dependencies...\n[info] @google/genai found: v0.1.0\n[success] All packages resolved.' 
        : '[success] Execution completed. No standard output captured.');
      
      setOutputLogs(prev => prev + `[info] Execution environment: Isolated Runtime (BOB_VIRTUAL_MESH)\n`);
      setOutputLogs(prev => prev + `[success] Code executed successfully. Output captured:\n`);
      setOutputLogs(prev => prev + `> ${output}\n`);
      setOutputLogs(prev => prev + `\n[success] ${activeFileId} finished with exit code 0\n`);
      setIsRunning(false);
    }, 1500);
  };

  const getLanguage = (lang: string) => {
    switch (lang) {
      case 'tsx': return languages.tsx;
      case 'javascript': return languages.javascript;
      case 'json': return languages.json;
      case 'python': return languages.python;
      case 'ruby': return languages.ruby;
      default: return languages.javascript;
    }
  };

  const lineCount = activeFile.content.split('\n').length;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] w-full gap-0 overflow-hidden bg-background transition-colors duration-300 relative">
      <style>{prismStyles}</style>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* 1. Activity Bar (Desktop: Left, Mobile: Bottom) */}
      <div className="hidden lg:flex w-12 h-full bg-sidebar border-r border-border flex-col items-center py-4 gap-4 z-30 transition-colors duration-300">
        <div 
          onClick={() => handleActivityClick('explorer')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'explorer' ? 'text-neon-blue bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
        >
          <Files className="w-5 h-5" />
        </div>
        <div 
          onClick={() => handleActivityClick('search')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'search' ? 'text-neon-blue bg-white/5' : 'text-gray-500 hover:text-white'}`}
        >
          <Search className="w-5 h-5" />
        </div>
        <div 
          onClick={() => handleActivityClick('debug')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'debug' ? 'text-neon-blue bg-white/5' : 'text-gray-500 hover:text-white'}`}
        >
          <Bug className="w-5 h-5" />
        </div>
        <div 
          onClick={() => handleActivityClick('activity')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'activity' ? 'text-neon-blue bg-white/5' : 'text-gray-500 hover:text-white'}`}
        >
          <Activity className="w-5 h-5" />
        </div>
        <div 
          onClick={() => handleActivityClick('recap')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'recap' ? 'text-neon-pink bg-white/5' : 'text-gray-500 hover:text-white'}`}
          title="Legacy Recap"
        >
          <Tv className="w-5 h-5" />
        </div>
        <div 
          onClick={() => handleActivityClick('networking')}
          className={`p-2 rounded-md cursor-pointer transition-all ${isSidebarOpen && activeActivity === 'networking' ? 'text-neon-blue bg-white/5' : 'text-gray-500 hover:text-white'}`}
          title="Sync_Network"
        >
          <Users className="w-5 h-5" />
        </div>
        <div className="mt-auto pb-2 text-gray-500 hover:text-white transition-colors">
          <Settings className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* 2. Side Bar (Desktop: Static, Mobile: Absolute Overlay) */}
      {isSidebarOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="w-72 sm:w-60 h-full lg:h-full fixed lg:static left-0 top-0 bottom-0 z-50 lg:z-auto bg-sidebar border-r border-border flex flex-col select-none transition-all duration-300 animate-in slide-in-from-left duration-300">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border/50 bg-sidebar/80 backdrop-blur-md sticky top-0 z-10">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {activeActivity === 'explorer' && 'Explorer'}
                {activeActivity === 'search' && 'Search'}
                {activeActivity === 'debug' && 'Run and Debug'}
                {activeActivity === 'recap' && 'Legacy Recap'}
                {activeActivity === 'networking' && 'Networking'}
              </span>
              <div className="flex items-center gap-2">
                {activeActivity === 'explorer' && (
                  <>
                    <FilePlus 
                      className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-pointer" 
                      onClick={() => { setIsCreatingFile(true); setIsCreatingFolder(false); }}
                    />
                    <FolderPlus 
                      className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-pointer"
                      onClick={() => { setIsCreatingFolder(true); setIsCreatingFile(false); }}
                    />
                  </>
                )}
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

          <div className="flex-1 overflow-y-auto pt-2">
            {activeActivity === 'explorer' && (
              <div className="px-2 pt-1 font-mono">
                <div 
                  onClick={() => toggleFolder('root')}
                  className="flex items-center gap-1 py-1 text-gray-300 font-bold text-[11px] hover:bg-white/5 cursor-pointer"
                >
                  {expandedFolders.has('root') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {expandedFolders.has('root') ? <FolderOpen className="w-3.5 h-3.5 text-neon-blue" /> : <Files className="w-3.5 h-3.5 text-neon-blue" />}
                  <span className="uppercase tracking-tighter">DEVDUDE_PROJECT</span>
                </div>
                
                {expandedFolders.has('root') && (
                  <div className="pl-4 space-y-0.5">
                    {(isCreatingFile || isCreatingFolder) && (
                      <div className="flex items-center gap-2 py-1 px-2 animate-in fade-in slide-in-from-left-1 duration-200">
                        {isCreatingFile ? <FileCode className="w-3.5 h-3.5 text-gray-500" /> : <FolderOpen className="w-3.5 h-3.5 text-neon-blue" />}
                        <input
                          autoFocus
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onBlur={() => { if (!newItemName) { setIsCreatingFile(false); setIsCreatingFolder(false); } }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') isCreatingFile ? createFile() : createFolder();
                            if (e.key === 'Escape') { setIsCreatingFile(false); setIsCreatingFolder(false); setNewItemName(''); }
                          }}
                          className="bg-[#1e1e24] border border-neon-blue text-[11px] text-white px-1 outline-none w-full"
                          placeholder={isCreatingFile ? "file.js" : "folder"}
                        />
                      </div>
                    )}

                    <div 
                      onClick={() => toggleFolder('src')}
                      className="flex items-center gap-2 py-1 text-gray-500 text-[11px] hover:bg-white/5 cursor-pointer"
                    >
                      {expandedFolders.has('src') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span className="uppercase tracking-tighter font-medium">src</span>
                    </div>
                    
                    {expandedFolders.has('src') && (
                      <div className="pl-4 border-l border-border/20 ml-1.5">
                        {Object.values(files).map((file) => (
                          <div 
                            key={file.name}
                            onClick={() => openFile(file.name)}
                            className={`flex items-center gap-2 py-1 text-[11px] hover:bg-white/5 cursor-pointer pl-2 transition-colors ${activeFileId === file.name ? 'text-neon-pink bg-neon-pink/5' : 'text-gray-500'}`}
                          >
                            {file.name.endsWith('.json') ? <FileJson className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
                            <span className={activeFileId === file.name ? "italic font-bold" : "font-medium"}>
                              {file.name}
                            </span>
                            {activeFileId === file.name && <div className="ml-auto w-1 h-3 bg-neon-pink rounded-full mr-2" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeActivity === 'search' && (
              <div className="px-4 space-y-4">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1e1e24] border border-[#222] text-xs px-2 py-1 outline-none text-white focus:border-neon-blue"
                  />
                  <input 
                    type="text" 
                    placeholder="Replace"
                    className="w-full bg-[#1e1e24] border border-[#222] text-xs px-2 py-1 outline-none text-white/50 focus:border-neon-blue"
                  />
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-bold text-center pt-10">
                  No results found
                </div>
              </div>
            )}

            {activeActivity === 'debug' && (
              <div className="px-4 space-y-4">
                <Button className="w-full bg-neon-green text-black font-black text-[10px] uppercase tracking-widest h-8">
                  <Play className="w-3.5 h-3.5 mr-2" />
                  Run and Debug
                </Button>
                <div className="border border-[#222] rounded p-3 space-y-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase">Variables</div>
                  <div className="text-[10px] text-gray-400 italic">No variables available</div>
                </div>
                <div className="border border-[#222] rounded p-3 space-y-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase">Call Stack</div>
                  <div className="text-[10px] text-gray-400 italic">Not paused</div>
                </div>
              </div>
            )}

            {activeActivity === 'recap' && (
              <div className="px-4 space-y-4">
                <div className="p-3 rounded-lg bg-neon-pink/5 border border-neon-pink/20">
                   <p className="text-[10px] text-neon-pink font-bold uppercase mb-2">Active_Story_Pulse</p>
                   <p className="text-[11px] text-muted-foreground italic tracking-tight">Recap engine is analyzing codebase history for narrative construction...</p>
                </div>
                <Button 
                  onClick={() => {
                    if (!openFileIds.includes('recap_view')) {
                      setOpenFileIds(prev => [...prev, 'recap_view']);
                    }
                    setActiveFileId('recap_view');
                  }}
                  className="w-full bg-neon-pink text-white font-black text-[10px] uppercase tracking-widest h-8"
                >
                  <Tv className="w-3.5 h-3.5 mr-2" />
                  Open Saga Center
                </Button>
              </div>
            )}

            {activeActivity === 'networking' && (
              <div className="px-4 space-y-4">
                <div className="p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/20">
                   <p className="text-[10px] text-neon-blue font-bold uppercase mb-2">Sync_Pulse</p>
                   <p className="text-[11px] text-muted-foreground italic tracking-tight">Detecting similar projects and collaborators in the global mesh...</p>
                </div>
                <Button 
                  onClick={() => {
                    if (!openFileIds.includes('networking_view')) {
                      setOpenFileIds(prev => [...prev, 'networking_view']);
                    }
                    setActiveFileId('networking_view');
                  }}
                  className="w-full bg-neon-blue text-white font-black text-[10px] uppercase tracking-widest h-8"
                >
                  <Users className="w-3.5 h-3.5 mr-2" />
                  Open Sync Network
                </Button>
              </div>
            )}
          </div>
        </div>
      </>
    )}

      {/* 3. Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background transition-colors duration-300 pb-14 lg:pb-0">
        {/* Editor Tabs */}
        <div className="h-9 flex bg-sidebar items-center border-b border-border select-none overflow-hidden">
          <div className="lg:hidden px-2 border-r border-border">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 rounded bg-accent/30 text-muted-foreground"
             >
                <Files className="w-4 h-4" />
             </button>
          </div>
          <div className="flex-1 flex overflow-x-auto no-scrollbar scrollbar-hide">
            {openFileIds.map((id) => {
               const file = files[id];
               const isLog = id === 'dashboard.log';
               const isRecap = id === 'recap_view';
               const isNetworking = id === 'networking_view';
               const name = isLog ? 'dashboard.log' : isRecap ? 'legacy_recap.saga' : isNetworking ? 'sync_network.net' : file?.name;
               const Icon = isLog ? Activity : isRecap ? Tv : isNetworking ? Users : FileCode;

               return (
                 <div 
                  key={id}
                  onClick={() => setActiveFileId(id)}
                  className={`h-9 px-4 flex items-center gap-3 border-r border-border cursor-pointer transition-colors shrink-0 ${
                    activeFileId === id 
                    ? 'bg-background border-t-2 border-t-neon-pink shadow-inner' 
                    : 'hover:bg-accent/50 text-muted-foreground'
                  }`}
                 >
                    <Icon className={`w-3.5 h-3.5 ${activeFileId === id ? 'text-neon-pink' : 'text-muted-foreground'}`} />
                    <span className={`text-[10px] uppercase font-black tracking-widest ${activeFileId === id ? 'text-neon-pink italic' : 'text-muted-foreground'}`}>
                      {name}
                    </span>
                    <X 
                      onClick={(e) => closeFile(e, id)}
                      className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" 
                    />
                 </div>
               );
            })}
          </div>
          
          <div className="px-2 border-l border-border flex items-center gap-1">
            <Button 
               variant="ghost" 
               size="icon" 
               onClick={handleRun}
               disabled={isRunning}
               className="h-7 w-7 text-neon-green hover:text-neon-green hover:bg-neon-green/10"
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="h-6 bg-background border-b border-border/50 flex items-center px-4 gap-2">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">src</span>
            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
              {activeFileId === 'index.js' ? 'components' : 'root'}
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
            <span className="text-[9px] text-neon-pink font-bold uppercase tracking-tighter italic">{activeFileId}</span>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {isFindReplaceVisible && (
            <div className="bg-sidebar border-b border-border px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 z-40 transition-colors duration-300">
              <div className="flex items-center bg-background border border-border rounded px-2 gap-2 flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Find"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="bg-transparent border-none outline-none text-[11px] text-foreground py-1 w-full"
                />
              </div>
              <div className="flex items-center bg-background border border-border rounded px-2 gap-2 flex-1">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="bg-transparent border-none outline-none text-[11px] text-foreground py-1 w-full"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button 
                  onClick={() => handleReplace(false)}
                  className="px-3 py-1 bg-neon-blue/10 text-neon-blue text-[10px] uppercase font-black tracking-widest rounded hover:bg-neon-blue/20 transition-colors"
                >
                  Replace
                </button>
                <button 
                  onClick={() => handleReplace(true)}
                  className="px-3 py-1 bg-neon-pink/10 text-neon-pink text-[10px] uppercase font-black tracking-widest rounded hover:bg-neon-pink/20 transition-colors"
                >
                  All
                </button>
                <X 
                  className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer ml-2" 
                  onClick={() => setIsFindReplaceVisible(false)}
                />
              </div>
            </div>
          )}
          {/* Internal Toolbar */}
          <div className="h-10 bg-sidebar border-b border-border flex items-center px-2 sm:px-4 gap-0.5 sm:gap-1 select-none transition-colors duration-300 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => applyFormatting('**')} 
              className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => applyFormatting('*')} 
              className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="hidden sm:block w-px h-4 bg-border mx-1" />
            <button 
              onClick={formatCode} 
              className="px-2 py-1 hover:bg-accent rounded text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 shrink-0"
              title="Format Code (Ctrl+S)"
            >
              <span className="uppercase tracking-widest">Format</span>
            </button>
            <button 
              onClick={() => setIsFindReplaceVisible(!isFindReplaceVisible)} 
              className={`px-2 py-1 rounded text-[10px] font-black transition-colors flex items-center gap-2 shrink-0 ${isFindReplaceVisible ? 'bg-neon-pink/10 text-neon-pink' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
            >
              <span className="uppercase tracking-widest">Find</span>
            </button>
            
            <div className="ml-auto flex items-center gap-2 shrink-0">
               {isIdeaFile && (
                 <Button 
                   onClick={() => setShowNeuralMap(!showNeuralMap)}
                   className={`h-7 gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${
                     showNeuralMap ? 'bg-neon-green text-black' : 'bg-sidebar border border-neon-green/20 text-neon-green hover:bg-neon-green/10'
                   }`}
                 >
                   <Brain className="w-3 h-3" />
                   <span className="hidden xs:inline">{showNeuralMap ? 'CLOSE_MAP' : 'MAP_ACTIVE'}</span>
                 </Button>
               )}
               <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest hidden xs:inline">{activeFile.language}</span>
            </div>
          </div>

          <div className="flex-1 flex relative overflow-hidden">
            {showNeuralMap && isIdeaFile ? (
              <NeuralMap ideaContent={activeFile.content} />
            ) : activeFileId === 'recap_view' ? (
              <div className="flex-1 overflow-auto p-4 sm:p-12 custom-scrollbar bg-background">
                <LegacyRecap />
              </div>
            ) : activeFileId === 'networking_view' ? (
              <div className="flex-1 overflow-auto p-4 sm:p-12 custom-scrollbar bg-background">
                <Networking />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex">
                  {/* Line Numbers */}
                <div className="hidden sm:flex w-12 bg-sidebar border-r border-border py-4 flex-col items-end px-3 select-none overflow-hidden h-full transition-colors duration-300">
                  {Array.from({ length: Math.max(lineCount, 40) }).map((_, i) => (
                    <div key={i} className="h-[21px] flex items-center w-full justify-end">
                      <span className="text-[11px] font-mono text-muted-foreground/40">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar relative editor-container">
                  <Editor
                  key={activeFileId}
                  value={activeFile.content}
                  onValueChange={updateActiveFileContent}
                  highlight={code => highlight(code, getLanguage(activeFile.language), activeFile.language)}
                  padding={16}
                  className="font-mono text-[12px] sm:text-[13px] leading-[21px] bg-transparent min-h-full caret-neon-blue"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                />
              </div>
            </div>
            
                {/* Selection Summary Overlay */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-8 z-20">
                  <Button 
                    size="sm" 
                    onClick={analyzeBugs}
                    disabled={loading}
                    className="bg-sidebar border border-border text-[9px] sm:text-[10px] text-foreground hover:text-neon-blue hover:border-neon-blue h-8 sm:h-9 font-black uppercase tracking-widest px-3 sm:px-6 transition-all shadow-lg"
                  >
                    {loading ? (
                      <RotateCcw className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 mr-2 text-neon-blue" />
                    )}
                    <span className="hidden xxs:inline">SYNC_BOB_AI</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. Bottom Panel (Terminal/AI) */}
            <div 
              style={{ height: window.innerWidth < 1024 ? (activeBottomTab ? '40vh' : '0px') : bottomPanelHeight }}
              className={`border-t border-border flex flex-col bg-background relative transition-all duration-300 ${window.innerWidth < 1024 && !activeBottomTab ? 'hidden' : 'flex'}`}
            >
              {/* Resize Handle (Desktop Only) */}
              <div 
                onMouseDown={startResizing}
                className="hidden lg:block absolute -top-1 left-0 right-0 h-2 cursor-ns-resize hover:bg-neon-blue/30 transition-colors z-50"
              />
              
              <div className="px-4 sm:px-6 flex gap-4 sm:gap-6 bg-sidebar border-b border-border select-none h-9 flex-shrink-0 transition-colors duration-300 overflow-x-auto no-scrollbar">
            {[
              { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
              { id: 'ai', label: 'AI', icon: Sparkles },
              { id: 'output', label: 'Output', icon: Activity },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveBottomTab(tab.id)}
                className={`h-9 flex items-center gap-2 px-1 border-b-2 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap ${
                  activeBottomTab === tab.id 
                    ? 'border-neon-blue text-neon-blue' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === 'ai' && <span className="sm:hidden">AI</span>}
              </button>
            ))}
            <button 
              onClick={() => setActiveBottomTab('')}
              className="lg:hidden ml-auto flex items-center text-muted-foreground p-2"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeBottomTab === 'terminal' && (
              <div className="h-full px-6 py-4 font-mono text-[11px] overflow-auto custom-scrollbar">
                <textarea
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                  className="w-full bg-transparent text-gray-300 focus:outline-none resize-none h-full font-mono leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}

            {activeBottomTab === 'ai' && (
              <div className="h-full px-8 py-6 overflow-auto custom-scrollbar flex flex-col bg-background transition-colors duration-300">
                {!result && !loading && (
                  <div className="flex-1 flex items-center justify-center text-center opacity-30">
                    <div className="space-y-3">
                       <Sparkles className="w-8 h-8 text-neon-blue mx-auto" />
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">BOB AI is ready to optimize your code</p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3">
                       <RotateCcw className="w-4 h-4 text-neon-blue animate-spin" />
                       <span className="text-[10px] font-black text-neon-blue uppercase tracking-widest">Analyzing Logic...</span>
                    </div>
                    <div className="space-y-3 pl-7">
                      <div className="h-1.5 bg-[#1e1e24] w-3/4 rounded animate-pulse" />
                      <div className="h-1.5 bg-[#1e1e24] w-full rounded animate-pulse delay-75" />
                      <div className="h-1.5 bg-[#1e1e24] w-5/6 rounded animate-pulse delay-150" />
                    </div>
                  </div>
                )}

                {result && (
                  <div className="max-w-4xl animate-in slide-in-from-bottom-2 duration-500">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-1.5 rounded bg-neon-blue/10">
                          <CheckCircle2 className="w-4 h-4 text-neon-blue" />
                        </div>
                        <span className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em]">Solution Found</span>
                     </div>
                     <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-strong:text-neon-pink prose-code:text-neon-green italic leading-relaxed mb-8">
                       <ReactMarkdown>{result}</ReactMarkdown>
                     </div>
                     <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 text-[10px] font-black uppercase tracking-widest h-9 px-8 transition-all">
                       APPLY_BOB_OPTIMIZATION
                     </Button>
                  </div>
                )}
              </div>
            )}

            {activeBottomTab === 'output' && (
              <div className="h-full px-6 py-4 font-mono text-[11px] overflow-auto custom-scrollbar">
                <div className="space-y-1">
                  {outputLogs.split('\n').map((line, i) => {
                    let colorClass = 'text-gray-400';
                    if (line.includes('[success]')) colorClass = 'text-neon-green';
                    if (line.includes('[error]') || line.includes('TypeError')) colorClass = 'text-neon-pink';
                    if (line.includes('[warn]')) colorClass = 'text-[#FFB86C]';
                    if (line.includes('[system]')) colorClass = 'text-neon-blue font-bold';
                    if (line.startsWith('>')) colorClass = 'text-foreground font-mono font-bold not-italic bg-white/5 px-1 rounded';

                    return (
                      <div key={i} className={`${colorClass} italic leading-relaxed py-0.5`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 5. Mobile Activity Bar (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-sidebar border-t border-border flex items-center justify-around px-2 z-30 transition-colors duration-300">
        <div 
          onClick={() => handleActivityClick('explorer')}
          className={`p-2.5 rounded-xl transition-all ${isSidebarOpen && activeActivity === 'explorer' ? 'text-neon-blue bg-accent' : 'text-muted-foreground'}`}
        >
          <Files className="w-6 h-6" />
        </div>
        <div 
          onClick={() => handleActivityClick('search')}
          className={`p-2.5 rounded-xl transition-all ${isSidebarOpen && activeActivity === 'search' ? 'text-neon-blue bg-accent' : 'text-muted-foreground'}`}
        >
          <Search className="w-6 h-6" />
        </div>
        <div 
          onClick={() => {
            handleActivityClick('debug');
            if (activeActivity !== 'debug' || !isSidebarOpen) {
               // Focus the debugger on mobile
            }
          }}
          className={`p-2.5 rounded-xl transition-all ${isSidebarOpen && activeActivity === 'debug' ? 'text-neon-blue bg-accent' : 'text-muted-foreground'}`}
        >
          <Play className="w-6 h-6" />
        </div>
        <div 
          onClick={() => handleActivityClick('ai_mobile')}
          className={`p-2.5 rounded-xl transition-all ${activeBottomTab === 'ai' ? 'text-neon-blue bg-accent' : 'text-muted-foreground'}`}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <div 
          onClick={() => handleActivityClick('recap')}
          className={`p-2.5 rounded-xl transition-all ${isSidebarOpen && activeActivity === 'recap' ? 'text-neon-pink bg-accent' : 'text-muted-foreground'}`}
        >
          <Tv className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

