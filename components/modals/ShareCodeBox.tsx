import { toast } from "sonner";
import { useModal } from "@/hooks/useModalState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputWithLabel } from "../InputWithLabel";
import { Button } from "../ui/button";
import axios from "@/utils/axios";
import { useState } from "react";

const ShareCodeBoxModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "shareCodeBox";
  const [password, setPassword] = useState<string>(data?.password);

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(
        `Box Id: ${data?.roomId} \nPassword: ${data?.password}`
      );
      toast.success("Copied !");
      onClose();
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy !");
    }
  };

  const updatePassword = async () => {
    try {
      await axios.patch(`/codebox/${data?.codeboxId}/update-password`, {
        password,
      });
      onClose();
      toast.success("Password updated successfully !");
    } catch (e) {
      console.log("Failed to update password ");
      toast.error("Failed to update password !");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
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
          value={data?.roomId}
        />
        <InputWithLabel
          label="Password"
          labelFor="password"
          type="text"
          defaultValue={data?.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <DialogFooter>
          <Button type="button" onClick={copyContent}>
            Copy
          </Button>
          <Button type="button" onClick={updatePassword}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareCodeBoxModal;
