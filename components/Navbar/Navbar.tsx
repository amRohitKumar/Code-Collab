"use client";

import { usePathname } from "next/navigation";
import NavBarAvatar from "./NavbarAvatar";
import ModifiedLink from "../ModifiedLink";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalState";
import { ModeToggle } from "../DarkModeToggle";
import Logo from "../Logo";

const Navbar = () => {
  const currPath = usePathname();
  const { onOpen } = useModal();

  return (
    <nav className="flex px-4 py-0 bg-secondary/90 sticky top-0 justify-between h-[60px] backdrop-blur-sm z-10 border-b-[1px] border-slate-500 shadow-sm">
      {/* LEFT SIDE OPTIONS */}
      <div className="flex items-center gap-2">
        <Logo />
        <ModifiedLink href="/" currPath={currPath}>
          Home
        </ModifiedLink>
        <ModifiedLink href="/dashboard" currPath={currPath}>
          Dashboard
        </ModifiedLink>
      </div>
      {/* RIGHT SIDE OPTIONS */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button onClick={() => onOpen("createCodeBox")}>Create</Button>
        <Button onClick={() => onOpen("joinCodeBox")}>Join</Button>
        <NavBarAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
