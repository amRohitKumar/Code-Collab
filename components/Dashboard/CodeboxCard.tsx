"use client";

import getDashboardHTML from "@/utils/getDashboardHTML";
import convertUTCToDateMonthYear from "@/utils/getFormatedDate";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CodeboxCard = ({
  children: { name, type, createdAt, updatedAt, files, id },
}: {
  children: models.ICodeBox;
}) => {
  const router = useRouter();
  return (
    <div
      className="flex justify-center flex-col bg-slate-200 w-[250px] lg:w-[300px] max-w-[300px] rounded-md overflow-hidden hover:cursor-pointer my-5"
      onClick={() => router.push(`/${type === "CODE" ? "code" : "web"}/${id}`)}
    >
      {/* TOP IMAGE */}
      <div className="text-xs relative h-[200px] overflow-clip mx-2 mt-2 rounded-md bg-none z-10">
        {type === "CODE" ? (
          // <Image src={getLanguageLogo(files[0].language)} />
          <p>code</p>
        ) : (
          <iframe
            title={name || "Output"}
            sandbox="allow-scripts"
            scrolling="no"
            tabIndex={-1}
            className="w-full h-full pointer-events-none "
            srcDoc={getDashboardHTML(files)}
          />
        )}
      </div>
      <div className="px-2 py-1">
        <p className="font-semibold text-lg tracking-wider my-1">{name}</p>
        <div className="text-slate-400 text-xs">
          <p>
            <span className="font-semibold">Updated At :&nbsp;</span>{" "}
            {convertUTCToDateMonthYear(updatedAt)}
          </p>
          <p>
            <span className="font-semibold">Created At :&nbsp;</span>{" "}
            {convertUTCToDateMonthYear(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeboxCard;
