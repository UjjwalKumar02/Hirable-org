"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { api } from "../../../lib/api";
import { Ledger } from "../../../types/ledger.type";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import LedgerCard from "./_components/LedgerCard";

export default function LedgerPage() {
  const [ledgerList, setLedgerList] = useState<Ledger[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchLedger = async () => {
    try {
      setFetchLoading(true);

      const res = await api(`${API_BASE_URL}/credit/ledger`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      let jsonData = await res.json();
      setLedgerList(jsonData.ledger);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  if (fetchLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex text-md tracking-tight">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Nav */}
        <Navbar pageTitle="Credit ledger" />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-4xl max-w-4xl ">
            {/* header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">Credit Ledger</h2>
            </div>

            {/* Credits list */}
            <div className="flex flex-col gap-4 mt-5">
              {ledgerList.length > 0 &&
                ledgerList.map((l, i) => <LedgerCard key={i} ledger={l} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
