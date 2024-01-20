type FormErrorMessageProps = {
  message?: string;
};

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 mb-2">
      <p className="text-red-400 text-xs col-[2_/_span_3]">{message || "Error"}</p>
    </div>
  );
};
