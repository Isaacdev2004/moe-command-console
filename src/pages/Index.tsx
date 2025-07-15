
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import MissionSelector from '@/components/MissionSelector';
import FileUploader from '@/components/FileUploader';
import ChatTerminal from '@/components/ChatTerminal';
import StatusSidebar from '@/components/StatusSidebar';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-terminal-bg text-terminal-green">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Mission Selector */}
      <MissionSelector onMissionSelect={handleMissionSelect} />
      
      {/* File Upload */}
      <FileUploader />
      
      {/* Chat Interface with optional sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 pb-16">
        <div className="flex-1">
          <ChatTerminal selectedMission={selectedMission?.context || 'general'} />
        </div>
        <div className="hidden lg:block">
          <StatusSidebar />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
