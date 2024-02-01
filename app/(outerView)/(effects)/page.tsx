// "use client";

import Image from "next/image";
import FeatureBox from "@/components/Home/Feature";
import "@/utils/HomeObserver";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SiNextdotjs, SiPrisma, SiPostgresql } from "react-icons/si";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const data = [
  {
    title: "Real-Time Collaboration",
    description:
      "Code together seamlessly in real-time, breaking down geographical barriers. Experience instant updates as you collaborate, fostering efficient teamwork and dynamic project development.",
    url: "/home-page/real-time.png",
  },
  {
    title: "Multi-Language Support",
    description:
      "Unleash your creativity by coding in your preferred language. Our platform supports a diverse range of programming languages, empowering you to work on a variety of projects with ease and flexibility.",
    url: "/home-page/multi-language.png",
  },
  {
    title: "Live Output Preview",
    description:
      "See your code come to life instantly with our live output preview. Debug efficiently and test changes on the fly, creating an interactive coding experience that accelerates project development.",
    url: "/home-page/live-output.png",
  },
  {
    title: "Create and Join Rooms",
    description:
      "Establish dedicated coding spaces with personalized rooms. Invite collaborators or join existing rooms to focus on specific tasks. Enhance communication and organization, making teamwork a breeze on our collaborative code platform.",
    url: "/home-page/join-rooms.png",
  },
];

export default function Home() {
  return (
    <main className="main flex min-h-screen flex-col items-center justify-start relative z-0 overflow-x-clip">
      <h1
        id="home-heading"
        className="mt-2 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl text-center dark:text-white"
      >
        Real Time
        <br className="" />
        <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent text-center">
          Collaboration & Code
        </span>
      </h1>
      <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-2xl text-center dark:text-violet-200">
        CodeCollab is a collaborative coding platform where users can create
        virtual rooms, code together in real-time using an integrated IDE.
      </p>
      {/* <HeroSvg /> */}
      <div className="relative w-9/12 mb-16 md:mb-32 md:w-full max-w-4xl mt-6 h-96 shadow-2xl shadow-slate-800 dark:shadow-none">
        <Image
          src="/code_ide.png"
          alt="Code"
          layout="fill"
          objectFit="cover"
          objectPosition="left"
        />
      </div>
      {data.map(({ title, description, url }, idx) => (
        <FeatureBox
          key={idx}
          title={title}
          url={url}
          description={description}
          className={cn(idx % 2 && "md:flex-row-reverse")}
        />
      ))}
      <div className="my-4 text-8xl font-extrabold bg-fuchsia-900 dark:bg-transparent text-white overflow-hidden whitespace-nowrap py-12">
        <h4 className={clsx("text-slate-300 mb-10 z-50 text-center text-3xl")}>
          Tech Stack :
        </h4>
        <div className="w-full mb-16 overflow-hidden contribute-first-row">
          <div className="inline-block whitespace-nowrap overflow-hidden">
            <span>. GITHUB </span>
            <span>
              {<GitHubLogoIcon width={100} height={100} className="mx-8" />}
            </span>
            <span>. NEXT JS </span>
            <span>
              {<SiNextdotjs width={100} height={100} className="mx-8" />}
            </span>
            <span>. PRISMA </span>
            <span>
              {<SiPrisma width={100} height={100} className="mx-8" />}
            </span>
            <span>. PostgreSQL </span>
            <span>
              {<SiPostgresql width={100} height={100} className="mx-8" />}
            </span>
          </div>
          <div className="inline-block whitespace-nowrap overflow-hidden">
            <span>. GITHUB </span>
            <span>
              {<GitHubLogoIcon width={100} height={100} className="mx-8" />}
            </span>
            <span>. NEXT JS </span>
            <span>
              {<SiNextdotjs width={100} height={100} className="mx-8" />}
            </span>
            <span>. PRISMA </span>
            <span>
              {<SiPrisma width={100} height={100} className="mx-8" />}
            </span>
            <span>. PostgreSQL </span>
            <span>
              {<SiPostgresql width={100} height={100} className="mx-8" />}
            </span>
          </div>
        </div>
        <a
          href="https://github.com/amRohitKumar/Code-Collab"
          target="_blank"
          className="flex flex-nowrap justify-center my-4 relative z-50"
        >
          <span>CONTRIBUTE ON</span>
          <span>
            {<GitHubLogoIcon width={100} height={100} className="mx-8" />}
          </span>
        </a>
        <div className="w-full mt-16 overflow-hidden contribute-last-row">
          <div className="inline-block whitespace-nowrap overflow-hidden">
            <span> PostgreSQL </span>
            <span>
              {<SiPostgresql width={100} height={100} className="mx-8" />}
            </span>
            <span>. PRISMA </span>
            <span>
              {<SiPrisma width={100} height={100} className="mx-8" />}
            </span>
            <span>. NEXT JS </span>
            <span>
              {<SiNextdotjs width={100} height={100} className="mx-8" />}
            </span>
            <span> GITHUB </span>
            <span>
              {<GitHubLogoIcon width={100} height={100} className="mx-8" />}
            </span>
          </div>
          <div className="inline-block whitespace-nowrap overflow-hidden">
            <span>. PostgreSQL </span>
            <span>
              {<SiPostgresql width={100} height={100} className="mx-8" />}
            </span>
            <span>. PRISMA </span>
            <span>
              {<SiPrisma width={100} height={100} className="mx-8" />}
            </span>
            <span>. NEXT JS </span>
            <span>
              {<SiNextdotjs width={100} height={100} className="mx-8" />}
            </span>
            <span>. GITHUB </span>
            <span>
              {<GitHubLogoIcon width={100} height={100} className="mx-8" />}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
