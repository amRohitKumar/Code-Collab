import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const NavBarAvatar = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="select-none">
        <AvatarImage
          src="https://github.com/shadcn.png"
          className="w-10 rounded-full"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 mr-5">
      <DropdownMenuLabel>Profile</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Log Out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default NavBarAvatar;