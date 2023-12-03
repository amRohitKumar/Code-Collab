import Image from "next/image";
import HeroSvg from "@/components/svg/HeroSvg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-10 md:p-20 bg-slate-100 border-1 border-red-300 relative z-0">
      <h1 className="text-7xl font-bold text-shadow">
        Create, Collaborate, Code
      </h1>
      <h3 className="text-2xl font-semibold text-center mt-6">
        Unleash collaboration potential with live coding, brainstorming, and
        visual project planning.
      </h3>
      <HeroSvg />
      <div className="relative w-5/6 md:w-full max-w-4xl mt-6 h-96">
        <Image
          src="/bgimage.png"
          alt="Product"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </main>
  );
}
