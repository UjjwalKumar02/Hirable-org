"use client";

import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { API_BASE_URL } from "../../../config";
import { api } from "../../../lib/api";
import CreateCreditPackagePopup from "./_components/CreateCreditPackagePopup";
import { CreditPackage } from "../../../types/creditPackage.type";
import CreditPackageCard from "./_components/CreditPackageCard";
import { AddIcon } from "../../../icons/AddIcon";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";

export default function Dashboard() {
  const [createPackagePopup, setCreatePackagePopup] = useState(false);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch credit packages
  const fetchAllPackages = async () => {
    try {
      setLoading(true);

      const res = await api(`${API_BASE_URL}/admin/credit-package/bulk`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setPackages(jsonData.creditPackages);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex text-md tracking-tight">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Nav */}
        <Navbar pageTitle="Admin" />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-4xl max-w-4xl ">
            {/* Header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">Credit packages</h2>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCreatePackagePopup(true)}
                className="flex items-center gap-1.5"
              >
                <AddIcon /> Create credit package
              </Button>
            </div>

            {/* Package list */}
            <div className="flex gap-4 mt-5">
              {packages.length > 0 &&
                packages.map((p, i) => (
                  <CreditPackageCard
                    key={i}
                    id={p.id}
                    name={p.name}
                    credits={p.credits}
                    priceInPaise={p.priceInPaise}
                    isActive={p.isActive}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {createPackagePopup && (
        <CreateCreditPackagePopup
          setCreatePackagePopup={setCreatePackagePopup}
          setPackages={setPackages}
        />
      )}
    </div>
  );
}
