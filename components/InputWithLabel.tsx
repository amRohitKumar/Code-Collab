import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputWithLabelProps = {
  label: string;
  labelFor: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel({
  label,
  labelFor,
  ...otherProps
}: InputWithLabelProps) {
  return (
    <div className="flex justify-center items-center w-full my-2">
      <Label htmlFor={labelFor} className="w-[30%]">
        {label}
      </Label>
      <Input id={labelFor} {...otherProps} className="w-[50%]" />
    </div>
  );
}
