"use client";

import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../config";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  accountType: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchAllUser = async () => {
    try {
      const res = await api(`${API_BASE_URL}/auth/me`);

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setUser(jsonData);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      Welcome!
      <Button variant="primary" size="md" onClick={handleLogout}>
        Logout
      </Button>
      <div>{user ? <div>{user.email}</div> : <p>User is empty!</p>}</div>
    </div>
  );
}
