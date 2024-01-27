"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex justify-between items-center w-full z-10 sticky top-0 py-4 px-8 backdrop-blur-md">
      <Link href="/" className="flex gap-2 flex-center">
        <Logo />
      </Link>
      <div className="flex relative">
        {mounted &&
          (theme === "dark" ? (
            <div
              className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer px-2"
              onClick={() => setTheme("light")}
            >
              {mounted && <SunIcon />}
              Light
            </div>
          ) : (
            <div
              className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer px-2"
              onClick={() => setTheme("dark")}
            >
              {mounted && <MoonIcon />}
              Dark
            </div>
          ))}
        {status === "authenticated" ? (
          <>
            <Link
              href="/dashboard"
              className="flex flex-col items-center mr-4 dark:hover:text-slate-300 hover:text-orange-600"
            >
              {mounted && <HomeIcon />}
              Dashboard
            </Link>
            <div
              className="flex flex-col items-center dark:hover:text-slate-300 hover:text-orange-600 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {mounted && <ExitIcon />}
              Sign Out
            </div>
            {/* USER ICON  */}
          </>
        ) : (
          <Link
            href="/auth"
            className="flex flex-col items-center mr-4 hover:text-slate-300"
          >
            {mounted && <EnterIcon />}
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
