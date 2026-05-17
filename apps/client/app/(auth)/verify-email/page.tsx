"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { API_BASE_URL } from "../../../config";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [counter, setCounter] = useState(10 * 60);
  const [userId, setUserId] = useState("");
  let otpRef = useRef<HTMLInputElement | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id ?? "");
  }, []);

  useEffect(() => {
    if (counter <= 0) return;

    const clock = setInterval(
      () =>
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(clock);
            return 0;
          }

          return prev - 1;
        }),
      1000,
    );

    return () => clearInterval(clock);
  }, [counter]);

  const handleVerify = async () => {
    if (otpRef.current?.value === "") {
      alert("OTP can't be empty!");
      return;
    }

    try {
      setVerifyLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        body: JSON.stringify({
          otp: otpRef.current?.value,
          userId: userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      localStorage.removeItem("userId");
      router.push("/login");
    } catch (error: any) {
      alert(error.message ?? "Server is not responding.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      alert("OTP sent!");
      setCounter(10 * 60);
    } catch (error: any) {
      alert(error.message ?? "Server is not responding.");
    } finally {
      setResendLoading(false);
    }
  };

  let minutes = Math.floor(counter / 60);
  let seconds = counter % 60;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      {/* Verify Card */}
      <div className="flex flex-col gap-4 p-8 border border-gray-200 rounded-xl w-fit items-center">
        <p className="text-xl font-medium mb-3 text-center">
          Verify the email address
        </p>

        <p className="max-w-72 text-center">
          A one-time code is sent to registered email. Please check your inbox.
        </p>

        <p className="text-sky-600">
          OTP expires in {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </p>

        <Input
          reference={otpRef}
          size="md"
          type="text"
          placeholder="verification code"
          maxLength={6}
        />

        <div className="w-full flex items-center justify-between">
          <Button
            onClick={handleVerify}
            variant="primary"
            size="md"
            className="w-fit"
            loading={verifyLoading}
          >
            Verify
          </Button>

          <Button
            onClick={handleResend}
            variant="secondary"
            size="md"
            className="w-fit"
            disabled={counter > 0}
            loading={resendLoading}
          >
            Resend code
          </Button>
        </div>
      </div>
    </div>
  );
}
