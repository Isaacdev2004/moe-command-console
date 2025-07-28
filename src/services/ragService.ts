
import { OpenAIService } from './openai';
import { VectorDatabase } from './vectorDatabase';

interface RAGContext {
  query: string;
  retrievedDocuments: Array<{
    content: string;
    metadata: Record<string, any>;
    score: number;
  }>;
  systemPrompt: string;
}

export class RAGService {
  private vectorDB: VectorDatabase;

  constructor() {
    this.vectorDB = VectorDatabase.getInstance();
  }

  async processFileContent(
    fileName: string,
    content: string,
    metadata: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Processing file content for RAG:', fileName);
      
      // Split content into chunks for better retrieval
      const chunks = this.splitTextIntoChunks(content, 1000);
      
      const documents = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Generate embedding for the chunk
        const embeddingResult = await OpenAIService.generateEmbedding(chunk);
        if (!embeddingResult.success) {
          console.error('Failed to generate embedding for chunk:', embeddingResult.error);
          continue;
        }

        documents.push({
          id: `${fileName}_chunk_${i}`,
          content: chunk,
          metadata: {
            ...metadata,
            fileName,
            chunkIndex: i,
            totalChunks: chunks.length
          },
          embedding: embeddingResult.data
        });
      }

      await this.vectorDB.addDocuments(documents);
      console.log(`Added ${documents.length} chunks to vector database`);
      
      return { success: true };
    } catch (error) {
      console.error('Error processing file content:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process file content' 
      };
    }
  }

  async generateContextualResponse(
    userQuery: string,
    selectedMission: string = 'general'
  ): Promise<{ success: boolean; data?: string; error?: string; context?: RAGContext }> {
    try {
      console.log('Generating contextual response for query:', userQuery);
      
      // Generate embedding for the user query
      const queryEmbeddingResult = await OpenAIService.generateEmbedding(userQuery);
      if (!queryEmbeddingResult.success) {
        return { success: false, error: 'Failed to generate query embedding' };
      }

      // Retrieve relevant documents
      const retrievedDocs = await this.vectorDB.searchSimilar(
        queryEmbeddingResult.data!,
        5
      );

      // Create system prompt with mission context
      const systemPrompt = this.buildSystemPrompt(selectedMission, retrievedDocs);
      
      // Generate response using GPT-4
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userQuery }
      ];

      const response = await OpenAIService.generateChatCompletion(messages);
      
      if (!response.success) {
        return { success: false, error: response.error };
      }

      const context: RAGContext = {
        query: userQuery,
        retrievedDocuments: retrievedDocs,
        systemPrompt
      };

      return { 
        success: true, 
        data: response.data,
        context 
      };
    } catch (error) {
      console.error('Error generating contextual response:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate response' 
      };
    }
  }

  private splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    
    return chunks;
  }

  private buildSystemPrompt(mission: string, retrievedDocs: Array<{ content: string; metadata: Record<string, any> }>): string {
    const missionContext = this.getMissionContext(mission);
    
    const contextInfo = retrievedDocs.length > 0 
      ? `\n\nRelevant file information:\n${retrievedDocs.map(doc => 
          `- From ${doc.metadata.fileName}: ${doc.content.substring(0, 200)}...`
        ).join('\n')}`
      : '';

    return `You are MOE (Master of Everything), a specialized AI assistant for woodworking and Mozaik CAD software.

${missionContext}

Key responsibilities:
- Analyze uploaded Mozaik files (.moz, .dat, .des) and provide specific guidance
- Troubleshoot CNC toolpath issues and machining problems
- Suggest optimizations for cabinet designs and manufacturing processes
- Provide context-aware responses based on uploaded file content

Always respond in a helpful, technical manner with specific actionable advice.
${contextInfo}`;
  }

  private getMissionContext(mission: string): string {
    const contexts = {
      'general': 'You are in general woodworking assistance mode. Help with any woodworking or Mozaik-related questions.',
      'troubleshooting': 'You are in troubleshooting mode. Focus on diagnosing and solving specific problems with Mozaik files, CNC operations, or manufacturing issues.',
      'optimization': 'You are in optimization mode. Analyze designs and suggest improvements for efficiency, cost reduction, or quality enhancement.',
      'training': 'You are in training mode. Provide educational content and step-by-step guidance for learning Mozaik software and woodworking techniques.'
    };
    
    return contexts[mission as keyof typeof contexts] || contexts.general;
  }
}
