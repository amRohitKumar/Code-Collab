"use client";

import Link from "next/link";
import {
  HomeIcon,
  ExitIcon,
  EnterIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Logo from "../Logo";

const Nav = () => {
  const { status } = useSession();
  const { theme, setTheme } = useTheme();
  return (
    <nav className="flex justify-between items-center w-full z-10 sticky top-0 py-4 backdrop-blur-sm">
      <Link href="/" className="flex gap-2 flex-center">
        <Logo />
      </Link>
      <div className="flex relative">
        {theme === "dark" ? (
          <div
            className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer px-2"
            onClick={() => setTheme("light")}
          >
            <SunIcon />
            <span>Light </span>
          </div>
        ) : (
          <div
            className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer px-2"
            onClick={() => setTheme("dark")}
          >
            <MoonIcon />
            Dark
          </div>
        )}
        {status === "authenticated" ? (
          <>
            <Link
              href="/dashboard"
              className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600"
            >
              <HomeIcon />
              Dashboard
            </Link>
            <div
              className="flex flex-col items-center dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <ExitIcon />
              Sign Out
            </div>
            {/* USER ICON  */}
          </>
        ) : (
          <Link
            href="/auth"
            className="flex flex-col items-center mr-4 hover:text-slate-300"
          >
            <EnterIcon />
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
