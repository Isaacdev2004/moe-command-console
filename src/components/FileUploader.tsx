
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

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
    
    // Simulate file analysis
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

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <span className="text-terminal-green font-terminal">FILE_ANALYZER.exe</span>
          </div>
          <div className="terminal-content">
            <h2 className="text-3xl md:text-4xl font-terminal text-terminal-green mb-2">
              Upload Your Files
            </h2>
            <p className="text-terminal-green/70 font-mono">
              Drop your Mozaik file here for instant analysis
            </p>
          </div>
        </div>

        {!uploadedFile ? (
          <Card
            className={`terminal-window cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-terminal-green shadow-lg shadow-terminal-green/20 animate-glow' 
                : 'border-terminal-green/30 hover:border-terminal-green/60'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="p-12 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-terminal-green/10 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-terminal-green/70" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-terminal text-terminal-green">
                  Drop your Mozaik file here
                </h3>
                <p className="text-terminal-green/70 font-mono">
                  or click to browse files
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-terminal-green/60 font-mono">
                  Supported formats:
                </p>
                <div className="flex justify-center space-x-4">
                  {supportedFormats.map((format) => (
                    <span key={format} className="px-2 py-1 bg-terminal-green/10 text-terminal-green/80 rounded text-sm font-terminal">
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
                className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 hover:border-terminal-green transition-all duration-300 font-terminal"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  BROWSE FILES
                </label>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <Card className="terminal-window">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-terminal-green" />
                  <div>
                    <h3 className="font-terminal text-terminal-green">{uploadedFile.name}</h3>
                    <p className="text-sm text-terminal-green/70 font-mono">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {!analyzing && analysis && (
                    <CheckCircle className="w-6 h-6 text-terminal-green ml-auto" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analyzing ? (
              <Card className="terminal-window">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin w-8 h-8 border-2 border-terminal-green/30 border-t-terminal-green rounded-full mx-auto"></div>
                    <p className="font-terminal text-terminal-green animate-pulse">
                      ANALYZING FILE...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : analysis && (
              <Card className="terminal-window">
                <div className="terminal-header">
                  <span className="text-terminal-green font-terminal">[ANALYSIS_COMPLETE]</span>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-terminal text-terminal-green mb-2">FILE METADATA:</h4>
                      <div className="space-y-1 font-mono text-sm">
                        <p className="text-terminal-green/80">Type: {analysis.fileType}</p>
                        {analysis.cabinetType && (
                          <p className="text-terminal-green/80">Cabinet: {analysis.cabinetType}</p>
                        )}
                      </div>
                    </div>
                    
                    {analysis.parameters && (
                      <div>
                        <h4 className="font-terminal text-terminal-green mb-2">PARAMETERS:</h4>
                        <div className="space-y-1 font-mono text-sm">
                          {analysis.parameters.map((param, index) => (
                            <p key={index} className="text-terminal-green/80">• {param}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {analysis.issues && analysis.issues.length > 0 && (
                    <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <h4 className="font-terminal text-destructive">ISSUES DETECTED:</h4>
                      </div>
                      <div className="space-y-1 font-mono text-sm">
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
