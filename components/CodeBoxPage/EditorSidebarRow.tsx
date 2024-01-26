import { cn } from "@/lib/utils";

type Props = {
  isOpen?: boolean;
  leftIcon: React.ReactNode;
  rightComponent?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const EditorSidebarRow = ({
  isOpen,
  leftIcon,
  rightComponent,
  className,
  ...otherProps
}: Props) => {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-4 gap-4 justify-items-center mb-4 items-center px-2",
        isOpen && className
      )}
      {...otherProps}
    >
      {leftIcon}
      {isOpen && rightComponent}
    </div>
  );
};

export default EditorSidebarRow;
