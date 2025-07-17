
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import MissionSelector from '@/components/MissionSelector';
import FileUploader from '@/components/FileUploader';
import ChatTerminal from '@/components/ChatTerminal';
import StatusSidebar from '@/components/StatusSidebar';
import Footer from '@/components/Footer';
import AuthHeader from '@/components/AuthHeader';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  context: string;
}

const Index = () => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

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
      
      {/* Chat Interface - moved up to be visible on initial load */}
      <div className="flex flex-col xl:flex-row gap-4 md:gap-8 px-4 pb-8 md:pb-16">
        <div className="flex-1 min-w-0">
          <ChatTerminal selectedMission={selectedMission?.context || 'general'} />
        </div>
        <div className="hidden xl:block xl:w-80 flex-shrink-0">
          <StatusSidebar />
        </div>
      </div>
      
      {/* Enhanced File Upload - moved after chat */}
      <FileUploader />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
