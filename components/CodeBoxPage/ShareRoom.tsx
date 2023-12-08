import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithLabel } from "../InputWithLabel";
import { Button } from "../ui/button";
import { FaRegShareSquare } from "react-icons/fa";

type CodeBoxDetailType = {
  id: number;
  name: string;
  password: string;
  roomId: string;
  code: string;
  language: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type ShareRoomProps = {
  codeboxDetail: CodeBoxDetailType | null;
  copyContent: () => void;
};

const ShareRoom: React.FC<ShareRoomProps> = ({
  codeboxDetail,
  copyContent,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <FaRegShareSquare size="2em" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Box Details</DialogTitle>
          <DialogDescription>
            Share the box id and password with your friends to collaborate
          </DialogDescription>
        </DialogHeader>
        <InputWithLabel
          label="Box Id"
          labelFor="boxId"
          type="text"
          disabled
          value={codeboxDetail?.roomId}
        />
        <InputWithLabel
          label="Password"
          labelFor="password"
          type="text"
          disabled
          value={codeboxDetail?.password}
        />
        <DialogFooter>
          <Button type="button" onClick={copyContent}>
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareRoom;
