
interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
}

// Simple in-memory vector database implementation
export class VectorDatabase {
  private documents: Map<string, VectorDocument> = new Map();
  private static instance: VectorDatabase;

  static getInstance(): VectorDatabase {
    if (!VectorDatabase.instance) {
      VectorDatabase.instance = new VectorDatabase();
    }
    return VectorDatabase.instance;
  }

  async addDocument(document: VectorDocument): Promise<void> {
    console.log('Adding document to vector database:', document.id);
    this.documents.set(document.id, document);
  }

  async addDocuments(documents: VectorDocument[]): Promise<void> {
    for (const doc of documents) {
      await this.addDocument(doc);
    }
  }

  async searchSimilar(
    queryEmbedding: number[], 
    topK: number = 5
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    for (const [id, doc] of this.documents) {
      if (!doc.embedding) continue;
      
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      results.push({
        id,
        content: doc.content,
        metadata: doc.metadata,
        score: similarity
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }

  async clear(): Promise<void> {
    this.documents.clear();
  }

  getDocumentCount(): number {
    return this.documents.size;
  }
}
