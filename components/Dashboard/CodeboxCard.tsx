import getDashboardHTML from "@/utils/getDashboardHTML";
import convertUTCToDateMonthYear from "@/utils/getFormatedDate";
import getLanguageImage from "@/utils/getLanguageImage";
import Image from "next/image";
import Link from "next/link";

const CodeboxCard = ({
  children: { name, type, createdAt, updatedAt, files, id },
}: {
  children: models.ICodeBox;
}) => {
  return (
    <Link href={`/${type === "CODE" ? "code" : "web"}/${id}`} prefetch={false}>
      <div
        className="flex justify-center flex-col bg-slate-100/80 hover:bg-slate-200/60 transition-all duration-75 w-[250px] lg:w-[300px] max-w-[300px] rounded-md overflow-hidden hover:cursor-pointer my-5 group dark:bg-primary dark:hover:bg-primary/80"
        // onClick={() =>
        //   router.push(`/${type === "CODE" ? "code" : "web"}/${id}`)
        // }
      >
        {/* TOP IMAGE */}
        <div className="text-xs relative h-[200px] overflow-clip  lg:mx-2 mt-2 rounded-md bg-none group-hover:scale-105 duration-500">
          {type === "CODE" ? (
            <Image
              src={getLanguageImage(files[0].language)}
              alt={files[0].language}
              className="w-[175px] h-[175px] mx-auto my-auto opacity-90"
            />
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
        <div className="px-4 py-2 dark:text-primary-foreground">
          <p className="font-bold text-2xl tracking-wider my-1 capitalize">
            {name}
          </p>
          <div className="text-slate-400 text-md dark:text-white">
            <p className="grid grid-cols-2 lg:grid-cols-[40%,60%] ">
              <span className="font-semibold whitespace-nowrap">
                Updated At :&nbsp;
              </span>
              {convertUTCToDateMonthYear(updatedAt)}
            </p>
            <p className="grid grid-cols-2 lg:grid-cols-[40%,60%]">
              <span className="font-semibold whitespace-nowrap">
                Created At :&nbsp;
              </span>
              {convertUTCToDateMonthYear(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CodeboxCard;
