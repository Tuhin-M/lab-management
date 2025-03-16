
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for blood tests (e.g., CBC, Glucose, Lipid Panel)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-20 h-12 rounded-lg text-base"
        />
        <Button 
          type="submit" 
          className="absolute right-0 h-12 rounded-l-none"
          variant="default"
        >
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
