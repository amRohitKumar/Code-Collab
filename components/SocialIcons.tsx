import { AiFillGithub } from "react-icons/ai";
import { AiFillGoogleCircle } from "react-icons/ai";
import AuthSocialButton from "./AuthSocialButton";

type SocialIconsProps = {
  handleSocialLogin: (provider: string) => void;
};

export const AuthSocialGroup: React.FC<SocialIconsProps> = ({
  handleSocialLogin,
}) => {
  return (
    <div className="flex w-full justify-center items-center gap-10 mt-4">
      <AuthSocialButton
        Icon={AiFillGithub}
        color="#2b3137"
        onClick={() => handleSocialLogin("github")}
      />
      <AuthSocialButton
        Icon={AiFillGoogleCircle}
        color="#ea4335"
        onClick={() => handleSocialLogin("google")}
      />
    </div>
  );
};
