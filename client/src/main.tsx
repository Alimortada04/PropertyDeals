import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Google Fonts
const loadFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@600&family=Lato:wght@400;500&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  
  // Add Font Awesome for icons
  const fontAwesome = document.createElement("link");
  fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
  fontAwesome.rel = "stylesheet";
  document.head.appendChild(fontAwesome);
  
  // Set title
  document.title = "PropertyDeals | Off-Market Real Estate Platform";
};

// Load fonts before rendering the app
loadFonts();

createRoot(document.getElementById("root")!).render(<App />);
