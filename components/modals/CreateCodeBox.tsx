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
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/InputWithLabel";
import { FormErrorMessage } from "@/components/FormErrorMessage";

import { languages } from "@/utils/getMonacoLangId";

const CreateCodeBoxModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      language: "WEB",
      password: "",
    },
  });

  const isModalOpen = isOpen && type === "createCodeBox";

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreateCodeBox: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log("dd = ", data);
      const resp = await customFetch.post("/codebox", data);
      // console.log("resp = ", resp);
      toast.success("CodeBox created successfully !");
      const { codeBoxId } = resp.data;
      const codeBoxUrl = `/${
        data.language === "WEB" ? "web" : "code"
      }/${codeBoxId}`;
      handleClose();
      router.push(codeBoxUrl);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong while creating CodeBox"
      );
    }
  };

  

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleCreateCodeBox)}>
          <DialogHeader>
            <DialogTitle>Create Code Box</DialogTitle>
            <DialogDescription>Enter name of your code box.</DialogDescription>
          </DialogHeader>
          <InputWithLabel
            label="Name"
            labelFor="name"
            type="text"
            className="my-4"
            {...register("name", {
              required: {
                value: true,
                message: "Name is required",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="name"
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

          <Label className="grid grid-cols-4 items-center gap-4 text-right">
            Language
            <Select onValueChange={(lang) => setValue("language", lang)}>
              <SelectTrigger className="col-span-3 font-normal" defaultValue="WEB">
                <SelectValue placeholder="WEB" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {languages.map((language, idx) => (
                    <SelectItem key={idx} value={language.name}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <DialogFooter className="mt-4">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCodeBoxModal;
