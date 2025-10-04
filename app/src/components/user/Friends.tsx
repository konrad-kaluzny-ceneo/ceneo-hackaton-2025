"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Friends() {
  const friends = require("@/local-data/users.json");

  return (
    <div className="bg-white flex flex-col gap-2 hover:bg-accent rounded-md p-3 border cursor-pointer">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
        {friends.slice(0, 5).map((friend: any) => (
          <Avatar key={friend.id}>
            <AvatarImage src={friend.image} />
            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-medium">Społeczność</p>
        <p className="text-sm text-muted-foreground">120 opinii</p>
      </div>
    </div>
  );
}
