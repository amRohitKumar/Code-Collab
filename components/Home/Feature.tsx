import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  className?: string;
  url: string;
};

const FeatureBox: React.FC<Props> = ({
  title,
  description,
  url,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full lg:w-3/4 p-8 mb-12 h-[500px] md:h-80 gap-4 items-center",
        className
      )}
    >
      <div className="md:w-1/2 h-1/2 md:h-full">
        <h1 className="mt-2 text-4xl font-bold sm:text-4xl text-black dark:text-slate-200">
          {title}
        </h1>
        <p className="mt-3 text-xl text-gray-600 sm:text-lg text-justify tracking-tight dark:text-violet-400">
          {description}
        </p>
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative bottom-2">
        <Image src={url} alt={title} fill={true} className="w-full aspect-square object-contain right-0" />
      </div>
    </div>
  );
};

export default FeatureBox;
