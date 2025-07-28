
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';
import { OpenAIService } from '@/services/openai';
import { toast } from 'sonner';

interface ApiKeySetupProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsTestingKey(true);
    
    try {
      const isValid = await OpenAIService.testApiKey(apiKey);
      
      if (isValid) {
        OpenAIService.saveApiKey(apiKey);
        setKeyStatus('valid');
        toast.success('API key validated and saved successfully');
        onApiKeySet(true);
      } else {
        setKeyStatus('invalid');
        toast.error('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setKeyStatus('invalid');
      toast.error('Failed to validate API key');
    } finally {
      setIsTestingKey(false);
    }
  };

  const existingKey = OpenAIService.getApiKey();
  
  if (existingKey && keyStatus !== 'invalid') {
    return (
      <Card className="terminal-window">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-terminal-green" />
            <span className="text-primary font-terminal text-sm">[API_KEY_CONFIGURED]</span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-terminal-green">
            <Key className="w-4 h-4" />
            <span className="font-mono text-sm">OpenAI API key is configured and ready</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setKeyStatus('invalid')}
            className="mt-3 text-xs"
          >
            Update API Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-window">
      <div className="terminal-header">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-terminal-amber" />
          <span className="text-primary font-terminal text-sm">[API_KEY_REQUIRED]</span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-primary font-terminal text-lg">
          OpenAI API Key Setup
        </CardTitle>
        <p className="text-primary/70 font-mono text-sm">
          Enter your OpenAI API key to enable GPT-4 chat assistant with RAG capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-primary font-mono text-sm">
            API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="font-mono bg-transparent border-primary/30 text-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleTestKey}
            disabled={isTestingKey || !apiKey.trim()}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            {isTestingKey ? 'Testing...' : 'Test & Save Key'}
          </Button>
          
          {keyStatus === 'valid' && (
            <CheckCircle className="w-4 h-4 text-terminal-green" />
          )}
          {keyStatus === 'invalid' && (
            <AlertCircle className="w-4 h-4 text-destructive" />
          )}
        </div>
        
        <div className="text-xs text-primary/60 font-mono">
          <p>• Your API key is stored locally in your browser</p>
          <p>• Get your API key from <span className="text-primary">platform.openai.com</span></p>
          <p>• Make sure you have sufficient credits for GPT-4 usage</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
