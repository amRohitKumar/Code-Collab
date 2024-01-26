import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex h-full p-10 gap-10 flex-col">
      <Skeleton className="w-1/6 h-12 rounded-lg" />
      <div className="w-full grid grid-cols-4 gap-10">
        <Skeleton className="flex flex-col gap-4 p-4 w-72 h-80 justify-self-start items-start">
          <Skeleton className="w-full h-[70%]" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-4/5 h-6" />
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 p-4 w-72 h-80 justify-self-start items-start">
          <Skeleton className="w-full h-[70%]" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-4/5 h-6" />
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 p-4 w-72 h-80 justify-self-start items-start">
          <Skeleton className="w-full h-[70%]" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-4/5 h-6" />
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 p-4 w-72 h-80 justify-self-start items-start">
          <Skeleton className="w-full h-[70%]" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-4/5 h-6" />
        </Skeleton>
      </div>
    </div>
  );
}
