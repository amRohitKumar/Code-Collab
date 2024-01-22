import Link from "next/link";
import { Button } from "./ui/button";

type ModifiedLinkTypes = {
  children: React.ReactNode;
  href: string;
  currPath?: string;
} & React.HTMLAttributes<HTMLAnchorElement>;
// font-semibold text-gray-800 hover:bg-slate-300 focus:bg-slate-300 px-2 py-1 rounded-md transition ease-in-out duration-300
const ModifiedLink: React.FC<ModifiedLinkTypes> = ({
  children,
  href,
  currPath,
  ...otherProps
}) => {
  if (currPath === href) return null;
  return (
    <Link href={href} {...otherProps} className="">
      <Button size="sm" variant="outline">{children}</Button>
    </Link>
  );
};

export default ModifiedLink;
