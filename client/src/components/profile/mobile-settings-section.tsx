import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileSettingsSectionProps {
  section: string;
  title: string;
  children: React.ReactNode;
}

const MobileSettingsSection = ({ section, title, children }: MobileSettingsSectionProps) => {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">
      {/* Back Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto text-[#135341] hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Settings
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Section Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default MobileSettingsSection;