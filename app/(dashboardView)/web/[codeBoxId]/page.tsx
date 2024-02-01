import WebPage from "@/components/CodeBoxPage/WebPage";
import axios from "@/utils/axios";
import serverAuth from "@/utils/auth";
import sortByFileConvention from "@/utils/customFileSorting";

type PropsType = {
  codeBoxId: string;
};

const Page = async ({ params: { codeBoxId } }: { params: PropsType }) => {
  const user = (await serverAuth())?.user;
  const {
    codeBox,
    codeFiles,
  }: { codeBox: models.ICodeBox; codeFiles: models.ICodeFile[] } = (
    await axios.get(`/codebox/${codeBoxId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.express_token}`,
      },
    })
  ).data;
  codeFiles.sort((fileA, fileB) =>
    sortByFileConvention(fileA.language, fileB.language)
  );
  return (
    <WebPage codeBoxId={codeBoxId} codeBox={codeBox} codeFiles={codeFiles} />
  );
};

export default Page;
