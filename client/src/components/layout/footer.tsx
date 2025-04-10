import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-[#09261E] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mr-2">
                <span className="text-[#09261E] font-heading font-bold text-lg">PD</span>
              </div>
              <span className="text-white font-heading font-bold text-xl">PropertyDeals</span>
            </div>
            <p className="text-white/80 mb-4">Discover and manage off-market real estate deals with confidence.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#E59F9F] transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-[#E59F9F] transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-[#E59F9F] transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-[#E59F9F] transition duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/80 hover:text-white transition duration-300">Home</Link></li>
              <li><Link href="/properties" className="text-white/80 hover:text-white transition duration-300">Properties</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white transition duration-300">About Us</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition duration-300">Contact</Link></li>
              <li><Link href="/signin" className="text-white/80 hover:text-white transition duration-300">Sign In</Link></li>
              <li><Link href="/register" className="text-white/80 hover:text-white transition duration-300">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/80 hover:text-white transition duration-300">FAQ</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition duration-300">Seller Guidelines</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition duration-300">Buyer Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">Subscribe to get the latest off-market properties delivered to your inbox.</p>
            <form className="flex mb-4" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none text-gray-800"
              />
              <Button type="submit" className="bg-[#803344] hover:bg-[#E59F9F] text-white rounded-l-none">
                <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
            <p className="text-white/60 text-sm">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">© 2023 PropertyDeals. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-white/60 hover:text-white text-sm transition duration-300">Terms</Link>
            <Link href="#" className="text-white/60 hover:text-white text-sm transition duration-300">Privacy</Link>
            <Link href="#" className="text-white/60 hover:text-white text-sm transition duration-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
