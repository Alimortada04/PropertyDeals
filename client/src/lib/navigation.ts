// Helper functions for navigation management

// Create an object that holds current state
const navState = {
  currentHelpSection: 'main', // 'main' (default), 'faq', 'suggestions', 'report'
  currentProfileTab: 'account' // default tab
};

// Handle navigation to help sub-routes
export const navigateToHelpSection = (section: string) => {
  // Store the current section
  navState.currentHelpSection = section;
  
  // Update the URL without triggering a page refresh, but don't change the actual URL
  // This prevents 404 errors while still making bookmarking work
  window.history.pushState({}, '', `/profile/help`);
  
  // Force the component to update by dispatching a custom event with section information
  window.dispatchEvent(new CustomEvent('helpSectionChanged', { 
    detail: { section }
  }));
};

// Handle navigation to profile tabs
export const navigateToProfileTab = (tab: string) => {
  // Store the current tab
  navState.currentProfileTab = tab;
  
  // Update the URL without triggering a page refresh
  window.history.pushState({}, '', `/profile/${tab}`);
  
  // Force the component to update by dispatching a custom event  
  window.dispatchEvent(new CustomEvent('profileTabChanged', { 
    detail: { tab } 
  }));
};

// Get current help section
export const getCurrentHelpSection = () => {
  return navState.currentHelpSection;
};

// Get current profile tab
export const getCurrentProfileTab = () => {
  return navState.currentProfileTab;
};