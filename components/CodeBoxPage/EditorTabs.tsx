import Tab from "@/components/Tab";
import { AiFillExclamationCircle } from "react-icons/ai";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";

type EditorTabProps = {
  codeFiles: Omit<models.ICodeFile, "code">[];
  handleClick: (fileId: string) => void;
  activeFileId: string;
};

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EditorTabs = ({
  codeFiles,
  handleClick,
  activeFileId,
}: EditorTabProps) => {
  return (
    <div className="h-[40px] dark:bg-[#202124] border-b-2 border-slate-200 dark:border-slate-500 border-solid pt-1 flex items-end relative">
      {codeFiles.map((files, idx) => (
        <div key={files.id} className="w-full flex items-end h-full">
          <Tab
            name={files.language}
            handleClick={handleClick}
            fileId={files.id}
            activeFileId={activeFileId}
            className="w-[98%]"
          />
          {idx != codeFiles.length - 1 && (
            <Separator
              orientation="vertical"
              className="w-[1px] rounded-md my-auto h-3/5 bg-slate-600 text-slate-300"
            />
          )}
        </div>
      ))}
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger className="text-slate-200 cursor-pointer h-full mr-2">
            <UpdateIcon height={20} width={20} />
          </TooltipTrigger>
          <TooltipContent className="z-50" side="bottom" align="center">
            <div className="text-center">
              Sync latest code from server
              <div className="flex items-center gap-2">
                <AiFillExclamationCircle className="text-red-600" />
                This might remove some of the recent code
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EditorTabs;
