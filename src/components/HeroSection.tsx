
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Shield, Target } from 'lucide-react';

const HeroSection = () => {
  const scrollToMissions = () => {
    const missionSection = document.getElementById('missions');
    missionSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 scanline-overlay">
      <div className="terminal-window max-w-5xl w-full p-8 animate-flicker">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <div className="w-3 h-3 bg-terminal-amber rounded-full"></div>
            <div className="w-3 h-3 bg-terminal-green rounded-full animate-glow"></div>
            <span className="text-primary/70 text-sm ml-4 font-terminal">CLASSIFIED_TERMINAL_v2.1</span>
          </div>
        </div>
        
        <div className="terminal-content space-y-8">
          {/* Classification Banner */}
          <div className="border border-primary/50 bg-primary/5 p-3 rounded">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-terminal text-primary text-sm">TOP SECRET - CLEARANCE LEVEL: ALPHA</span>
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Agent Briefing */}
          <div className="space-y-6">
            <div className="text-left space-y-3">
              <h2 className="text-lg font-typewriter text-primary/90 tracking-wide">
                AGENT BRIEFING
              </h2>
              <div className="h-0.5 bg-primary/30 w-full"></div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-spy text-primary animate-typing">
                OPERATION: MOE
              </h1>
              <p className="text-xl md:text-2xl text-primary/80 font-typewriter tracking-widest">
                Mission-Oriented Expert
              </p>
              <div className="h-1 bg-primary/20 rounded-full">
                <div className="h-1 bg-primary rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Mission Objectives */}
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-typewriter text-primary/90 tracking-wide flex items-center">
              <Target className="w-5 h-5 mr-2" />
              MISSION OBJECTIVES
            </h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-primary">01.</span>
                <span className="text-primary/90">Upload classified documents and media files</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-primary">02.</span>
                <span className="text-primary/90">Diagnose technical anomalies and equipment failures</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-primary">03.</span>
                <span className="text-primary/90">Execute precision solutions for mission-critical operations</span>
              </div>
            </div>
          </div>

          {/* Equipment Selection Button */}
          <div className="pt-6">
            <Button 
              onClick={scrollToMissions}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 hover:border-primary transition-all duration-300 text-lg px-8 py-4 font-typewriter hover:animate-glow tracking-wider"
            >
              EQUIPMENT SELECTION
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background pattern with grid overlay - updated for light theme */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23457B9D%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(69,123,157,0.03)_25px,rgba(69,123,157,0.03)_26px,transparent_27px,transparent_100%),linear-gradient(rgba(69,123,157,0.03)_25px,transparent_26px,transparent_100%)] bg-[size:25px_25px]"></div>
      </div>
    </section>
  );
};

export default HeroSection;

