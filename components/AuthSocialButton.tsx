import { IconType } from "react-icons";

type AuthSocialButtonProps = {
  color?: string;
  Icon: IconType;
  onClick: () => void;
};

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  color,
  Icon,
  onClick,
}) => {
  return (
    <button type="button" onClick={onClick}>
      <Icon size="3em" color={color} />
    </button>
  );
};

export default AuthSocialButton;
