import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type InputWithLabelProps = {
  label: string;
  labelFor: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputWithLabel = forwardRef(
  (
    { label, labelFor, className, ...otherProps }: InputWithLabelProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div className={cn("grid grid-cols-4 items-center gap-4", className)}>
        <Label htmlFor={labelFor} className="text-right">
          {label}
        </Label>
        <Input id={labelFor} className="col-span-3" {...otherProps} ref={ref} />
      </div>
      // <div className="flex justify-center items-center w-full my-2">
      //   <Label htmlFor={labelFor} className="w-[30%]">
      //     {label}
      //   </Label>
      //   <Input id={labelFor} {...otherProps} className="w-[50%]" />
      // </div>
    );
  }
);
