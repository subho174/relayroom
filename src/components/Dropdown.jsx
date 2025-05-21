import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutButton } from "./Button";

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="fixed top-3 right-4 z-50 text-white shadow-xs shadow-white">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20 bg-black border-0 mr-2 mt-2 p-0">
        {/* <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem className="hover:bg-black"> */}
        <LogOutButton />
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
