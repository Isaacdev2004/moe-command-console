
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Shield, FileText, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-4 border-t border-primary/20">
      <div className="max-w-6xl mx-auto">
        <Card className="terminal-window">
          <div className="terminal-header">
            <span className="text-primary font-terminal">SYSTEM_INFO.exe</span>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Moe Branding */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-3xl font-terminal text-primary mb-2">
                    MOE
                  </h3>
                  <p className="text-sm text-primary/70 font-mono">
                    Mission-Oriented Expert
                  </p>
                  <div className="h-1 bg-primary/20 rounded-full mt-2">
                    <div className="h-1 bg-primary rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-primary/80 font-mono text-sm text-center">
                  AI-powered assistance for woodworking professionals and Mozaik software users.
                </p>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-terminal text-primary text-lg">Quick Access</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center space-x-2 text-primary/80 hover:text-primary transition-colors font-mono text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-primary/80 hover:text-primary transition-colors font-mono text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-primary/80 hover:text-primary transition-colors font-mono text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>Feedback</span>
                  </a>
                </div>
              </div>
              
              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-terminal text-primary text-lg">Contact</h4>
                <div className="space-y-2">
                  <a 
                    href="mailto:support@justaskmoe.com"
                    className="flex items-center space-x-2 text-primary/80 hover:text-primary transition-colors font-mono text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>support@justaskmoe.com</span>
                  </a>
                  <div className="text-primary/60 font-mono text-xs">
                    <p>Response time: &lt; 24 hours</p>
                    <p>Status: Online</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-primary/20 mt-8 pt-6 text-center">
              <p className="text-primary/60 font-mono text-sm">
                © 2024 Just Ask Moe. Mission-critical woodworking assistance.
              </p>
              <div className="flex justify-center items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary/70 font-terminal text-xs">SYSTEM ONLINE</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;

