
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import UploadArea from './FileUpload/UploadArea';
import FileInfo from './FileUpload/FileInfo';
import AnalysisResults from './FileUpload/AnalysisResults';
import { FileParser } from '@/utils/fileParser';
import { MetadataValidator } from '@/utils/metadataValidator';

interface FileAnalysis {
  fileName: string;
  fileType: string;
  version?: string;
  cabinetType?: string;
  parameters?: string[];
  parts?: string[];
  constraints?: string[];
  issues?: string[];
  qualityScore?: number;
  warnings?: string[];
}

const FileUploader: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [qualityReport, setQualityReport] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name, file.size, 'bytes');
    setUploadedFile(file);
    setAnalyzing(true);
    setAnalysis(null);
    setQualityReport('');
    
    try {
      // Parse the file
      const parseResult = await FileParser.parseFile(file);
      
      if ('type' in parseResult) {
        // Parsing error occurred
        console.error('Parsing error:', parseResult);
        toast.error(`Parsing failed: ${parseResult.message}`);
        setAnalysis({
          fileName: file.name,
          fileType: 'ERROR',
          issues: [parseResult.message, ...(parseResult.details ? [parseResult.details] : [])]
        });
      } else {
        // Successful parsing
        console.log('Parsed file data:', parseResult);
        
        // Validate the parsed data
        const validation = MetadataValidator.validateCabinetData(parseResult);
        console.log('Validation result:', validation);
        
        // Generate quality report
        const report = MetadataValidator.generateQualityReport(parseResult, validation);
        
        // Combine parsing results with validation
        const analysisData: FileAnalysis = {
          ...parseResult,
          qualityScore: validation.score,
          warnings: validation.warnings,
          issues: [...(parseResult.issues || []), ...validation.issues]
        };
        
        setAnalysis(analysisData);
        setQualityReport(report);
        
        // Show toast notification
        if (validation.isValid) {
          toast.success(`Analysis complete! Quality score: ${validation.score}/100`);
        } else {
          toast.warning(`Analysis complete with ${validation.issues.length} issues`);
        }
      }
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process file');
      setAnalysis({
        fileName: file.name,
        fileType: 'ERROR',
        issues: ['Unexpected error during file processing']
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetUpload = () => {
    console.log('Resetting file upload');
    setUploadedFile(null);
    setAnalysis(null);
    setAnalyzing(false);
    setQualityReport('');
  };

  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="terminal-window mb-6 md:mb-8">
          <div className="terminal-header">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-primary font-terminal text-sm">FILE_ANALYZER_v2.exe</span>
            </div>
          </div>
          <div className="terminal-content">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-terminal text-primary mb-2">
              Advanced File Analysis
            </h2>
            <p className="text-primary/70 font-mono text-sm md:text-base">
              Upload Mozaik files for comprehensive parsing and validation
            </p>
          </div>
        </div>

        {!uploadedFile ? (
          <UploadArea onFileSelect={handleFileSelect} isUploading={analyzing} />
        ) : (
          <div className="space-y-4 md:space-y-6">
            <FileInfo 
              file={uploadedFile} 
              isAnalyzing={analyzing} 
              hasAnalysis={!!analysis}
              onReset={resetUpload}
            />
            
            {analyzing && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-3 text-primary">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="font-terminal animate-pulse">
                    ANALYZING FILE STRUCTURE...
                  </span>
                </div>
              </div>
            )}
            
            {!analyzing && analysis && (
              <AnalysisResults data={analysis} qualityReport={qualityReport} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUploader;
