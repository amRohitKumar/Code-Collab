import type { Metadata } from "next";
import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToasterContext";
import NextTopLoader from "nextjs-toploader";
import { ModalProvider } from "@/providers/modalProviders";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";

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
      <body>
        <AuthContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="code-collab"
          >
            <ToasterContext />
            <NextTopLoader showSpinner={false} crawl={false} />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}
