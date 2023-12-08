"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CreateBoxButton, JoinBoxButton } from "./NavbarButtons";
import NavBarAvatar from "./NavbarAvatar";
import ModifiedLink from "../ModifiedLink";
import customFetch from "@/utils/axios";

const Navbar = () => {
  const currPath = usePathname();
  const router = useRouter();

  // FOR CREATING CODEBOX
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  // FOR JOINING CODEBOX
  const {
    register: registerJoin,
    handleSubmit: handleSubmitJoin,
    formState: { errors: errorsJoin },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const handleCreateCodeBox: SubmitHandler<FieldValues> = async (data) => {
    try {
      const resp = await customFetch.post("/codebox", data);
      // console.log("resp = ", resp);
      const { codeBoxId } = resp.data;
      toast.success("CodeBox created successfully !");
      router.push(`/code/${codeBoxId}`);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong while creating CodeBox"
      );
    }
  };

  const handleJoinCodeBox: SubmitHandler<FieldValues> = async (data) => {
    try {
      const resp = await customFetch.post("/codebox", data);
      const { codeBoxId } = resp.data;
      toast.success("CodeBox created successfully !");
      router.push(`/code/${codeBoxId}`);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong while creating CodeBox"
      );
    }
  };

  return (
    <nav className="flex px-4 py-0 my-2 mx-2 bg-slate-200 rounded-2xl static top-0 justify-between">
      {/* LEFT SIDE OPTIONS */}
      <div className="flex items-center gap-2">
        <Image
          src="/logos/CodeCollab-logos_black.png"
          alt="CodeCollab"
          width="200"
          height="100"
          className="mr-4"
        />
        <ModifiedLink href="/" currPath={currPath}>
          Home
        </ModifiedLink>
        <ModifiedLink href="/dashboard" currPath={currPath}>
          Dashboard
        </ModifiedLink>
      </div>
      {/* RIGHT SIDE OPTIONS */}
      <div className="flex items-center gap-4">
        <CreateBoxButton
          handleSubmit={handleSubmit}
          handleCreateCodeBox={handleCreateCodeBox}
          register={register}
          errors={errors}
        />
        <JoinBoxButton
          handleSubmit={handleSubmitJoin}
          handleCreateCodeBox={handleJoinCodeBox}
          register={registerJoin}
          errors={errorsJoin}
        />
        <NavBarAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
