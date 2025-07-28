
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ThumbsUp, ThumbsDown, Bot, User, Brain, Database } from 'lucide-react';
import { useRAGContext } from '@/hooks/useRAGContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'up' | 'down';
  hasContext?: boolean;
}

interface EnhancedChatTerminalProps {
  selectedMission?: string;
  hasApiKey: boolean;
}

const EnhancedChatTerminal: React.FC<EnhancedChatTerminalProps> = ({ 
  selectedMission = 'general',
  hasApiKey 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: hasApiKey 
        ? `MOE Terminal with GPT-4 + RAG initialized. ${selectedMission === 'general' ? 'General woodworking assistance mode active.' : `${selectedMission} specialist mode active.`} Upload files to build knowledge base, then ask questions for contextual responses.`
        : 'MOE Terminal initialized. Please configure your OpenAI API key to enable GPT-4 chat assistant with RAG capabilities.',
      timestamp: new Date(),
      hasContext: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { generateResponse, contextInfo } = useRAGContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!hasApiKey) {
      toast.error('Please configure your OpenAI API key first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(input, selectedMission);
      
      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          hasContext: contextInfo.documentsProcessed > 0
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to generate response');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        hasContext: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary font-terminal">MOE_GPT4_RAG_v3.0 [SECURE_CHANNEL]</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-3 h-3 text-primary" />
                  <span className="text-primary/70 font-terminal text-xs">
                    {contextInfo.documentsProcessed} docs
                  </span>
                </div>
                <div className="text-primary/70 font-terminal text-sm">
                  {selectedMission.toUpperCase()}_MODE
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto terminal-scroll p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    {message.hasContext ? (
                      <Brain className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                  message.type === 'user' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-muted/20 text-primary/90 border border-primary/20'
                }`}>
                  <p className="font-mono text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-primary/60 font-terminal">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.hasContext && (
                        <Brain className="w-3 h-3 text-terminal-green" />
                      )}
                    </div>
                    
                    {message.type === 'assistant' && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-6 w-6 p-0 hover:bg-primary/20 ${
                            message.rating === 'up' ? 'text-primary' : 'text-primary/50'
                          }`}
                          onClick={() => handleRating(message.id, 'up')}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-6 w-6 p-0 hover:bg-destructive/20 ${
                            message.rating === 'down' ? 'text-destructive' : 'text-primary/50'
                          }`}
                          onClick={() => handleRating(message.id, 'down')}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex space-x-3 justify-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted/20 text-primary/90 border border-primary/20 px-4 py-2 rounded">
                  <p className="font-mono text-sm">
                    <span className="animate-pulse">MOE is thinking with GPT-4</span>
                    <span className="animate-blink">...</span>
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-primary/30 p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={hasApiKey ? "Ask about your uploaded files..." : "Configure API key to enable chat"}
                disabled={!hasApiKey}
                className="bg-transparent border-primary/30 text-primary placeholder:text-primary/50 font-mono focus:border-primary typing-cursor"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || !hasApiKey}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 hover:border-primary transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-primary/50 font-terminal">
                Press Enter to send • Shift+Enter for new line
              </p>
              {contextInfo.documentsProcessed > 0 && (
                <p className="text-xs text-terminal-green font-terminal">
                  {contextInfo.documentsProcessed} files in knowledge base
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedChatTerminal;
