"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Image from "next/image";
import clsx from "clsx";
import { ErrorMessage } from "@hookform/error-message";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AuthSocialGroup } from "@/components/SocialIcons";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/FormErrorMessage";
import customFetch from "@/utils/axios";

type VariantType = "LOGIN" | "REGISTER";

const Auth = () => {
  const [variant, setVariant] = useState<VariantType>("LOGIN");
  const handleSocialLogin = (provider: string) => {
    console.log(provider);
  };
  const toggleVariant = () => {
    setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (variant === "LOGIN") {
        await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
      } else {
        await customFetch.post("/auth/register", data);
        await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
      }
    } catch (error: any) {
      console.log("LOGIN ERROR = ", error);
      toast.error(error?.message || "Something went wrong !");
    }
  };

  return (
    <div className="main flex flex-col h-full items-center justify-center relative">
      <div className="w-11/12 sm:w-7/12 xl:w-2/5 px-6 py-10 border-slate-200 border-2 rounded-3xl bg-slate-100 z-10  glassMorphism">
        <h3 className="text-5xl font-semibold text-center text-primary">
          Login to Your Account
        </h3>
        <h6 className="text-xl text-center text-slate-400 mt-2">
          Login using social networks
        </h6>
        {/* SOCIAL MEDIA ICONS  */}
        <AuthSocialGroup handleSocialLogin={handleSocialLogin} />
        {/* -----OR------------ */}
        <div className="relative flex justify-center mt-2">
          <div className="border-[1px] border-gray-200 absolute w-full top-1/2"></div>
          <span className="z-10 relative bg-slate-100 px-2 text-gray-500">
            Or continue with
          </span>
        </div>
        {/* EMAIL PASSWORD LOGIN */}
        <form
          className="max-w-[400px] flex gap-4 justify-center mt-4 flex-col mx-auto text-primary"
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === "REGISTER" && (
            <>
              <Input
                type="text"
                placeholder="Name"
                className={clsx(errors.email && "border-red-500")}
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
            </>
          )}
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", {
              required: { value: true, message: "Email Address is required" },
            })}
            className={clsx(errors.email && "border-red-500")}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
              pattern: {
                value:
                  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                message:
                  "Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
              },
            })}
            className={clsx(errors.password && "border-red-500")}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <FormErrorMessage message={message} />}
          />
          <Button type="submit">Submit</Button>
        </form>
        <div className="mt-4 text-center text-gray-500 w-full">
          {variant === "LOGIN" ? (
            <button type="button" onClick={toggleVariant}>
              Don't have an account?
            </button>
          ) : (
            <button type="button" onClick={toggleVariant}>
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
