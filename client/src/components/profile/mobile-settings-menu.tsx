import React from 'react';
import { Link } from 'wouter';
import { 
  User, 
  Settings, 
  Users, 
  Bell, 
  Wrench, 
  CreditCard, 
  HelpCircle, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MobileSettingsMenuProps {
  currentSection?: string;
}

const MobileSettingsMenu = ({ currentSection }: MobileSettingsMenuProps) => {
  const { logoutMutation } = useAuth();

  const settingsItems = [
    {
      id: 'account',
      title: 'Account',
      description: 'Personal information and security',
      icon: User,
      href: '/profile/account'
    },
    {
      id: 'property_preferences',
      title: 'Property Preferences',
      description: 'Investment criteria and filters',
      icon: Settings,
      href: '/profile/property_preferences'
    },
    {
      id: 'connections',
      title: 'Connections',
      description: 'Contractors and professionals',
      icon: Users,
      href: '/profile/connections'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email and push preferences',
      icon: Bell,
      href: '/profile/notifications'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Third-party connections',
      icon: Wrench,
      href: '/profile/integrations'
    },
    {
      id: 'memberships',
      title: 'Memberships',
      description: 'Plans and billing',
      icon: CreditCard,
      href: '/profile/memberships'
    },
    {
      id: 'help',
      title: 'Help Center',
      description: 'Support and documentation',
      icon: HelpCircle,
      href: '/profile/help'
    }
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      </div>
      {/* Settings Menu Items */}
      <div className="mt-6 px-4 space-y-3 pb-20">
        {settingsItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <div className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 transition-colors min-h-[48px] flex items-center justify-between mt-[5px] mb-[5px]">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-[#135341]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          );
        })}
        
        {/* Logout Button with Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-white rounded-lg border border-gray-200 p-4 active:bg-red-50 hover:bg-red-50/50 transition-colors min-h-[48px] flex items-center justify-between mt-[5px] mb-[5px]">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-red-600 truncate text-left">
                    Log Out
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Sign out of your account
                  </p>
                </div>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, take me back</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, log me out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MobileSettingsMenu;