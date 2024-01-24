import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { PersonIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import EditorSidebarUserIcon from "./EditorSidebarUsericon";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditorSidebarRow from "./EditorSidebarRow";
import { Separator } from "@/components/ui/separator";

type EditorSidebarProps = {
  connectedUsers: sockets.ConnectUserType[];
  codeboxName?: string;
  handleSize: (num: number) => void;
};

const EditorSidebar = ({
  connectedUsers,
  handleSize,
  codeboxName,
}: EditorSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // console.log("ccc = ", connectedUsers);
  return (
    <div
      className={cn(
        "flex flex-col p-2 items-start w-full h-full dark:bg-[#1e1e1e] border-r-2 border-slate-200 dark:border-slate-500 border-solid overflow-hidden"
      )}
    >
      <EditorSidebarRow
        isOpen={isOpen}
        leftIcon={
          <HamburgerMenuIcon
            width={25}
            height={25}
            className={cn(
              "cursor-pointer col-[1_/_span_1]",
              !isOpen && "col-span-4"
            )}
            onClick={() => {
              handleSize(20);
              setIsOpen((prev) => !prev);
            }}
          />
        }
        rightComponent={
          <p className="text-md col-[2_/_span_3] capitalize justify-self-start">
            {codeboxName}
          </p>
        }
      />
      <EditorSidebarRow
        isOpen={isOpen}
        leftIcon={
          <PersonIcon
            width={25}
            height={25}
            className={cn("col-[1_/_span_1]", !isOpen && "col-span-4")}
          />
        }
        rightComponent={
          <p className="text-xs col-[2_/_span_3] capitalize justify-self-start justify-center">
            Connected Users
          </p>
        }
      />
      <ScrollArea className="h-[85vh] w-full">
        {connectedUsers.map(({ name, color }, idx) => (
          <EditorSidebarRow
            key={idx}
            isOpen={isOpen}
            leftIcon={
              <EditorSidebarUserIcon
                name={name}
                color={color}
                isOpen={isOpen}
                className={cn("col-[1_/_span_1]", !isOpen && "col-span-4")}
              />
            }
            rightComponent={
              <p className="text-sm col-[2_/_span_3] justify-self-start">
                {name}
              </p>
            }
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default EditorSidebar;
