
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';

interface FileInfoProps {
  file: File;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  onReset: () => void;
}

const FileInfo: React.FC<FileInfoProps> = ({ file, isAnalyzing, hasAnalysis, onReset }) => {
  return (
    <Card className="terminal-window">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-terminal text-primary truncate text-sm md:text-base">
                {file.name}
              </h3>
              <p className="text-xs md:text-sm text-primary/70 font-mono">
                {(file.size / 1024).toFixed(1)} KB • {isAnalyzing ? 'Processing...' : 'Ready'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {!isAnalyzing && hasAnalysis && (
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-terminal-green" />
            )}
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="text-primary/70 hover:text-primary hover:bg-primary/10 p-1 md:p-2"
            >
              <span className="text-xs md:text-sm">Reset</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileInfo;
