import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  className?: string;
}

export default function Breadcrumbs({ 
  items = [], 
  currentPage, 
  className = "" 
}: BreadcrumbsProps) {
  const [location] = useLocation();
  
  // Generate breadcrumbs from current location if not manually provided
  const breadcrumbs: BreadcrumbItem[] = items.length > 0 
    ? items 
    : generateBreadcrumbs(location);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={`pt-1 pb-3 max-w-full overflow-x-auto ${className}`} aria-label="Breadcrumbs">
      <ol className="flex text-sm">
        <li className="flex items-center pl-0">
          <Link href="/" className="text-gray-500 hover:text-[#09261E]">
            Home
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            {index === breadcrumbs.length - 1 && !currentPage ? (
              <span className="font-medium text-[#09261E]">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-gray-500 hover:text-[#09261E]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
        
        {currentPage && (
          <li className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="font-medium text-[#09261E]">
              {currentPage}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from current location path
function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  if (path === '/' || path === '') return [];
  
  // Split path and remove empty segments
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Map known routes to labels
  const routeLabels: Record<string, string> = {
    'properties': 'Properties',
    'guides': 'Guides',
    'tools': 'Tools',
    'help': 'Help',
    'reps': 'REPs',
    'p': 'Property',
    'rep': 'REP',
    'faq': 'FAQ',
    'suggestions': 'Suggestions',
    'report': 'Report an Issue',
    'profile': 'Profile',
    'settings': 'Settings',
    'connect': 'Discussions',
    'dashboard': 'Dashboard',
    'about': 'About',
    'contact': 'Contact',
    'auth': 'Authentication',
    'signin': 'Sign In',
    'register': 'Register',
    'property-dictionary': 'Dictionary',
    'flip-calculator': 'Flip Calculator'
  };
  
  // Build breadcrumbs with accumulated path
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip ID segments in paths like /p/123
    if (index > 0 && (segments[index - 1] === 'p' || segments[index - 1] === 'rep')) {
      return;
    }
    
    // Add breadcrumb if it's not the last segment
    if (index < segments.length - 1 || segments.length === 1) {
      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath
      });
    }
  });
  
  return breadcrumbs;
}