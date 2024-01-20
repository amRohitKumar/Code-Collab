import { getLanguageColor } from "@/utils/getMonacoLangId";
import { cn } from "@/lib/utils";

type TabProps = {
  name: string;
  handleClick: (fileId: string) => void;
  fileId: string;
  activeFileId: string;
  className?: string;
};

// text-[#fff]/80 text-[#E34F26]/80 text-[#264DE4]/80 text-[#F7DF1E]/80 text-[#555555]/80 text-[#00599C]/80 text-[#FFD43B]/80 text-[#FF0000]/80 text-[#CC342D]/80

const Tab = ({
  name,
  handleClick,
  fileId,
  activeFileId,
  className,
}: TabProps) => {
  return (
    <div
      className={cn("h-[90%] min-w-[100px] relative", className)}
      onClick={() => handleClick(name)}
    >
      <div
        className={cn(
          "absolute h-1/2 w-full bottom-0 bg-[#202124]",
          fileId === activeFileId && "bg-[#323639]"
        )}
      />
      <div className="w-full h-full flex">
        <div className="w-[5%] rounded-br-lg z-10 bg-[#202124]" />
        <div
          className={cn(
            `text-[${getLanguageColor(
              name
            )}]/80 px-4 font-bold tracking-widest border-0 rounded-md bg-[#202124] z-10 cursor-pointer hover:bg-[#323639] py-0.5 flex items-center text-sm w-full`,
            fileId === activeFileId && "bg-[#323639]"
          )}
        >
          {name}
        </div>
        <div className="w-[5%] rounded-bl-lg z-10 bg-[#202124]" />
      </div>
    </div>
  );
};

export default Tab;
