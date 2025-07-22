
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, FileText, Info } from 'lucide-react';

interface AnalysisData {
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

interface AnalysisResultsProps {
  data: AnalysisData;
  qualityReport?: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data, qualityReport }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-terminal-green';
    if (score >= 60) return 'text-terminal-amber';
    return 'text-terminal-red';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 60) return 'FAIR';
    if (score >= 40) return 'POOR';
    return 'CRITICAL';
  };

  return (
    <Card className="terminal-window">
      <div className="terminal-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-terminal-green" />
            <span className="text-primary font-terminal text-sm">[ANALYSIS_COMPLETE]</span>
          </div>
          {data.qualityScore !== undefined && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-primary/70">QUALITY:</span>
              <span className={`font-terminal text-sm ${getScoreColor(data.qualityScore)}`}>
                {data.qualityScore}/100 {getScoreLabel(data.qualityScore)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* File Metadata */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-terminal text-primary text-sm md:text-base">FILE METADATA:</h4>
            <div className="space-y-1 font-mono text-xs md:text-sm">
              <p className="text-primary/80">Type: {data.fileType}</p>
              {data.version && (
                <p className="text-primary/80">Version: {data.version}</p>
              )}
              {data.cabinetType && (
                <p className="text-primary/80">Cabinet: {data.cabinetType}</p>
              )}
            </div>
          </div>
          
          {/* Parameters */}
          {data.parameters && data.parameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-terminal text-primary text-sm md:text-base">
                PARAMETERS ({data.parameters.length}):
              </h4>
              <div className="space-y-1 font-mono text-xs md:text-sm max-h-32 overflow-y-auto terminal-scroll">
                {data.parameters.slice(0, 10).map((param, index) => (
                  <p key={index} className="text-primary/80">• {param}</p>
                ))}
                {data.parameters.length > 10 && (
                  <p className="text-primary/60 italic">... and {data.parameters.length - 10} more</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Parts and Constraints */}
        {(data.parts?.length || data.constraints?.length) && (
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {data.parts && data.parts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-terminal text-primary text-sm md:text-base">
                  PARTS ({data.parts.length}):
                </h4>
                <div className="space-y-1 font-mono text-xs md:text-sm max-h-32 overflow-y-auto terminal-scroll">
                  {data.parts.slice(0, 8).map((part, index) => (
                    <p key={index} className="text-primary/80">• {part}</p>
                  ))}
                  {data.parts.length > 8 && (
                    <p className="text-primary/60 italic">... and {data.parts.length - 8} more</p>
                  )}
                </div>
              </div>
            )}

            {data.constraints && data.constraints.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-terminal text-primary text-sm md:text-base">
                  CONSTRAINTS ({data.constraints.length}):
                </h4>
                <div className="space-y-1 font-mono text-xs md:text-sm max-h-32 overflow-y-auto terminal-scroll">
                  {data.constraints.map((constraint, index) => (
                    <p key={index} className="text-primary/80">• {constraint}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Issues and Warnings */}
        {((data.issues && data.issues.length > 0) || (data.warnings && data.warnings.length > 0)) && (
          <div className="space-y-4">
            {data.issues && data.issues.length > 0 && (
              <div className="p-3 md:p-4 bg-destructive/10 border border-destructive/30 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <h4 className="font-terminal text-destructive text-sm md:text-base">
                    CRITICAL ISSUES ({data.issues.length}):
                  </h4>
                </div>
                <div className="space-y-1 font-mono text-xs md:text-sm">
                  {data.issues.map((issue, index) => (
                    <p key={index} className="text-destructive/80">• {issue}</p>
                  ))}
                </div>
              </div>
            )}

            {data.warnings && data.warnings.length > 0 && (
              <div className="p-3 md:p-4 bg-terminal-amber/10 border border-terminal-amber/30 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-terminal-amber flex-shrink-0" />
                  <h4 className="font-terminal text-terminal-amber text-sm md:text-base">
                    WARNINGS ({data.warnings.length}):
                  </h4>
                </div>
                <div className="space-y-1 font-mono text-xs md:text-sm">
                  {data.warnings.map((warning, index) => (
                    <p key={index} className="text-terminal-amber/80">• {warning}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quality Report */}
        {qualityReport && (
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded">
            <h4 className="font-terminal text-primary text-sm md:text-base mb-3">
              DETAILED QUALITY REPORT:
            </h4>
            <pre className="font-mono text-xs md:text-sm text-primary/80 whitespace-pre-wrap overflow-x-auto">
              {qualityReport}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
