import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src="/logos/CodeCollab-logos_black.png"
        alt="CodeCollab"
        width="200"
        height="100"
        className="mr-4 block dark:hidden"
      />
      <Image
        src="/logos/CodeCollab-logos_white.png"
        alt="CodeCollab"
        width="200"
        height="100"
        className="mr-4 hidden dark:block"
      />
    </>
  );
};

export default Logo;