import { Toaster, toast } from "sonner";
// import React from "react";

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-center",
    autoClose: 500,
  });
};
export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-center",
    autoClose: 2500,
  });
};
