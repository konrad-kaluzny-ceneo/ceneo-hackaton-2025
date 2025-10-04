"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TreePine, Heart, Home, Star } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

interface MoodRatingModalProps {
  trigger: React.ReactNode;
  onSave: (rating: { peacefulness: number; excitement: number; comfort: number; overall: number }) => void;
}

export default function MoodRatingModal({ trigger, onSave }: MoodRatingModalProps) {
  const [ratings, setRatings] = useState({
    peacefulness: 50,
    excitement: 50,
    comfort: 50,
    overall: 50,
  });

  const handleRatingChange = (type: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = () => {
    onSave(ratings);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 ml-8 max-h-[90vh] overflow-y-auto bg-white" align="center" side="bottom" sideOffset={8}>
        <div className="space-y-4">
          <div className="text-lg font-semibold">Oceń samopoczucie</div>
          {/* Spokój */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Spokój</span>
              </div>
              <span className="text-sm text-gray-500">{ratings.peacefulness}%</span>
            </div>
            <input type="range" min="0" max="100" value={ratings.peacefulness} onChange={(e) => handleRatingChange("peacefulness", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          {/* Ekscytacja */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Ekscytacja</span>
              </div>
              <span className="text-sm text-gray-500">{ratings.excitement}%</span>
            </div>
            <input type="range" min="0" max="100" value={ratings.excitement} onChange={(e) => handleRatingChange("excitement", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          {/* Komfort */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Komfort</span>
              </div>
              <span className="text-sm text-gray-500">{ratings.comfort}%</span>
            </div>
            <input type="range" min="0" max="100" value={ratings.comfort} onChange={(e) => handleRatingChange("comfort", parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div className="flex gap-2 pt-3">
            <PopoverClose asChild>
              <Button onClick={handleSave} size="sm" className="flex-1">
                Zapisz
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
