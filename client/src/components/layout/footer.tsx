import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  FileText, 
  Shield, 
  Cookie,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#09261E] text-white pt-16 pb-8 px-6 pr-10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">PropertyDeals</h3>
            <p className="text-white/80 mb-4 text-sm">
              The premier platform for finding exclusive off-market real estate deals and connecting with trusted professionals.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white/60 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-white/60 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-white/60 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-white/60 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/properties" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Browse Properties
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/reps" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  The REP Room
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/tools" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Investor Tools
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/discussions" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Discussions
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/playbook" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Property Playbook
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/playbook/dictionary" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Property Dictionary
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/help" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Help Center
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/help/faq" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  FAQ
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/help/suggestions" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Suggest a Feature
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/contact" className="text-white/80 hover:text-white inline-flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Legal */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/legal/terms" className="text-white/80 hover:text-white inline-flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Terms & Conditions
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/legal/fha-compliance" className="text-white/80 hover:text-white inline-flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  FHA Compliance
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/legal/cookies" className="text-white/80 hover:text-white inline-flex items-center">
                  <Cookie className="h-3.5 w-3.5 mr-1.5" />
                  Cookies Policy
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/10 text-white placeholder:text-white/50 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
                />
                <button className="bg-[#135341] hover:bg-[#1A6950] px-3 py-2 rounded-r-md text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© 2025 PropertyDeals. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}