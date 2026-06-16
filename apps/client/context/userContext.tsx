"use client";

import { createContext, useEffect, useState } from "react";

// Local user type
interface LocalUser {
  username: string;
  creditBalance: number;
}

// Context type
type UserContextType = {
  user: LocalUser | null;
  setUser: React.Dispatch<React.SetStateAction<LocalUser | null>>;
};

// Context
export const UserContext = createContext<UserContextType | null>(null);

// Context provider
export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    let isLocalPresent = localStorage.getItem("username");

    if (isLocalPresent) {
      setUser({
        username: localStorage.getItem("username")!,
        creditBalance: Number(localStorage.getItem("credits")),
      });

      console.log("Local updation to user context...", {
        username: localStorage.getItem("username")!,
        creditBalance: Number(localStorage.getItem("credits")),
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
