import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex editor-resizable-panel p-4 gap-4">
      <div className="flex w-[50%] h-full rounded-lg gap-4">
        <div className="flex h-full w-[10%] gap-4 flex-col" >
          <Skeleton className="w-full aspect-square rounded-md" />
          <Skeleton className="w-full aspect-square rounded-full" />
          <Skeleton className="w-full aspect-square rounded-full" />
          <Skeleton className="w-full aspect-square rounded-full" />
          <Skeleton className="w-full aspect-square rounded-full" />
          <Skeleton className="w-full aspect-square rounded-full" />
          <Skeleton className="w-full aspect-square rounded-full" />
        </div>
        <div className="flex flex-col w-full gap-4">
          <Skeleton className="w-full h-[10%]" />
          <Skeleton className="w-full h-[90%]" />
        </div>
      </div>
      <Skeleton className="w-[50%] h-full rounded-lg" />
    </div>
  );
}
