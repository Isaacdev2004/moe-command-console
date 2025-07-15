
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, FileText, Hammer, HelpCircle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  context: string;
}

const missions: Mission[] = [
  {
    id: 'mozaik',
    title: 'Mozaik Troubleshooting',
    description: 'Diagnose cabinet design issues and parameter problems',
    icon: Settings,
    context: 'mozaik-expert'
  },
  {
    id: 'cnc',
    title: 'CNC File Issues',
    description: 'Resolve toolpath and machining file problems',
    icon: FileText,
    context: 'cnc-specialist'
  },
  {
    id: 'vcarve',
    title: 'VCarve Assistant',
    description: 'Get help with VCarve Pro workflows and settings',
    icon: Hammer,
    context: 'vcarve-helper'
  },
  {
    id: 'general',
    title: 'General Woodworking Help',
    description: 'Ask about techniques, tools, and project guidance',
    icon: HelpCircle,
    context: 'woodworking-mentor'
  }
];

interface MissionSelectorProps {
  onMissionSelect: (mission: Mission) => void;
}

const MissionSelector: React.FC<MissionSelectorProps> = ({ onMissionSelect }) => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [scanning, setScanning] = useState<string | null>(null);

  const handleMissionClick = (mission: Mission) => {
    setScanning(mission.id);
    setTimeout(() => {
      setSelectedMission(mission.id);
      setScanning(null);
      onMissionSelect(mission);
    }, 1500);
  };

  return (
    <section id="missions" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <span className="text-terminal-green font-terminal">MISSION_SELECTOR.exe</span>
          </div>
          <div className="terminal-content">
            <h2 className="text-3xl md:text-4xl font-terminal text-terminal-green mb-2">
              Choose Your Mission
            </h2>
            <p className="text-terminal-green/70 font-mono">
              Select your area of expertise to optimize AI assistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission) => {
            const Icon = mission.icon;
            const isSelected = selectedMission === mission.id;
            const isScanning = scanning === mission.id;
            
            return (
              <Card
                key={mission.id}
                className={`cursor-pointer transition-all duration-300 terminal-window hover:scale-105 ${
                  isSelected 
                    ? 'border-terminal-green shadow-lg shadow-terminal-green/20 animate-glow' 
                    : 'border-terminal-green/30 hover:border-terminal-green/60'
                } ${isScanning ? 'animate-pulse' : ''}`}
                onClick={() => handleMissionClick(mission)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-terminal-green/20' : 'bg-terminal-green/10'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      isSelected ? 'text-terminal-green' : 'text-terminal-green/70'
                    }`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-terminal text-terminal-green">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-terminal-green/70 font-mono">
                      {mission.description}
                    </p>
                  </div>
                  
                  {isScanning && (
                    <div className="text-terminal-green font-terminal text-sm animate-pulse">
                      SCANNING...
                    </div>
                  )}
                  
                  {isSelected && !isScanning && (
                    <div className="text-terminal-green font-terminal text-sm">
                      ✓ MISSION SELECTED
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionSelector;
