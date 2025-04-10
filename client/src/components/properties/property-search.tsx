import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertySearchProps {
  onSearch: (searchTerm: string) => void;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto mb-8">
      <Input
        type="text"
        placeholder="Search by location, zip code, or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 py-3 px-4 rounded-l-md border border-[#D8D8D8] focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:border-transparent"
      />
      <Button 
        type="submit"
        className="bg-[#09261E] hover:bg-[#135341] text-white py-3 px-6 rounded-r-md transition duration-300"
      >
        <i className="fas fa-search mr-2"></i> Search
      </Button>
    </form>
  );
}
