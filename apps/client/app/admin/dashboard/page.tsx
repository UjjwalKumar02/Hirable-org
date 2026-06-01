"use client";

import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { API_BASE_URL } from "../../../config";
import { api } from "../../../lib/api";
import CreditPackageCard from "./_components/CreditPackageCard";
import CreateCreditPackageForm from "./_components/CreateCreditPackageForm";
import { CreditPackage } from "../../../types/creditPackage.types";

export default function Dashboard() {
  const [openCreditForm, setOpenCreditForm] = useState(false);
  const [packages, setPackages] = useState<CreditPackage[]>([]);

  const fetchAllPackages = async () => {
    try {
      const res = await api(`${API_BASE_URL}/admin/credit-package/bulk`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setPackages(jsonData.creditPackages);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-5">
      <Button
        variant="primary"
        size="md"
        onClick={() => setOpenCreditForm(true)}
      >
        Create Credit package
      </Button>

      {packages &&
        packages.length > 0 &&
        packages.map((p, i) => (
          <CreditPackageCard
            key={i}
            name={p.name}
            credits={p.credits}
            priceInPaise={p.priceInPaise}
            isActive={p.isActive}
          />
        ))}

      {openCreditForm && (
        <CreateCreditPackageForm
          setOpenCreditForm={setOpenCreditForm}
          setPackages={setPackages}
        />
      )}
    </div>
  );
}
