import Image from "next/image";
import HeroSvg from "@/components/svg/HeroSvg";
import Nav from "@/components/Home/Nav";
import FeatureBox from "@/components/Home/Feature";
import "@/utils/HomeObserver";

export default function Home() {
  return (
    <main className="main flex min-h-screen flex-col items-center justify-start px-10 sm:px-20 md:mt-2 relative z-0">
      <Nav />
      <div className="gradient" />
      <h1 id="home-heading" className="mt-2 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl text-center">
        Real Time
        <br className="" />
        <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent text-center">Collaboration & Code</span>
      </h1>
      <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-2xl text-center">
      CodeCollab is a collaborative coding platform where users can create virtual rooms, code together in real-time using an integrated IDE. 
      </p>
      {/* <HeroSvg /> */}
      <div className="relative w-9/12 mb-16 md:mb-32 md:w-full max-w-4xl mt-6 h-96 shadow-2xl shadow-slate-800">
        <Image
          src="/code_ide.png"
          alt="Code"
          layout="fill"
          objectFit="cover"
          objectPosition="left"
        />
      </div>
      <FeatureBox  />
      <FeatureBox className="md:flex-row-reverse" />
      <FeatureBox />
    </main>
  );
}
