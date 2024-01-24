import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PropsType = {
  name: string;
  color: string;
  isOpen: boolean;
  className?: string;
};

const EditorSidebarUserIcon = ({ name, color, className }: PropsType) => {
  return (
    <div className={cn("", className)}>
      <Avatar className="h-7 w-7 aspect-square">
        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
        <AvatarFallback className={`bg-[${color}] w-full `}>
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default EditorSidebarUserIcon;
