"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

const Nav = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center w-full z-10">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/logos/CodeCollab-logos_black.png"
          alt="CodeCollab"
          width="200"
          height="200"
          className="object-contain aspect-auto"
        />
      </Link>

      <div className="flex relative">
        {status === "authenticated" ? (
          <>
            <Button type="button">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button type="button" onClick={() => signOut({callbackUrl: "/"})}>
            Sign Out
            </Button>
            {/* USER ICON  */}
          </>
        ) : (
          <Link href="/auth">Log In</Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
