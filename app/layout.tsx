import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeCollab",
  description:
    "CodeCollab Hub is a collaborative coding platform where users can create virtual rooms, code together in real-time using an integrated IDE, and brainstorm ideas on a shared blackboard. It's the ultimate space for seamless teamwork, fostering innovation through joint coding sessions and interactive idea exchange.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
