
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Zap } from 'lucide-react';

interface FileAnalysis {
  fileName: string;
  fileType: string;
  cabinetType?: string;
  parameters?: string[];
  issues?: string[];
}

const FileUploader: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

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
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setAnalyzing(true);
    
    // Simulate file analysis with enhanced feedback
    setTimeout(() => {
      const mockAnalysis: FileAnalysis = {
        fileName: file.name,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        cabinetType: 'Base Cabinet - Single Door',
        parameters: [
          'Width: 24"',
          'Height: 34.5"',
          'Depth: 24"',
          'Door Style: Shaker',
          'Hinge Type: European'
        ],
        issues: file.name.includes('error') ? [
          'Missing door edge banding specification',
          'Shelf thickness mismatch detected'
        ] : []
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
    }, 2000);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setAnalyzing(false);
  };

  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="terminal-window mb-6 md:mb-8">
          <div className="terminal-header">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-primary font-terminal text-sm">FILE_ANALYZER.exe</span>
            </div>
          </div>
          <div className="terminal-content">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-terminal text-primary mb-2">
              Mission File Upload
            </h2>
            <p className="text-primary/70 font-mono text-sm md:text-base">
              Drop your Mozaik file here for instant tactical analysis
            </p>
          </div>
        </div>

        {!uploadedFile ? (
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
              
              {/* Enhanced format display for mobile */}
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
                accept=".cab,.cabx,.mzb,.xml"
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
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Enhanced File Info */}
            <Card className="terminal-window">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-terminal text-primary truncate text-sm md:text-base">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-xs md:text-sm text-primary/70 font-mono">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!analyzing && analysis && (
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-terminal-green" />
                    )}
                    <Button
                      onClick={resetUpload}
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

            {/* Enhanced Analysis Results */}
            {analyzing ? (
              <Card className="terminal-window">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Loader className="animate-spin w-6 h-6 md:w-8 md:h-8 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-terminal text-primary animate-pulse text-sm md:text-base">
                        ANALYZING MISSION FILE...
                      </p>
                      <p className="text-xs md:text-sm text-primary/70 font-mono">
                        Scanning for anomalies and tactical parameters
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : analysis && (
              <Card className="terminal-window">
                <div className="terminal-header">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-terminal-green" />
                    <span className="text-primary font-terminal text-sm">[ANALYSIS_COMPLETE]</span>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-terminal text-primary text-sm md:text-base">FILE METADATA:</h4>
                      <div className="space-y-1 font-mono text-xs md:text-sm">
                        <p className="text-primary/80">Type: {analysis.fileType}</p>
                        {analysis.cabinetType && (
                          <p className="text-primary/80">Cabinet: {analysis.cabinetType}</p>
                        )}
                      </div>
                    </div>
                    
                    {analysis.parameters && (
                      <div className="space-y-3">
                        <h4 className="font-terminal text-primary text-sm md:text-base">PARAMETERS:</h4>
                        <div className="space-y-1 font-mono text-xs md:text-sm">
                          {analysis.parameters.map((param, index) => (
                            <p key={index} className="text-primary/80">• {param}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {analysis.issues && analysis.issues.length > 0 && (
                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-destructive/10 border border-destructive/30 rounded">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                        <h4 className="font-terminal text-destructive text-sm md:text-base">ISSUES DETECTED:</h4>
                      </div>
                      <div className="space-y-1 font-mono text-xs md:text-sm">
                        {analysis.issues.map((issue, index) => (
                          <p key={index} className="text-destructive/80">• {issue}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUploader;

