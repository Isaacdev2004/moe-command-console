
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Video, Users, Database } from 'lucide-react';

interface StatusItem {
  id: string;
  label: string;
  status: 'complete' | 'pending' | 'processing';
  timestamp?: string;
  icon: React.ComponentType<any>;
}

const statusItems: StatusItem[] = [
  {
    id: 'forums',
    label: 'Forum Sync',
    status: 'complete',
    timestamp: '2 hours ago',
    icon: CheckCircle
  },
  {
    id: 'facebook',
    label: 'FB Group Sync',
    status: 'pending',
    icon: Clock
  },
  {
    id: 'videos',
    label: 'Video Processing',
    status: 'processing',
    timestamp: 'Processing...',
    icon: Video
  },
  {
    id: 'cadmate',
    label: 'CADMate Training',
    status: 'complete',
    timestamp: '1 day ago',
    icon: Users
  },
  {
    id: 'database',
    label: 'Knowledge Base',
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
        return 'text-terminal-green/50';
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
          <span className="text-terminal-green font-terminal">KNOWLEDGE_SYNC.exe</span>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h3 className="font-terminal text-terminal-green mb-2">System Status</h3>
            <p className="text-xs text-terminal-green/70 font-mono">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-3">
            {statusItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center space-x-3 p-2 bg-terminal-green/5 rounded border border-terminal-green/20">
                  <div className={`${getStatusColor(item.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-terminal text-terminal-green">
                        {item.label}
                      </span>
                      <span className="text-xs">
                        {getStatusIcon(item.status)}
                      </span>
                    </div>
                    {item.timestamp && (
                      <p className="text-xs text-terminal-green/60 font-mono">
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
          <span className="text-terminal-green font-terminal">ACTIVITY_LOG.txt</span>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2 text-xs font-mono">
            <div className="text-terminal-green/80">
              <span className="text-terminal-green">[12:34:56]</span> New Nic Frost video analyzed
            </div>
            <div className="text-terminal-green/80">
              <span className="text-terminal-green">[11:22:33]</span> Forum thread indexed: "Cabinet door issues"
            </div>
            <div className="text-terminal-green/80">
              <span className="text-terminal-green">[10:15:42]</span> CNC troubleshooting guide updated
            </div>
            <div className="text-terminal-green/80">
              <span className="text-terminal-green">[09:08:21]</span> Database optimization complete
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusSidebar;
