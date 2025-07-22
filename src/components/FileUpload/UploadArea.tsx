
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Zap } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const supportedFormats = ['.cab', '.cabx', '.mzb', '.xml'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (isUploading) {
    return (
      <Card className="terminal-window">
        <CardContent className="p-6 md:p-12 text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
          <p className="font-terminal text-primary animate-pulse text-sm md:text-base">
            PROCESSING MISSION FILE...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`terminal-window cursor-pointer transition-all duration-300 ${
        dragActive 
          ? 'border-primary shadow-lg shadow-primary/20 animate-glow scale-102' 
          : 'border-primary/30 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="p-6 md:p-12 text-center space-y-4 md:space-y-6">
        <div className={`mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 ${
          dragActive ? 'scale-110 bg-primary/20' : ''
        }`}>
          <Upload className={`w-8 h-8 md:w-10 md:h-10 text-primary/70 transition-all duration-300 ${
            dragActive ? 'animate-bounce' : ''
          }`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-terminal text-primary">
            {dragActive ? 'RELEASE TO DEPLOY' : 'Drop Mission Files Here'}
          </h3>
          <p className="text-primary/70 font-mono text-sm md:text-base">
            or tap to browse classified archives
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs md:text-sm text-primary/60 font-mono">
            SUPPORTED FORMATS:
          </p>
          <div className="grid grid-cols-2 md:flex md:justify-center gap-2 md:space-x-4 md:gap-0">
            {supportedFormats.map((format) => (
              <span key={format} className="px-2 py-1 bg-primary/10 text-primary/80 rounded text-xs md:text-sm font-terminal border border-primary/20">
                {format}
              </span>
            ))}
          </div>
        </div>
        
        <input
          type="file"
          accept="application/xml,.xml,.cab,.cabx,.mzb,*/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Button
          asChild
          className="w-full md:w-auto bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 hover:border-primary transition-all duration-300 font-terminal text-sm md:text-base px-6 py-3"
        >
          <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>BROWSE ARCHIVES</span>
          </label>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadArea;
