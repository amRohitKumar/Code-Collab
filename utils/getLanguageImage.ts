import Image from "next/image";

import defaultImage from "@/public/language-logos/default.png";
import CPlusImage from "@/public/language-logos/c++.png";
import CImage from "@/public/language-logos/c.png";
import JavaImage from "@/public/language-logos/java.png";
import PythonImage from "@/public/language-logos/python.png";

const getLanguageImage = (language?: string) => {
  if (!language) return defaultImage;

  if (language === "C") return CImage;
  else if (language === "C++17") return CPlusImage;
  else if (language === "Java 14") return JavaImage;
  else if (language === "Python") return PythonImage;
  else return defaultImage;
};

export default getLanguageImage;
