import Nav from "@/components/Home/Nav";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full">
      <Nav />
      <div className="gradient" />
      <div className="hidden dark:block absolute w-full h-full -z-10">
        <Image
          src="/space3.png"
          alt="Decoration"
          layout="fill"
          objectFit="cover"
          className="opacity-10"
        />
      </div>
      {children}
    </div>
  );
}
