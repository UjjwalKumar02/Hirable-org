"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../../../config";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

export default function Signup() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // Signup handler
  const handleSignup = async () => {
    if (
      emailRef.current?.value === "" ||
      usernameRef.current?.value === "" ||
      passwordRef.current?.value === ""
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      if (emailRef && emailRef.current) {
        emailRef.current.value === "";
      }
      if (usernameRef && usernameRef.current) {
        usernameRef.current.value === "";
      }
      if (passwordRef && passwordRef.current) {
        passwordRef.current.value === "";
      }

      const jsonData = await res.json();
      localStorage.setItem("userId", jsonData.userId);

      router.push("/verify-email");
    } catch (error) {
      alert("Server is not responding!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* <Navbar/> */}
      <div className="flex flex-col gap-4 p-8 border border-gray-200 rounded-xl w-fit">
        <p className="text-xl font-medium mb-3 text-center">
          Create a new account
        </p>
        <Input reference={emailRef} size="md" type="email" title="Email" />
        <Input reference={usernameRef} size="md" type="text" title="Name" />
        <Input
          reference={passwordRef}
          size="md"
          type="password"
          title="Password"
        />

        <Button
          onClick={handleSignup}
          variant="primary"
          size="md"
          className="w-fit"
          loading={loading}
        >
          Register
        </Button>
      </div>

      <div className="mt-4 flex gap-1">
        <p>Already have an account?</p>
        <Link href={"/login"} className="text-sky-500">
          Login
        </Link>
      </div>
    </div>
  );
}
