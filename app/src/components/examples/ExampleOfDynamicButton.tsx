"use client";

import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface ExampleOfDynamicButtonProps {
  label: string;
}

function ExampleOfDynamicButton({ label }: ExampleOfDynamicButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Button clicked");
    }, 1000);
  };

  return (
    <Button variant="default" className="w-48" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        label
      )}
    </Button>
  );
}

export default ExampleOfDynamicButton;
