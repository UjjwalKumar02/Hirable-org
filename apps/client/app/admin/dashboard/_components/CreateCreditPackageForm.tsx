"use client";

import { useRef, useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { API_BASE_URL } from "../../../../config";
import { api } from "../../../../lib/api";
import { CreditPackage } from "../../../../types/creditPackage.types";

interface CreateCreditPackageFormProps {
  setOpenCreditForm: React.Dispatch<React.SetStateAction<boolean>>;
  setPackages: React.Dispatch<React.SetStateAction<CreditPackage[]>>;
}

export default function CreateCreditPackageForm(
  props: CreateCreditPackageFormProps,
) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const creditsRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const activeStateRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // Create credit package handler
  const handleCreate = async () => {
    if (
      titleRef.current?.value === "" ||
      creditsRef.current?.value === "" ||
      priceRef.current?.value === "" ||
      activeStateRef.current?.value === ""
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await api(`${API_BASE_URL}/admin/credit-package/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: titleRef.current?.value,
          credits: Number(creditsRef.current?.value),
          priceInPaise: Number(priceRef.current?.value),
          isActive:
            activeStateRef.current?.value.toLowerCase() === "true"
              ? true
              : false,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      if (titleRef && titleRef.current) {
        titleRef.current.value === "";
      }
      if (creditsRef && creditsRef.current) {
        creditsRef.current.value === "";
      }
      if (priceRef && priceRef.current) {
        priceRef.current.value === "";
      }
      if (activeStateRef && activeStateRef.current) {
        activeStateRef.current.value === "";
      }

      const jsonData = await res.json();
      props.setPackages((prev) => [...prev, jsonData.creditPackage]);
      props.setOpenCreditForm(false);
    } catch (error) {
      alert("Server is not responding!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full fixed top-0 bg-black/20 flex items-center justify-center">
      <div className="bg-white flex flex-col gap-4">
        <h2>Create credit package</h2>

        <Input reference={titleRef} type="text" title="Title" size="md" />
        <Input reference={creditsRef} type="number" title="Credits" size="md" />
        <Input
          reference={priceRef}
          type="number"
          title="Price in paise"
          size="md"
        />
        <Input
          reference={activeStateRef}
          type="boolean"
          title="Active state"
          size="md"
        />

        <div className="flex justify-between">
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            loading={loading}
          >
            Create
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => props.setOpenCreditForm(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
