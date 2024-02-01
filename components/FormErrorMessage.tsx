import { cn } from "@/lib/utils";

type FormErrorMessageProps = {
  message?: string;
  className?: string;
};

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  className,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 mb-2">
      <p className={cn("text-red-400 text-xs col-[2_/_span_3]", className)}>
        {message || "Error"}
      </p>
    </div>
  );
};
