
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

export class OpenAIService {
  private static API_KEY_STORAGE_KEY = 'openai_api_key';
  private static baseUrl = 'https://api.openai.com/v1';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('OpenAI API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing OpenAI API key:', error);
      return false;
    }
  }

  static async generateChatCompletion(
    messages: OpenAIMessage[],
    model: string = 'gpt-4.1-2025-04-14',
    temperature: number = 0.7
  ): Promise<{ success: boolean; data?: string; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key not found' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error?.message || 'API request failed' };
      }

      const data: OpenAIResponse = await response.json();
      return { 
        success: true, 
        data: data.choices[0]?.message?.content || 'No response generated' 
      };
    } catch (error) {
      console.error('Error generating chat completion:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to OpenAI API' 
      };
    }
  }

  static async generateEmbedding(text: string): Promise<{ success: boolean; data?: number[]; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key not found' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error?.message || 'Embedding request failed' };
      }

      const data: EmbeddingResponse = await response.json();
      return { 
        success: true, 
        data: data.data[0]?.embedding || [] 
      };
    } catch (error) {
      console.error('Error generating embedding:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate embedding' 
      };
    }
  }
}
