import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type AvatarProps = {
  userId?: string;
  userName?: string;
};

const NavBarAvatar = ({ userId, userName }: AvatarProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="select-none">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/micah/svg?seed=${userId}`}
          className="w-10 rounded-full"
        />
        <AvatarFallback>
          {userName?.charAt(0).toUpperCase() || "Hi"}
        </AvatarFallback>
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
