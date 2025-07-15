
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ThumbsUp, ThumbsDown, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'up' | 'down';
}

interface ChatTerminalProps {
  selectedMission?: string;
}

const ChatTerminal: React.FC<ChatTerminalProps> = ({ selectedMission = 'general' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `MOE Terminal initialized. ${selectedMission === 'general' ? 'General woodworking assistance mode active.' : `${selectedMission} specialist mode active.`} How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're working on a woodworking project. Could you provide more details about the specific issue you're encountering?",
        "Based on your question, I recommend checking the following parameters in your Mozaik file. Would you like me to walk you through the troubleshooting steps?",
        "This appears to be a common CNC toolpath issue. Here are three potential solutions you can try...",
        "For VCarve operations like this, make sure your bit diameter and stepdown values are properly configured. Let me explain the optimal settings."
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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
                <span className="text-primary font-terminal">MOE_TERMINAL_v2.1 [SECURE_CHANNEL]</span>
              </div>
              <div className="text-primary/70 font-terminal text-sm">
                {selectedMission.toUpperCase()}_MODE
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
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                  message.type === 'user' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-muted/20 text-primary/90 border border-primary/20'
                }`}>
                  <p className="font-mono text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-primary/60 font-terminal">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
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
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted/20 text-primary/90 border border-primary/20 px-4 py-2 rounded">
                  <p className="font-mono text-sm">
                    <span className="animate-pulse">MOE is typing</span>
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
                placeholder="Enter your question..."
                className="bg-transparent border-primary/30 text-primary placeholder:text-primary/50 font-mono focus:border-primary typing-cursor"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 hover:border-primary transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-primary/50 font-terminal mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatTerminal;

