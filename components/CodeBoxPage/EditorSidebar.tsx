import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  PersonIcon,
  HamburgerMenuIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import EditorSidebarUserIcon from "./EditorSidebarUsericon";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditorSidebarRow from "./EditorSidebarRow";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalState";

type EditorSidebarProps = {
  connectedUsers: sockets.ConnectUserType[];
  codeBox: models.ICodeBox | null;
  handleSize: (num: number) => void;
};

const EditorSidebar = ({
  connectedUsers,
  handleSize,
  codeBox,
}: EditorSidebarProps) => {
  const { onOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  // console.log("ccc = ", connectedUsers);
  return (
    <div
      className={cn(
        "flex flex-col py-2 items-start w-full h-full border-r-2 border-slate-200 dark:border-slate-500 border-solid overflow-hidden code-editor-height",
        isOpen && "px-2"
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
              handleSize(18);
              setIsOpen((prev) => !prev);
            }}
          />
        }
        rightComponent={
          <p className="text-md col-[2_/_span_3] capitalize justify-self-start">
            {codeBox?.name}
          </p>
        }
      />
      <EditorSidebarRow
        isOpen={isOpen}
        leftIcon={
          <Share1Icon
            width={25}
            height={25}
            className={cn(
              "cursor-pointer col-[1_/_span_1]",
              !isOpen && "col-span-4"
            )}
          />
        }
        rightComponent={
          <p className="text-md col-[2_/_span_3] capitalize justify-self-start">
            Share Codebox
          </p>
        }
        onClick={() => {
          // console.log("share clicked");
          onOpen("shareCodeBox", {
            roomId: codeBox?.roomId,
            password: codeBox?.password,
          });
        }}
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
        {connectedUsers.map(({ name, color, userId }, idx) => (
          <EditorSidebarRow
            key={idx}
            isOpen={isOpen}
            leftIcon={
              <EditorSidebarUserIcon
                name={name}
                color={color}
                isOpen={isOpen}
                userId={userId}
                className={cn(`col-[1_/_span_1] border-2 border-[${color}] rounded-full p-1`, !isOpen && "col-span-4")}
              />
            }
            rightComponent={
              <p className={`text-sm col-[2_/_span_3] justify-self-start text-[${color}]`}>
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
