import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { name: "C", value: "C" },
  { name: "C++14", value: "CPP14" },
  { name: "C++17", value: "CPP17" },
  { name: "Java 8", value: "JAVA8" },
  { name: "Java 14", value: "JAVA14" },
  { name: "JavaScript(Nodejs)", value: "JAVASCRIPT_NODE" },
  { name: "Kotlin", value: "KOTLIN" },
  { name: "R", value: "R" },
  { name: "Ruby", value: "RUBY" },
  { name: "Rust", value: "RUST" },
  { name: "TypeScript", value: "TYPESCRIPT" },
];

const EditorFooter = () => {
  return (
    <div className="bg-slate-200 py-2 px-2 flex justify-between">
      <div className="flex items-center gap-2">
        <Select defaultValue="JAVASCRIPT_NODE">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="bg-slate-400/40 px-2 py-1.5 rounded-lg">
          Time limit: 2 sec
        </div>
        <div className="bg-slate-400/40 px-2 py-1.5 rounded-lg">
          Memory limit: 128 mb
        </div>
      </div>
      <div>
        <Button className="bg-green-800 text-white">Compile</Button>
      </div>
    </div>
  );
};

export default EditorFooter;
