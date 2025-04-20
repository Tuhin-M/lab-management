
import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  maxWidth?: string;
  placeholder?: string;
  context?: "doctor" | "lab" | "general";
  animated?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  maxWidth = "max-w-xl", 
  placeholder,
  context = "general",
  animated = true
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  // Default placeholders based on context
  const getDefaultPlaceholder = () => {
    switch(context) {
      case "doctor":
        return "Search for doctors, specialties or conditions...";
      case "lab":
        return "Search for blood tests (e.g., CBC, Sugar, Thyroid Profile)";
      default:
        return "Search...";
    }
  };

  const finalPlaceholder = placeholder || getDefaultPlaceholder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const searchBarContent = (
    <form onSubmit={handleSubmit} className={`relative w-full ${maxWidth} mx-auto`}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder={finalPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-24 h-12 rounded-lg text-base border-primary/20 focus-visible:ring-primary transition-all duration-300"
        />
        <Button 
          type="submit" 
          className="absolute right-0 h-12 rounded-l-none bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </form>
  );

  if (!animated) {
    return searchBarContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {searchBarContent}
    </motion.div>
  );
};

export default SearchBar;
