
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  maxWidth?: string;
}

const SearchBar = ({ onSearch, maxWidth = "max-w-3xl" }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${maxWidth} mx-auto`}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for blood tests (e.g., CBC, Sugar, Thyroid Profile)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-24 h-12 rounded-lg text-base border-primary/20 focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          className="absolute right-0 h-12 rounded-l-none bg-primary hover:bg-primary/90"
        >
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
