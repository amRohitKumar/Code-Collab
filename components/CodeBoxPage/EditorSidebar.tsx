import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import EditorSidebarUserIcon from "./EditorSidebarUsericon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type EditorSidebarProps = {
  connectedUsers: sockets.ConnectUserType[];
  handleSize: (num: number) => void;
};

const EditorSidebar = ({ connectedUsers, handleSize }: EditorSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // console.log("ccc = ", connectedUsers);
  return (
    <div
      className={cn(
        "flex flex-col p-2 items-start w-full h-full bg-[#1e1e1e] border-r-2 border-slate-500 border-solid overflow-hidden"
      )}
    >
      <div
        onClick={() => {
          handleSize(20);
          setIsOpen((prev) => !prev);
        }}
      >
        <AiOutlineMenu
          size="1.5em"
          className="ml-2 text-slate-300 font-bold cursor-pointer"
        />
      </div>
      <div className="w-full flex gap-4 text-slate-300 justify-center items-center mt-4">
        <PersonIcon width={25} height={25} />
        {isOpen && <p className="text-xs">Connected Users</p>}
      </div>
      <ScrollArea className="h-[85vh] py-3 w-full">
        {connectedUsers.map(({ name, color }, idx) => (
          <div className="gap-1 flex justify-center flex-col items-center my-2">
            <EditorSidebarUserIcon name={name} color={color} isOpen={isOpen} />
            {idx != connectedUsers.length - 1 && (
              <Separator
                decorative
                orientation="horizontal"
                className="w-[90%] bg-slate-600"
              />
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default EditorSidebar;
