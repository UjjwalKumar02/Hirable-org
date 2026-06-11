"use client";

import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Button from "./Button";
import WalletIcon from "../icons/WalletIcon";
import UserIcon from "../icons/UserIcon";

interface NavbarProps {
  pageTitle: string;
}

export default function Navbar(props: NavbarProps) {
  const context = useContext(UserContext);
  if (!context || !context.user) {
    return <>Loading...</>;
  }

  return (
    <div className="w-full flex justify-between items-center border-b border-gray-200 mt-1 py-3 px-5">
      <div>
        <p className="text-lg font-medium">{props.pageTitle}</p>
      </div>

      <div className="flex items-center gap-5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => console.log("first")}
          className="flex items-center gap-1.5"
        >
          <UserIcon />
          <p>{context.user.username}</p>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => console.log("first")}
          className="flex items-center gap-1"
        >
          <WalletIcon /> Credits : {context.user.creditBalance}
        </Button>
      </div>
    </div>
  );
}
