
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Video, Users, Database, Satellite, Radio, Eye } from 'lucide-react';

interface StatusItem {
  id: string;
  label: string;
  codename: string;
  status: 'complete' | 'pending' | 'processing';
  timestamp?: string;
  icon: React.ComponentType<any>;
}

const statusItems: StatusItem[] = [
  {
    id: 'forums',
    label: 'Forum Intelligence',
    codename: 'CHATTER',
    status: 'complete',
    timestamp: '2 hours ago',
    icon: CheckCircle
  },
  {
    id: 'facebook',
    label: 'Social Network Tap',
    codename: 'SOCIAL-6',
    status: 'pending',
    icon: Clock
  },
  {
    id: 'videos',
    label: 'Video Surveillance',
    codename: 'EYEWATCH',
    status: 'processing',
    timestamp: 'Processing...',
    icon: Video
  },
  {
    id: 'cadmate',
    label: 'Asset Training',
    codename: 'MENTOR',
    status: 'complete',
    timestamp: '1 day ago',
    icon: Users
  },
  {
    id: 'database',
    label: 'Intel Database',
    codename: 'ARCHIVE',
    status: 'complete',
    timestamp: 'Live',
    icon: Database
  }
];

const StatusSidebar: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-terminal-green';
      case 'pending':
        return 'text-terminal-amber';
      case 'processing':
        return 'text-terminal-green animate-pulse';
      default:
        return 'text-primary/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return '✅';
      case 'pending':
        return '🕐';
      case 'processing':
        return '⚡';
      default:
        return '❓';
    }
  };

  return (
    <div className="w-80 space-y-4">
      <Card className="terminal-window">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <Satellite className="w-4 h-4 text-primary" />
            <span className="text-primary font-terminal">COMMS_ARRAY.exe</span>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h3 className="font-spy text-primary mb-2">Mission Control</h3>
            <p className="text-xs text-primary/70 font-typewriter">
              Last transmission: {new Date().toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-3">
            {statusItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-primary/5 rounded border border-primary/20">
                  <div className={`${getStatusColor(item.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-typewriter text-primary block">
                          {item.label}
                        </span>
                        <span className="text-xs font-terminal text-primary/60">
                          {item.codename}
                        </span>
                      </div>
                      <span className="text-xs">
                        {getStatusIcon(item.status)}
                      </span>
                    </div>
                    {item.timestamp && (
                      <p className="text-xs text-primary/60 font-mono mt-1">
                        {item.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="terminal-window">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-primary font-terminal">INTEL_FEED.log</span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-start space-x-2">
              <Eye className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <div className="text-primary/80">
                <span className="text-primary">[12:34:56]</span> Agent Frost video surveillance processed
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Eye className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <div className="text-primary/80">
                <span className="text-primary">[11:22:33]</span> Forum chatter indexed: "Cabinet infiltration protocols"
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Eye className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <div className="text-primary/80">
                <span className="text-primary">[10:15:42]</span> CNC equipment manual updated
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Eye className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <div className="text-primary/80">
                <span className="text-primary">[09:08:21]</span> Database optimization: Mission accomplished
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSidebar;

