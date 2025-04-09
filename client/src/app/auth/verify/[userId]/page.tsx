"use client";

import { login } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import UserService from "@/services/user";
import { Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OTP_LENGTH = 6;
const RESEND_TIME = 3;

export default function VerifyPage() {
  const { userId } = useParams();
  const router = useRouter();

  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleCodeChange = async (code: string) => {
    if (code.length === OTP_LENGTH) {
      const response = await UserService.verifyUser(userId as string, code);
      if (response.success && response.data) {
        await login(response.data.user, response.data.token);
        router.push("/");
      }
    }
  };

  const handleResendCode = async () => {
    await UserService.sendVerification(userId as string);
    setTimer(RESEND_TIME);
    setIsResendEnabled(false);
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          Enter the code to verify your account
        </CardTitle>
        <CardDescription>
          A one-time code has been sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center my-4">
          <InputOTP maxLength={OTP_LENGTH} onChange={handleCodeChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleResendCode}
            variant={isResendEnabled ? "outline" : "ghost"}
            disabled={!isResendEnabled}
            className={cn(
              isResendEnabled
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            {isResendEnabled ? (
              <>
                <Mail className="mr-1 text-foreground" />
                Resend Code
              </>
            ) : (
              `Resend Code in ${timer}s`
            )}
          </Button>
        </div>
      </CardContent>
    </>
  );
}
