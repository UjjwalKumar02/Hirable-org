"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../../../config";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

export default function Login() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // Login handler
  const handleLogin = async () => {
    if (emailRef.current?.value === "" || passwordRef.current?.value === "") {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      localStorage.setItem("token", jsonData.token);

      if (emailRef && emailRef.current) {
        emailRef.current.value === "";
      }
      if (passwordRef && passwordRef.current) {
        passwordRef.current.value === "";
      }

      router.push("/home");
    } catch (error) {
      alert("Server is not responding!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* <Navbar /> */}
      <div className="flex flex-col gap-4 p-8 border border-gray-200 rounded-xl w-fit">
        <p className="text-xl font-medium mb-3 text-center">
          Login to your account
        </p>
        <Input reference={emailRef} size="md" type="email" title="Email" />
        <Input
          reference={passwordRef}
          size="md"
          type="password"
          title="Password"
        />

        <Button
          onClick={handleLogin}
          variant="primary"
          size="md"
          className="w-fit"
          loading={loading}
        >
          Login
        </Button>
      </div>

      <div className="mt-4 flex gap-1">
        <p>Don't have an account?</p>
        <Link href={"/signup"} className="text-sky-500">
          Register
        </Link>
      </div>
    </div>
  );
}
