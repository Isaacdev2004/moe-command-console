
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToMissions = () => {
    const missionSection = document.getElementById('missions');
    missionSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 scanline-overlay">
      <div className="terminal-window max-w-4xl w-full p-8 animate-flicker">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <div className="w-3 h-3 bg-terminal-amber rounded-full"></div>
            <div className="w-3 h-3 bg-terminal-green rounded-full animate-glow"></div>
            <span className="text-terminal-green/70 text-sm ml-4">CLASSIFIED_TERMINAL_v2.1</span>
          </div>
        </div>
        
        <div className="terminal-content space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-terminal text-terminal-green animate-typing">
              Welcome to MOE
            </h1>
            <p className="text-xl md:text-2xl text-terminal-green/80 font-terminal">
              Mission-Oriented Expert
            </p>
            <div className="h-1 bg-terminal-green/20 rounded-full">
              <div className="h-1 bg-terminal-green rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg md:text-xl text-terminal-green/90 font-mono typing-cursor">
              Upload. Diagnose. Solve.
            </p>
            <p className="text-terminal-green/70 font-mono">
              Your AI-powered woodworking and Mozaik software specialist
            </p>
          </div>
          
          <div className="pt-6">
            <Button 
              onClick={scrollToMissions}
              className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 hover:border-terminal-green transition-all duration-300 text-lg px-8 py-3 font-terminal hover:animate-glow"
            >
              CHOOSE YOUR MISSION
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300ff90" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
    </section>
  );
};

export default HeroSection;
