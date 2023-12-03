type FormErrorMessageProps = {
  message?: string;
};

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
}) => {
  return <p className="text-red-400 text-xs">{message || "Error"}</p>;
};
