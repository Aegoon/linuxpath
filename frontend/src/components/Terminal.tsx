/// <reference types="vite/client" />
import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { io, Socket } from 'socket.io-client';

interface TerminalProps {
  userId?: string;
  onCommand?: (cmd: string) => void;
  className?: string;
}

export function Terminal({ userId, onCommand, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize XTerm
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0a0a0a',
        foreground: '#f0f0f0',
        cursor: '#FF5F1F',
        selectionBackground: 'rgba(255, 95, 31, 0.3)',
      },
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      allowProposedApi: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    // Connect to Socket.io backend
    const socket = io(import.meta.env.VITE_API_URL || undefined);
    socketRef.current = socket;

    term.writeln('\x1b[1;32mInitializing Sandbox Environment...\x1b[0m');
    
    socket.emit('init-terminal', { userId: userId || 'anonymous' });

    socket.on('terminal-ready', () => {
      term.writeln('\x1b[1;36mConnected to Ubuntu 22.04 LTS (Sandbox)\x1b[0m');
      // Force initial resize sync
      socket.emit('terminal-resize', { cols: term.cols, rows: term.rows });
    });

    socket.on('terminal-output', (data: string) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit('terminal-input', data);
    });

    term.onResize((size) => {
      socket.emit('terminal-resize', { cols: size.cols, rows: size.rows });
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className={`terminal-container rounded-sm overflow-hidden border border-black/20 shadow-xl flex flex-col ${className}`}>
      <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] font-technical text-white/40 uppercase tracking-widest">student@linuxpath: ~</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[9px] font-technical text-green-500/60 uppercase tracking-tighter">Live Sandbox</span>
        </div>
      </div>
      <div className="flex-1 bg-[#0a0a0a] relative">
        <div ref={terminalRef} className="absolute inset-0 p-2" />
      </div>
    </div>
  );
}
