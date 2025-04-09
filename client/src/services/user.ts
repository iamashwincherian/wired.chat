import { ApiClient } from "@/lib/api-client";
import { toast } from "sonner";

const sendVerification = async (userId: string) => {
  const response = await ApiClient("POST", "/verification/send", {
    userId,
  });

  if (response.success) {
    toast.success("Verification code has been sent!");
  }

  return response;
};

const verifyUser = async (userId: string, code: string) => {
  const response = await ApiClient("POST", "/verification/verify", {
    userId,
    code,
  });

  if (response.success) {
    toast.success("User verification successful!");
  }

  if (response.error?.code === "INVALID") {
    toast.error("Invalid verification code!");
  }

  return response;
};

const UserService = {
  sendVerification,
  verifyUser,
};

export default UserService;
