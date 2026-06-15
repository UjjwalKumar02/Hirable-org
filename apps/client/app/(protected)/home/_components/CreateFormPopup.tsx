"use client";

import { useContext, useRef, useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { API_BASE_URL } from "../../../../config";
import { api } from "../../../../lib/api";
// import { Form } from "../../../../types/form.type";
import { FormsContext } from "../../../../context/formsContext";

interface CreateFormPopupProps {
  setCreateFormPopup: React.Dispatch<React.SetStateAction<boolean>>;
  // setFormList: React.Dispatch<React.SetStateAction<Form[]>>;
}

export default function CreateFormPopup(props: CreateFormPopupProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const formsContext = useContext(FormsContext);
  if (!formsContext) {
    return <>Loading context...</>;
  }

  // Create credit package handler
  const handleCreate = async () => {
    if (
      titleRef.current?.value === "" ||
      descriptionRef.current?.value === ""
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await api(`${API_BASE_URL}/form/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleRef.current?.value,
          description: descriptionRef.current?.value,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      if (titleRef && titleRef.current) {
        titleRef.current.value === "";
      }
      if (descriptionRef && descriptionRef.current) {
        descriptionRef.current.value === "";
      }

      const jsonData = await res.json();
      formsContext.setForms((prev) => [jsonData.form, ...prev]);
      props.setCreateFormPopup(false);
    } catch (error) {
      alert("Server is not responding!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full fixed top-0 bg-black/20 flex items-center justify-center">
      <div className="bg-white flex flex-col gap-4 p-8 border border-gray-200 rounded-xl">
        <h2 className="text-xl font-medium mb-3 text-center">Create Form</h2>

        <Input reference={titleRef} type="text" title="Title" size="md" />
        <Input
          reference={descriptionRef}
          type="text"
          title="Description"
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
            variant="secondary"
            size="md"
            onClick={() => props.setCreateFormPopup(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
