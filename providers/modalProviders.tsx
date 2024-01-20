"use client";

import CreateCodeBoxModal from "@/components/modals/CreateCodeBox";
import JoinCodeBoxModal from "@/components/modals/JoinCodeBox";
import ShowCodeBoxModal from "@/components/modals/ShowCodeBox";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCodeBoxModal />
      <JoinCodeBoxModal />
      {/* <ShowCodeBoxModal /> */}
    </>
  );
};
