
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import MissionSelector from '@/components/MissionSelector';
import FileUploader from '@/components/FileUploader';
import EnhancedChatTerminal from '@/components/EnhancedChatTerminal';
import StatusSidebar from '@/components/StatusSidebar';
import Footer from '@/components/Footer';
import AuthHeader from '@/components/AuthHeader';
import ApiKeySetup from '@/components/ApiKeySetup';
import { OpenAIService } from '@/services/openai';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  context: string;
}

const Index = () => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [hasApiKey, setHasApiKey] = useState(!!OpenAIService.getApiKey());

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Auth Header */}
      <AuthHeader />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Welcome Message with MOE's personality */}
      <WelcomeMessage />
      
      {/* Mission Selector */}
      <MissionSelector onMissionSelect={handleMissionSelect} />
      
      {/* API Key Setup */}
      {!hasApiKey && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <ApiKeySetup onApiKeySet={setHasApiKey} />
          </div>
        </section>
      )}
      
      {/* Enhanced Chat Interface with GPT-4 + RAG */}
      <div className="flex flex-col xl:flex-row gap-4 md:gap-8 px-4 pb-8 md:pb-16">
        <div className="flex-1 min-w-0">
          <EnhancedChatTerminal 
            selectedMission={selectedMission?.context || 'general'}
            hasApiKey={hasApiKey}
          />
        </div>
        <div className="hidden xl:block xl:w-80 flex-shrink-0">
          <StatusSidebar />
        </div>
      </div>
      
      {/* Enhanced File Upload with RAG integration */}
      <FileUploader />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
