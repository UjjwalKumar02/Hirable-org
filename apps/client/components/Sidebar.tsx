"use client";

import AdminIcon from "../icons/AdminIcon";
import { CollapseIcon } from "../icons/CollapseIcon";
import CreditIcon from "../icons/PurchaseIcon";
import HomeIcon from "../icons/HomeIcon";
import { LogoutIcon } from "../icons/LogoutIcon";
import Button from "./Button";
import { API_BASE_URL } from "../config";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FormsContext } from "../context/formsContext";
import Link from "next/link";
import FormIcon from "../icons/FormIcon";
import DesignIcon from "../icons/DesignIcon";
import DashboardIcon from "../icons/DashboardIcon";
import QueryIcon from "../icons/QueryIcon";

export default function Sidebar() {
  const formsContext = useContext(FormsContext);
  const router = useRouter();

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
    <div className="min-h-screen min-w-60 flex flex-col border-r border-gray-200 ">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 mt-1 px-5 py-3 border-b border-gray-200">
        <h1 className="text-lg tracking-tighter font-semibold">Hirable</h1>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => console.log("first")}
        >
          <CollapseIcon />
        </Button>
      </div>

      {/* List of links */}
      <div className="flex flex-col gap-3 pl-5 mt-7">
        <div
          onClick={() => router.push("/home")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <HomeIcon />
          <p>Home</p>
        </div>

        {formsContext &&
          formsContext.forms &&
          formsContext.forms.length > 0 &&
          formsContext.forms.map((fs, i) => (
            <div key={i} className="space-y-1">
              <div
                onClick={() => console.log("Navigating...")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <FormIcon />
                <p>{fs.title}</p>
              </div>
              <Link href={`http://localhost:3001/form/${fs.slug}/design`}>
                <div
                  onClick={() => console.log("Navigating...")}
                  className="flex items-center gap-1.5 cursor-pointer pl-3"
                >
                  <DesignIcon />
                  <p>Design</p>
                </div>
              </Link>
              <Link href={`http://localhost:3001/form/${fs.slug}/dashboard`}>
                <div
                  onClick={() => console.log("Navigating...")}
                  className="flex items-center gap-1.5 cursor-pointer pl-3"
                >
                  <DashboardIcon />
                  <p>Dashboard</p>
                </div>
              </Link>
              <Link href={`http://localhost:3001/form/${fs.slug}/query`}>
                <div
                  onClick={() => console.log("Navigating...")}
                  className="flex items-center gap-1.5 cursor-pointer pl-3"
                >
                  <QueryIcon />
                  <p>Query</p>
                </div>
              </Link>
            </div>
          ))}

        <div
          onClick={() => router.push("/credits")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <CreditIcon />
          <p>Buy Credits</p>
        </div>

        <div
          onClick={() => router.push("/ledger")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <DashboardIcon />
          <p>Ledger</p>
        </div>

        <div
          onClick={() => router.push("/a-dashboard")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <AdminIcon />
          <p>Admin</p>
        </div>

        <div
          onClick={handleLogout}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <LogoutIcon />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
}
