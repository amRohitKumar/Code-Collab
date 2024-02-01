import CodePage from "@/components/CodeBoxPage/CodePage";
import axios from "@/utils/axios";
import serverAuth from "@/utils/auth";
import { SERVER_URL } from "@/backendUrl";

type PropsType = {
  codeBoxId: string;
};

const Page = async ({ params: { codeBoxId } }: { params: PropsType }) => {
  const user = (await serverAuth())?.user;
  const {
    codeBox,
    codeFiles,
  }: { codeBox: models.ICodeBox; codeFiles: models.ICodeFile[] } = (
    await axios.get(`${SERVER_URL}/codebox/${codeBoxId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.express_token}`,
      },
    })
  ).data;

  return (
    <CodePage codeBoxId={codeBoxId} codeBox={codeBox} codeFiles={codeFiles} />
  );
};

export default Page;
