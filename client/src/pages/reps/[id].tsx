import { useEffect } from 'react';
import { useParams } from 'wouter';
import RepProfilePage from '../rep-profile-page';

export default function RepProfileDynamicRoute() {
  const params = useParams();
  
  // This is a wrapper component that renders the RepProfilePage
  // We can add additional logic here in the future if needed
  
  return <RepProfilePage />;
}