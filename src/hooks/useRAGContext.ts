
import { useState, useCallback } from 'react';
import { RAGService } from '@/services/ragService';
import { toast } from 'sonner';

interface UseRAGContextReturn {
  processFile: (fileName: string, content: string, metadata: Record<string, any>) => Promise<void>;
  generateResponse: (query: string, mission: string) => Promise<string | null>;
  isProcessing: boolean;
  contextInfo: {
    documentsProcessed: number;
    lastProcessedFile: string | null;
  };
}

export const useRAGContext = (): UseRAGContextReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [contextInfo, setContextInfo] = useState({
    documentsProcessed: 0,
    lastProcessedFile: null as string | null
  });

  const ragService = new RAGService();

  const processFile = useCallback(async (
    fileName: string, 
    content: string, 
    metadata: Record<string, any>
  ) => {
    setIsProcessing(true);
    try {
      const result = await ragService.processFileContent(fileName, content, metadata);
      
      if (result.success) {
        setContextInfo(prev => ({
          documentsProcessed: prev.documentsProcessed + 1,
          lastProcessedFile: fileName
        }));
        toast.success(`File ${fileName} processed and added to knowledge base`);
      } else {
        toast.error(`Failed to process ${fileName}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file for RAG context');
    } finally {
      setIsProcessing(false);
    }
  }, [ragService]);

  const generateResponse = useCallback(async (
    query: string, 
    mission: string
  ): Promise<string | null> => {
    try {
      const result = await ragService.generateContextualResponse(query, mission);
      
      if (result.success) {
        return result.data || null;
      } else {
        toast.error(`Failed to generate response: ${result.error}`);
        return null;
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate contextual response');
      return null;
    }
  }, [ragService]);

  return {
    processFile,
    generateResponse,
    isProcessing,
    contextInfo
  };
};
