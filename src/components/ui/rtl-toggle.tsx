"use client"

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useState, useEffect } from "react";

export function RTLToggle() {
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check initial document direction
    if (typeof window !== 'undefined') {
      const direction = document.documentElement.dir;
      setIsRTL(direction === 'rtl');
      
      // Load saved direction preference
      const savedDirection = localStorage.getItem('direction');
      if (savedDirection) {
        document.documentElement.dir = savedDirection;
        setIsRTL(savedDirection === 'rtl');
      }
    }
  }, []);

  const toggleRTL = () => {
    if (!mounted) return;
    
    const newDirection = isRTL ? 'ltr' : 'rtl';
    document.documentElement.dir = newDirection;
    setIsRTL(!isRTL);
    
    // Store preference in localStorage
    localStorage.setItem('direction', newDirection);
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled
      >
        <Languages className="h-4 w-4" />
        RTL
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleRTL}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {isRTL ? "LTR" : "RTL"}
    </Button>
  );
}