// Helper functions for navigation management

// Handle navigation to help sub-routes
export const navigateToHelpSection = (section: string) => {
  // Update the URL without triggering a page refresh
  window.history.pushState({}, '', `/profile/help/${section}`);
  
  // Force the component to update by dispatching a custom event
  window.dispatchEvent(new CustomEvent('pathChanged', { detail: { path: `/profile/help/${section}` } }));
};

// Handle navigation to profile tabs
export const navigateToProfileTab = (tab: string) => {
  // Update the URL without triggering a page refresh
  window.history.pushState({}, '', `/profile/${tab}`);
  
  // Force the component to update by dispatching a custom event  
  window.dispatchEvent(new CustomEvent('profileTabChanged', { detail: { tab } }));
};