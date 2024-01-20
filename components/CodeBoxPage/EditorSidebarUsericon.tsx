import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PropsType = {
  name: string;
  color: string;
  isOpen: boolean;
  className?: string;
};

const EditorSidebarUserIcon = ({
  name,
  color,
  isOpen,
  className,
}: PropsType) => {
  return (
    <div
      className={cn(
        "flex shrink-0 w-full gap-3 items-center py-1 px-1 overflow-clip",
        className
      )}
    >
      <Avatar className="h-8 w-8 aspect-square">
        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
        <AvatarFallback className={`bg-[${color}] w-full `}>
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isOpen && (
        <div>
          <p className="text-slate-200 w-full text-xs">{name}</p>
        </div>
      )}
    </div>
  );
};

export default EditorSidebarUserIcon;
