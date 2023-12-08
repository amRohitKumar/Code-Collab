import {
  UseFormHandleSubmit,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { FieldValues } from "react-hook-form";

import { Button } from "../ui/button";
import { InputWithLabel } from "../InputWithLabel";
import { ErrorMessage } from "@hookform/error-message";
import { FormErrorMessage } from "../FormErrorMessage";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CreateBoxPropTypes = {
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
  handleCreateCodeBox: SubmitHandler<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

type JoinBoxPropTypes = CreateBoxPropTypes;

export const CreateBoxButton: React.FC<CreateBoxPropTypes> = ({
  handleSubmit,
  handleCreateCodeBox,
  register,
  errors,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Code</Button>
      </DialogTrigger>
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
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const JoinBoxButton: React.FC<JoinBoxPropTypes> = ({
  handleSubmit,
  handleCreateCodeBox,
  register,
  errors,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleCreateCodeBox)}>
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
            <Button type="submit">Join</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
