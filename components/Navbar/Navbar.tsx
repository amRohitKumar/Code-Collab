"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import NavBarAvatar from "./NavbarAvatar";
import ModifiedLink from "../ModifiedLink";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalState";

const Navbar = () => {
  const currPath = usePathname();
  const { onOpen } = useModal();

  return (
    <nav className="flex px-4 py-0 bg-slate-200 sticky top-0 justify-between h-[60px]">
      {/* LEFT SIDE OPTIONS */}
      <div className="flex items-center gap-2">
        <Image
          src="/logos/CodeCollab-logos_black.png"
          alt="CodeCollab"
          width="200"
          height="100"
          className="mr-4"
        />
        <ModifiedLink href="/" currPath={currPath}>
          Home
        </ModifiedLink>
        <ModifiedLink href="/dashboard" currPath={currPath}>
          Dashboard
        </ModifiedLink>
      </div>
      {/* RIGHT SIDE OPTIONS */}
      <div className="flex items-center gap-4">
        <Button onClick={() => onOpen("createCodeBox")}>Create</Button>
        <Button onClick={() => onOpen("joinCodeBox")}>Join</Button>
        <NavBarAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
