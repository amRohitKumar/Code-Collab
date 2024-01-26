import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PropsType = {
  name: string;
  color: string;
  isOpen: boolean;
  userId: string;
  className?: string;
};

const EditorSidebarUserIcon = ({
  name,
  color,
  className,
  userId,
}: PropsType) => {
  return (
    <div className={cn("", className)}>
      <Avatar className="h-7 w-7 aspect-square">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/micah/svg?seed=${userId}`}
          className=" object-fill"
        />
        <AvatarFallback className={`bg-[${color}] w-full `}>
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default EditorSidebarUserIcon;
