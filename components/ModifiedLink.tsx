import Link from "next/link";

type ModifiedLinkTypes = {
  children: React.ReactNode;
  href: string;
  currPath?: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const ModifiedLink: React.FC<ModifiedLinkTypes> = ({
  children,
  href,
  currPath,
  ...otherProps
}) => {
  if (currPath === href) return null;
  return (
    <Link href={href} {...otherProps} className="font-semibold text-gray-800 hover:bg-slate-300 focus:bg-slate-300 px-2 py-1 rounded-md transition ease-in-out duration-300">
      {children}
    </Link>
  );
};

export default ModifiedLink;
