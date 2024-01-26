import { toast } from "sonner"
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


const ShareCodeBoxModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "shareCodeBox";

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(
        `Box Id: ${data?.roomId} \nPassword: ${data?.password}`
      );
      toast.success("Copied !");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy !");
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
          disabled
          value={data?.password}
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

export default ShareCodeBoxModal;
