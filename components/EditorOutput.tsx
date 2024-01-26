"use client";

import { useEffect, useState } from "react";
import { languages } from "@/utils/getMonacoLangId";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InputIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { getHackerRankLanguage } from "@/utils/getMonacoLangId";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { AiFillCaretUp } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const HACKEREARTH_URL =
  "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/";

type EditorFooterProps = {
  language: string;
  editorRef: any;
  setLanguage: (lang: string) => void;
  resizeEditorOuput: (size: number) => void;
};

enum request_code {
  "REQUEST_INITIATED" = "REQUEST_INITIATED",
  "REQUEST_QUEUED" = "REQUEST_QUEUED",
  "CODE_COMPILED" = "CODE_COMPILED",
  "REQUEST_COMPLETED" = "REQUEST_COMPLETED",
  "REQUEST_FAILED" = "REQUEST_FAILED",
}

enum status_code {
  "AC" = "AC",
  "MLE" = "MLE",
  "TLE" = "TLE",
  "RE" = "RE",
  "NA" = "NA",
}

type OutputType = {
  compilation_status?: request_code;
  compilation_message?: string;
  compilation_failed?: boolean;
  compilation_error?: string;
  run_status?: status_code;
  run_failed?: boolean;
  run_error?: string;
  output_text?: string;
  loading?: boolean;
  status_update_url?: string;
  request_failed?: boolean;
};

type Tabs = "OUTPUT" | "INPUT";

const EditorOutput: React.FC<EditorFooterProps> = ({
  resizeEditorOuput,
  editorRef,
  language,
}) => {
  const [open, setOpen] = useState(false);
  const [testcase, setTestcase] = useState<string>("");
  const [tab, setTab] = useState<Tabs>("OUTPUT");
  const [output, setOutput] = useState<OutputType>();

  const toggleView = () => {
    resizeEditorOuput(40);
    setOpen((prev) => !prev);
  };
  const handleSubmit = async () => {
    try {
      const resp = await axios.post(
        HACKEREARTH_URL,
        {
          lang: getHackerRankLanguage(language),
          source: editorRef.current?.getValue(),
          input: testcase,
        },
        {
          headers: {
            "client-secret": "f97316fd6f0a736c88993dd23577e56659562fad",
          },
        }
      );
      const { data } = resp;
      console.log("i = data", data);
      setOutput({
        run_status: status_code.NA,
        run_error: "",
        run_failed: false,
        loading: true,
        compilation_status: data.request_status.code,
        compilation_message: data.request_status.message,
        status_update_url: data.status_update_url,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let funcId: any;
    try {
      funcId = setInterval(async () => {
        if (!output?.status_update_url) {
          clearInterval(funcId);
          return;
        }
        const data = (
          await axios.get(output.status_update_url, {
            headers: {
              "client-secret": "f97316fd6f0a736c88993dd23577e56659562fad",
            },
          })
        ).data;
        console.log("data", data);

        if (data.request_status.code === request_code.REQUEST_QUEUED) {
          setOutput((prev) => ({
            ...prev,
            loading: true,
            compilation_status: request_code.REQUEST_QUEUED,
            compilation_message: data.request_status.message,
            compilation_failed: false,
            status_update_url: data.status_update_url,
          }));
        } else if (data.request_status.code === request_code.CODE_COMPILED) {
          if (data.result.compile_status === "OK") {
            setOutput((prev) => ({
              ...prev,
              loading: true,
              compilation_status: request_code.CODE_COMPILED,
              compilation_message: data.request_status.message,
              compilation_failed: false,
              run_status: data.result.run_status.status,
              run_error: data.result.run_status.status_detail,
              run_failed:
                data.result.run_status.status !== "NA" &&
                data.result.run_status.status !== status_code.AC,
              status_update_url: data.status_update_url,
            }));
          } else {
            setOutput((prev) => ({
              ...prev,
              compilation_status: request_code.CODE_COMPILED,
              compilation_message: data.request_status.message,
              compilation_failed: true,
              compilation_error: data.result.compile_status,
              loading: false,
              status_update_url: data.status_update_url,
            }));
            clearInterval(funcId);
            return;
          }
        } else if (data.request_status.code === request_code.REQUEST_FAILED) {
          setOutput((prev) => ({
            ...prev,
            loading: false,
            request_failed: true,
            compilation_message: request_code.REQUEST_FAILED,
          }));
          clearInterval(funcId);
          return;
        } else if (
          data.request_status.code === request_code.REQUEST_COMPLETED
        ) {
          let output_resp: any;
          if (data.result.run_status.status === "AC") {
            output_resp = await axios.get(data.result.run_status.output);
            output_resp = output_resp.data;
            console.log("output_resp", output_resp);
          }

          setOutput({
            compilation_status: request_code.REQUEST_COMPLETED,
            compilation_message: data?.request_status?.message,
            compilation_failed: false,
            output_text: output_resp,
            run_status: data.result.run_status,
            run_failed: data.result.run_status.status !== status_code.AC,
            run_error:
              data.result.run_status.request_NOT_OK_reason ||
              data.result.run_status.stderr,
            loading: false,
            status_update_url: data.status_update_url,
          });
          clearInterval(funcId);
          return;
        }
      }, 2000);
    } catch (error) {
      console.log("err = ", error);
      clearInterval(funcId);
    }

    return () => clearInterval(funcId);
  }, [output?.status_update_url]);

  return (
    <>
      <div className="bg-background w-full h-[2px] overflow-clip relative">
        {output?.loading && (
          <div className="progress-bar w-3/5 h-full bg-green-400 absolute" />
        )}
      </div>
      <div className={cn("w-full h-full px-4 py-2")}>
        <div className="flex justify-between items-center">
          <div className="flex">
            <div className="cursor-pointer" onClick={toggleView}>
              {open ? (
                <ChevronDownIcon width={25} height={25} />
              ) : (
                <ChevronUpIcon width={25} height={25} />
              )}
            </div>

            <div
              className={cn(
                "text-sm flex items-center gap-2 dark:bg-[#1e1e1e] bg-slate-200 ml-4 px-4 py-1 rounded-md cursor-pointer",
                tab === "OUTPUT" && "text-violet-500"
              )}
              onClick={() => setTab("OUTPUT")}
            >
              <GearIcon />
              Output
            </div>
            <div
              className={cn(
                "text-sm flex items-center gap-2 dark:bg-[#1e1e1e] bg-slate-200 ml-4 px-4 py-1 rounded-md cursor-pointer",
                tab === "INPUT" && "text-violet-500"
              )}
              onClick={() => setTab("INPUT")}
            >
              <InputIcon />
              Input
            </div>
          </div>
          <Button
            className="bg-green-400 text-black hover:bg-green-500"
            size="sm"
            onClick={handleSubmit}
          >
            Compile
          </Button>
        </div>
        <div className="w-full h-full mt-2 px-4 py-1">
          <div className="mt-1">
            {tab === "INPUT" ? (
              <>
                <h4 className="text-xl font-bold mb-2">Custom Input: </h4>
                <textarea
                  maxLength={5000}
                  placeholder="Input..."
                  rows={4}
                  className="h-full w-full rounded-md resize-none p-2 focus:outline-none"
                  onChange={(e) => setTestcase(e.target.value)}
                />
              </>
            ) : (
              <>
                <h4 className="text-xl font-bold mb-2">Verdict: </h4>
                {output?.request_failed ? (
                  <h4>
                    <span className="font-semibold text-red-500">
                      Server Error : &nbsp;
                    </span>
                    The request processing failed due to an internal issue.
                    Please try after some time.
                  </h4>
                ) : output?.compilation_failed ? (
                  <h4>
                    <span className="font-semibold text-red-500">
                      Compilation Error : &nbsp;
                    </span>
                    {output?.compilation_error}
                  </h4>
                ) : output?.run_failed ? (
                  <h4>
                    <span className="font-semibold text-red-500">
                      Runtime Error : &nbsp;
                    </span>
                    {output?.run_error}
                  </h4>
                ) : output?.loading ? (
                  <h4>
                    <span className="font-semibold">
                      {" "}
                      Compilation status : &nbsp;
                    </span>
                    {output?.compilation_message}
                  </h4>
                ) : output?.output_text ? (
                  <textarea rows={4} readOnly className="text-md bg-zinc-200 dark:bg-[#1e1e1e] rounded-md px-4 py-2 overflow-y-scroll resize-none w-full focus:outline-none">
                    {output?.output_text || "here is the output"}
                  </textarea>
                ) : (
                  <h4>Compile to see output</h4>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// const EditorOutput: React.FC<EditorFooterProps> = ({
//   language,
//   setLanguage,
//   editorRef,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [testcase, setTestcase] = useState("");
//   const [output, setOutput] = useState<OutputType | {}>({});
//   const handleSubmitCode = async () => {
//     try {
//       setOpen(true);
//       const resp = await axios.post(
//         HACKEREARTH_URL,
//         {
//           lang: language,
//           source: editorRef.current?.getValue(),
//           input: testcase,
//         },
//         {
//           headers: {
//             "client-secret": "f97316fd6f0a736c88993dd23577e56659562fad",
//           },
//         }
//       );
//       const { data } = resp;
//       console.log("i = data", data);
//       setOutput((prev) => ({
//         run_status: "",
//         run_error: "",
//         run_failed: false,
//         loading: true,
//         compilation_status: data.request_status.code,
//         compilation_message: data.request_status.message,
//         status_update_url: data.status_update_url,
//       }));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     let funcId: any;
//     try {
//       funcId = setInterval(async () => {
//         if (!output?.status_update_url) {
//           clearInterval(funcId);
//           return;
//         }
//         const resp = await axios.get(output.status_update_url, {
//           headers: {
//             "client-secret": "f97316fd6f0a736c88993dd23577e56659562fad",
//           },
//         });
//         const { data } = resp;
//         console.log("data", data);

//         if (data.request_status.code === request_code.REQUEST_QUEUED) {
//           setOutput((prev) => ({
//             ...prev,
//             loading: true,
//             compilation_status: request_code.REQUEST_QUEUED,
//             compilation_message: data.request_status.message,
//             compilation_failed: false,
//             status_update_url: data.status_update_url,
//           }));
//         } else if (data.request_status.code === request_code.CODE_COMPILED) {
//           if (data.result.compile_status === "OK") {
//             setOutput((prev) => ({
//               ...prev,
//               loading: true,
//               compilation_status: request_code.CODE_COMPILED,
//               compilation_message: data.request_status.message,
//               compilation_failed: false,
//               run_status: data.result.run_status.status,
//               run_error: data.result.run_status.request_NOT_OK_reason,
//               run_failed: data.result.run_status.status !== status_code.AC,
//               status_update_url: data.status_update_url,
//             }));
//           } else {
//             setOutput((prev) => ({
//               ...prev,
//               compilation_status: request_code.CODE_COMPILED,
//               compilation_message: data.request_status.message,
//               compilation_failed: true,
//               compilation_error: data.result.compile_status,
//               loading: false,
//               status_update_url: data.status_update_url,
//             }));
//             clearInterval(funcId);
//             return;
//           }
//         } else if (data.request_status.code === request_code.REQUEST_FAILED) {
//           setOutput((prev) => ({
//             ...prev,
//             loading: false,
//             request_failed: true,
//             compilation_message: request_code.REQUEST_FAILED,
//           }));
//           clearInterval(funcId);
//           return;
//         } else if (
//           data.request_status.code === request_code.REQUEST_COMPLETED
//         ) {
//           let output_resp: any;
//           if (data.result.run_status.status === "AC") {
//             output_resp = await axios.get(data.result.run_status.output);
//             output_resp = output_resp.data;
//             console.log("output_resp", output_resp);
//           }

//           setOutput({
//             compilation_status: request_code.REQUEST_COMPLETED,
//             compilation_message: data?.request_status?.message,
//             compilation_failed: false,
//             output_text: output_resp,
//             run_status: data.result.run_status,
//             run_failed: data.result.run_status.status !== status_code.AC,
//             run_error:
//               data.result.run_status.request_NOT_OK_reason ||
//               data.result.run_status.stderr,
//             loading: false,
//             status_update_url: data.status_update_url,
//           });
//           clearInterval(funcId);
//           return;
//         }
//       }, 2000);
//     } catch (error) {
//       console.log("err = ", error);
//       clearInterval(funcId);
//     }

//     return () => clearInterval(funcId);
//   }, [output?.status_update_url]);

//   return (
//     <div className=" h-[50px] relative z-10 ">
//       {/* WRAPPER DIV */}
//       <div
//         className={cn(
//           "bg-slate-300 py-2 px-2 w-full absolute -bottom-[300px] flex flex-col items-start ease-linear transition-all duration-150 min-h-[350px] rounded-t-md",
//           open && "bottom-0"
//         )}
//       >
//         <div className="flex justify-between items-center w-full">
//           {/* TOP RIBBON */}
//           <div className="flex justify-center items-center">
//             <button type="button" onClick={() => setOpen((prev) => !prev)}>
//               {open ? (
//                 <AiFillCaretDown size="1.5em" />
//               ) : (
//                 <AiFillCaretUp size="1.5em" />
//               )}
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <Select
//               defaultValue="JAVASCRIPT_NODE"
//               value={language}
//               onValueChange={(e) => setLanguage(e)}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select a language" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Languages</SelectLabel>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.value} value={lang.value}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             <Button
//               className="bg-green-800 text-white"
//               onClick={handleSubmitCode}
//             >
//               Compile
//             </Button>
//           </div>
//         </div>
//         <div className="h-full w-full mt-2 px-4 py-2">
//           <div>
//             <Textarea
//               placeholder="Input"
//               className="bg-slate-100 text-black resize-none"
//               rows={4}
//               value={testcase}
//               onChange={(e) => setTestcase(e.target.value)}
//             />
//           </div>
//           <div className="mt-4">
//             <h4 className="text-xl font-bold mb-2">Verdict: </h4>
//             {output?.request_failed ? (
//               <h4 className="text-xl">
//                 <span className="font-semibold text-red-500">
//                   Server Error : &nbsp;
//                 </span>
//                 The request processing failed due to an internal issue. Please
//                 try after some time.
//               </h4>
//             ) : output?.compilation_failed ? (
//               <h4 className="text-xl">
//                 <span className="font-semibold text-red-500">
//                   Compilation Error : &nbsp;
//                 </span>
//                 {output?.compilation_error}
//               </h4>
//             ) : output?.run_failed ? (
//               <h4 className="text-xl">
//                 <span className="font-semibold text-red-500">
//                   Runtime Error : &nbsp;
//                 </span>
//                 {output?.run_error}
//               </h4>
//             ) : output?.loading ? (
//               <h4 className="text-xl">
//                 <span className="font-semibold">
//                   {" "}
//                   Compilation status : &nbsp;
//                 </span>
//                 {output?.compilation_message}
//               </h4>
//             ) : output?.output_text ? (
//               <h4 className="text-xl bg-slate-100 rounded-md px-4 py-2 max-h-36 min-h-max overflow-y-scroll">
//                 {output?.output_text || "here is the output"}
//               </h4>
//             ) : (
//               <h4>Compile to see output</h4>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default EditorOutput;
