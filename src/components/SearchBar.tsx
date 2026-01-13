import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, TestTube, Stethoscope, HeartPulse, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  onSearch: (query: string, category?: string) => void;
  maxWidth?: string;
  placeholder?: string;
  context?: "doctor" | "lab" | "general";
  animated?: boolean;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  maxWidth = "max-w-xl", 
  placeholder,
  context = "general",
  animated = true,
  className = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"tests" | "doctors">("tests");
  const [isFocused, setIsFocused] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    { label: "Full Body Checkup", type: "test" },
    { label: "Vitamin D", type: "test" },
    { label: "Cardiologist", type: "doctor" },
    { label: "Thyroid Profile", type: "test" },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), category);
    }
  };

  const handlePopularClick = (term: string, type: string) => {
    setQuery(term);
    setCategory(type === "doctor" ? "doctors" : "tests");
    onSearch(term, type === "doctor" ? "doctors" : "tests");
  };

  const searchBarContent = (
    <div className={`relative w-full ${maxWidth} mx-auto z-50 ${className}`}>
      <form onSubmit={handleSubmit} className={`relative flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 scale-[1.01]' : 'hover:scale-[1.01]'}`}>
        
        {/* Category Selector */}
        <div className="relative border-r border-gray-200 dark:border-gray-700 h-8 flex items-center">
            <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent gap-1 rounded-l-2xl">
                  {category === "tests" ? <TestTube className="h-4 w-4 text-primary" /> : <Stethoscope className="h-4 w-4 text-primary" />}
                  <span className="hidden sm:inline font-medium text-xs uppercase tracking-wide">{category === "tests" ? "Tests" : "Doctors"}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[140px] p-1" align="start">
                <div 
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-primary/10 transition-colors ${category === "tests" ? 'bg-primary/5 text-primary font-medium' : ''}`}
                  onClick={() => {
                    setCategory("tests");
                    setIsCategoryOpen(false);
                  }}
                >
                  <TestTube className="h-4 w-4" />
                  <span className="text-sm">Lab Tests</span>
                </div>
                <div 
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-primary/10 transition-colors ${category === "doctors" ? 'bg-primary/5 text-primary font-medium' : ''}`}
                  onClick={() => {
                    setCategory("doctors");
                    setIsCategoryOpen(false);
                  }}
                >
                  <Stethoscope className="h-4 w-4" />
                  <span className="text-sm">Doctors</span>
                </div>
              </PopoverContent>
            </Popover>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative">
           <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder || (category === "tests" ? "Search for tests, packages..." : "Search for doctors, specialties...")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="bg-transparent border-0 focus-visible:ring-0 h-14 pl-4 pr-10 text-base placeholder:text-muted-foreground/50 w-full"
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <div className="pr-1.5 pl-1">
          <Button 
            type="submit" 
            size="icon"
            className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/25 transition-all active:scale-95"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Suggestion Dropdown */}
      <AnimatePresence>
        {isFocused && !query && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden p-3"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 h-auto text-sm font-medium border-transparent hover:border-primary/20 border"
                  onClick={() => handlePopularClick(item.label, item.type)}
                >
                  {item.type === "test" ? <TestTube className="h-3 w-3 mr-1.5 opacity-70" /> : <Stethoscope className="h-3 w-3 mr-1.5 opacity-70" />}
                  {item.label}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
