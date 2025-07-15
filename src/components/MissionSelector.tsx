
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, FileText, Hammer, HelpCircle, Crosshair, Lock } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  codename: string;
  description: string;
  briefing: string;
  icon: React.ComponentType<any>;
  context: string;
  clearanceLevel: string;
}

const missions: Mission[] = [
  {
    id: 'mozaik',
    title: 'Mozaik Troubleshooting',
    codename: 'OPERATION: BLUEPRINT',
    description: 'Infiltrate cabinet design systems and neutralize parameter anomalies',
    briefing: 'Intelligence reports indicate critical failures in cabinet design protocols. Your mission: diagnose and eliminate all system vulnerabilities.',
    icon: Settings,
    context: 'mozaik-expert',
    clearanceLevel: 'ALPHA'
  },
  {
    id: 'cnc',
    title: 'CNC File Operations',
    codename: 'OPERATION: PRECISION',
    description: 'Intercept and decode compromised machining intelligence',
    briefing: 'Enemy toolpath algorithms have been corrupted. Recover classified CNC data and restore operational capability.',
    icon: FileText,
    context: 'cnc-specialist',
    clearanceLevel: 'BETA'
  },
  {
    id: 'vcarve',
    title: 'VCarve Assistance',
    codename: 'OPERATION: CARVE',
    description: 'Navigate hostile VCarve territories and establish secure workflows',
    briefing: 'Deep cover assignment in VCarve Pro systems. Gather intelligence on workflow optimization and setting configurations.',
    icon: Hammer,
    context: 'vcarve-helper',
    clearanceLevel: 'GAMMA'
  },
  {
    id: 'general',
    title: 'General Reconnaissance',
    codename: 'OPERATION: WOODCRAFT',
    description: 'Conduct broad-spectrum intelligence gathering on woodworking techniques',
    briefing: 'Multi-phase reconnaissance mission. Gather intel on tools, techniques, and project methodologies across all woodworking domains.',
    icon: HelpCircle,
    context: 'woodworking-mentor',
    clearanceLevel: 'DELTA'
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
    }, 2000);
  };

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'ALPHA': return 'text-red-400';
      case 'BETA': return 'text-amber-400';
      case 'GAMMA': return 'text-blue-400';
      case 'DELTA': return 'text-green-400';
      default: return 'text-primary';
    }
  };

  return (
    <section id="missions" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <span className="text-primary font-terminal">EQUIPMENT_SELECTION.exe</span>
          </div>
          <div className="terminal-content">
            <div className="flex items-center space-x-3 mb-4">
              <Crosshair className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-spy text-primary">
                Choose Your Arsenal
              </h2>
            </div>
            <p className="text-primary/70 font-typewriter tracking-wide">
              Select your specialized equipment package for optimal mission performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {missions.map((mission) => {
            const Icon = mission.icon;
            const isSelected = selectedMission === mission.id;
            const isScanning = scanning === mission.id;
            
            return (
              <Card
                key={mission.id}
                className={`cursor-pointer transition-all duration-500 terminal-window hover:scale-102 ${
                  isSelected 
                    ? 'border-primary shadow-lg shadow-primary/20 animate-glow' 
                    : 'border-primary/30 hover:border-primary/60'
                } ${isScanning ? 'animate-pulse' : ''}`}
                onClick={() => handleMissionClick(mission)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Mission Header */}
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-primary/20' : 'bg-primary/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isSelected ? 'text-primary' : 'text-primary/70'
                      }`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-primary/50" />
                      <span className={`text-xs font-terminal ${getClearanceColor(mission.clearanceLevel)}`}>
                        {mission.clearanceLevel}
                      </span>
                    </div>
                  </div>

                  {/* Mission Details */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-spy text-primary">
                        {mission.codename}
                      </h3>
                      <p className="text-sm font-typewriter text-primary/80">
                        {mission.title}
                      </p>
                    </div>
                    
                    <p className="text-sm text-primary/70 font-mono leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Mission Briefing */}
                    <div className="pt-2 border-t border-primary/20">
                      <p className="text-xs text-primary/60 font-mono italic">
                        BRIEFING: {mission.briefing}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="pt-4">
                    {isScanning && (
                      <div className="text-primary font-terminal text-sm animate-pulse">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                          <span>SCANNING EQUIPMENT...</span>
                        </div>
                      </div>
                    )}
                    
                    {isSelected && !isScanning && (
                      <div className="text-primary font-terminal text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>✓ EQUIPMENT SELECTED</span>
                        </div>
                      </div>
                    )}
                  </div>
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

