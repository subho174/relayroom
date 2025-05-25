'use client'

import { RefreshCcw } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function RefreshCard() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RefreshCcw className="cursor-pointer" onClick={() => window.location.reload()}/>
      </HoverCardTrigger>
      <HoverCardContent className="w-50 px-4 py-2">
        <h4 className="text-sm font-semibold">Click to update chat view</h4>
      </HoverCardContent>
    </HoverCard>
  );
}
