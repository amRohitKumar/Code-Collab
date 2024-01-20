"use client";

import { useSession } from "next-auth/react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import customFetch from "@/utils/axios";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/useModalState";
import { ErrorMessage } from "@hookform/error-message";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/InputWithLabel";
import { FormErrorMessage } from "@/components/FormErrorMessage";

const JoinCodeBoxModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { data, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isLoading },
  } = useForm<FieldValues>({
    defaultValues: {
      boxId: "",
      password: "",
    },
  });

  const handleJoinCodeBox: SubmitHandler<FieldValues> = async (formData) => {
    try {
      const { boxId, password } = formData; // boxId here is roomId
      const resp = await customFetch.post(`/codebox/${boxId}`, { password });
      const { codeBoxId, room_token, type } = resp.data;
      // console.log("room = ", room_token);
      // code here
      await update({ room_token });
      // console.log(res);
      // console.log("after updation = ", data);
      toast.success("Joining CodeBox !");
      router.push(`/${type === "WEB" ? "web" : "code"}/${codeBoxId}`);
      handleClose();
    } catch (error: any) {
      console.log("joining error = ", error);
      toast.error(
        error?.data?.message || "Something went wrong while joining CodeBox"
      );
    }
  };

  const isModalOpen = isOpen && type === "joinCodeBox";

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleJoinCodeBox)}>
          <DialogHeader>
            <DialogTitle>Join Code Box</DialogTitle>
            <DialogDescription>
              Enter Code Box Id and password to join a Code Box{" "}
            </DialogDescription>
          </DialogHeader>
          <InputWithLabel
            label="Box Id"
            labelFor="boxId"
            type="text"
            className="my-4"
            {...register("boxId", {
              required: {
                value: true,
                message: "Box Id is required",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="boxId"
            render={({ message }) => <FormErrorMessage message={message} />}
          />
          <InputWithLabel
            label="Password"
            labelFor="password"
            type="password"
            className="my-4"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                message:
                  "Password must contain at least 8 characters, one uppercase, one lowercase and one number",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <FormErrorMessage message={message} />}
          />
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Join
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCodeBoxModal;
