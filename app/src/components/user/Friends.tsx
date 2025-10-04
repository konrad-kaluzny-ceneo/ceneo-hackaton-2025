"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { HeartIcon, StarIcon, TrendingUpIcon, UsersIcon, SparklesIcon, UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function Friends() {
  const friends = require("@/local-data/users.json");
  const [isVisible, setIsVisible] = useState(false);
  const [likes, setLikes] = useState(1247);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-primary">Kupili również tą podróż</h3>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {friends.slice(0, 6).map((friend: any, index: number) => (
            <div key={friend.id} className="relative">
              <Avatar className="w-10 h-10 border-2 border-white shadow-lg transition-transform duration-300">
                <AvatarImage src={friend.image} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                  {friend.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full border-2 border-white flex items-center justify-center text-primary font-bold text-sm">
            +{friends.length - 6}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold text-primary">4.9</span>
          </div>
          <p className="text-xs text-gray-600">Ocena</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UsersIcon className="w-4 h-4 text-primary" />
            <span className="text-2xl font-bold text-primary">2.3k</span>
          </div>
          <p className="text-xs text-gray-600">Podróżników</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-3">
        <p className="text-xs text-gray-600">
          <span className="font-bold text-primary">12 osób</span> właśnie przegląda tę podróż!
        </p>
      </div>
    </div>
  );
}
