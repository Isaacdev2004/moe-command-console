
import React from 'react';
import { Terminal, Zap } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-terminal text-sm">MOE_WELCOME_PROTOCOL</span>
            </div>
          </div>
          <div className="terminal-content space-y-4">
            <div className="flex items-start space-x-3">
              <Terminal className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-primary font-terminal text-lg">
                  GREETINGS, AGENT.
                </p>
                <p className="text-foreground/90 font-mono text-sm leading-relaxed">
                  I'm <span className="text-primary font-terminal">MOE</span> - your Mission-Oriented Expert. 
                  I've been analyzing Mozaik woodworking files for years, and I've seen every error, 
                  glitch, and cabinet catastrophe imaginable. 
                </p>
                <p className="text-foreground/90 font-mono text-sm leading-relaxed">
                  Whether you're dealing with mysterious parameter conflicts, dimension disasters, 
                  or just need someone who speaks fluent CNC - I'm your guy. 
                  <span className="text-primary"> Upload your files and let's solve this together.</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t border-primary/20">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-foreground/70 font-mono text-xs">
                READY FOR MISSION DEPLOYMENT
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeMessage;

