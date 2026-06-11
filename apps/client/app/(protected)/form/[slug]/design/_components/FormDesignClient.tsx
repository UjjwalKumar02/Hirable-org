"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../config";
import { api } from "../../../../../../lib/api";
import { FormField } from "../../../../../../types/form.type";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Button from "../../../../../../components/Button";
import { AddIcon } from "../../../../../../icons/AddIcon";
import EditFieldCard from "./EditFieldCard";
import Input from "../../../../../../components/Input";
import TextArea from "../../../../../../components/TextArea";
import Dropdown from "../../../../../../components/Dropdown";
import { EditIcon } from "../../../../../../icons/EditIcon";
import { DeleteIcon } from "../../../../../../icons/DeleteIcon";
import { useRouter } from "next/navigation";
import SaveIcon from "../../../../../../icons/SaveIcon";

export default function FormDesignClient({ slug }: { slug: string }) {
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [fieldList, setFieldList] = useState<FormField[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentEditFieldIndex, setCurrentEditFieldIndex] = useState<
    number | null
  >(null);

  const router = useRouter();

  // Fetch form details
  const fetchFormDetails = async () => {
    try {
      setFetchLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/details`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setFormTitle(jsonData.formDetails.title);
      setFormDesc(jsonData.formDetails.description);
      setFieldList(jsonData.formDetails.formFields);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchFormDetails();
  }, []);

  useEffect(() => {
    console.log(fieldList);
  }, [fieldList]);

  // Save form handler
  const handleSaveForm = async () => {
    // get field list and title and description
    // make request
    // match the backend and frontend and db types

    if (formTitle === "" || formDesc === "") {
      alert("Form title and description are required!");
      return;
    }
    if (fieldList.length === 0) {
      alert("Form cant have empty fields!");
      return;
    }

    try {
      setUpdateLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDesc,
          fieldList,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      router.push("/home");
    } catch (error) {
      alert("Internal server error");
    } finally {
      setUpdateLoading(false);
    }
  };

  // New field
  const newField: FormField = {
    id: `RandomID-${Math.random().toString()}`,
    label: "New",
    type: "TEXT",
    required: false,
    order: fieldList.length,
    options: [],
  };

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
        <Navbar pageTitle={`Design -> ${formTitle} `} />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-3xl max-w-3xl ">
            {/* Header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">Design</h2>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setFieldList((prev) => [...prev, newField])}
                  className="flex items-center gap-1.5"
                >
                  <AddIcon /> Add new field
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleSaveForm}
                  className="flex items-center gap-1.5"
                  loading={updateLoading}
                >
                  <SaveIcon /> Save form
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5 mt-5 border border-gray-200 px-9 py-9 rounded-md shadow-xs">
              <input
                type="text"
                placeholder="Title"
                defaultValue={formTitle}
                onChange={(e) => setFormTitle(e.currentTarget.value)}
                className="outline-none border border-gray-200 rounded-lg py-2.5 px-2 text-lg"
              />

              <input
                type="text"
                placeholder="Description"
                defaultValue={formDesc}
                onChange={(e) => setFormDesc(e.currentTarget.value)}
                className="resize-none outline-none border border-gray-200 rounded-lg py-1 px-2"
              />

              <div className="flex flex-col gap-4 mt-5 border-t border-gray-200 py-6 px-1">
                {fieldList.length === 0 ? (
                  <p>This form has no fields</p>
                ) : (
                  fieldList.map((f, idx) => (
                    <div key={idx}>
                      {currentEditFieldIndex === idx ? (
                        <EditFieldCard
                          setCurrentEditFieldIndex={setCurrentEditFieldIndex}
                          setFieldList={setFieldList}
                          fieldData={f}
                          index={idx}
                        />
                      ) : (
                        <div className="flex md:flex-row flex-col gap-3 justify-between">
                          {/* If type is dropdown */}
                          {f.type === "DROPDOWN" && (
                            <Dropdown
                              label={f.required ? f.label + "*" : f.label}
                              options={f.options ?? []}
                              className="md:min-w-100"
                              disabled={true}
                            />
                          )}

                          {/* If type is text */}
                          {f.type === "TEXT" && (
                            <Input
                              type="text"
                              size="sm"
                              title={`${f.required ? f.label + "*" : f.label} ${
                                f.wordLimit !== 0 &&
                                f.wordLimit !== undefined &&
                                f.wordLimit !== null
                                  ? `(word limit: ${f.wordLimit})`
                                  : ""
                              }`}
                              readonly={true}
                              className="md:min-w-100"
                            />
                          )}

                          {/* If type is number or email */}
                          {(f.type === "NUMBER" || f.type === "EMAIL") && (
                            <Input
                              type={"text"}
                              size="sm"
                              title={f.required ? f.label + "*" : f.label}
                              readonly={true}
                              className="md:min-w-100"
                            />
                          )}

                          {/* If type is dropdown */}
                          {f.type === "LONG_TEXT" && (
                            <TextArea
                              label={`${f.required ? f.label + "*" : f.label} ${
                                f.wordLimit !== 0 &&
                                f.wordLimit !== undefined &&
                                f.wordLimit !== null
                                  ? `(word limit: ${f.wordLimit})`
                                  : ""
                              }`}
                              disabled={true}
                              className="md:min-w-100 px-2 py-2"
                            />
                          )}

                          {/* Edit and Delete buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              className="h-fit border border-gray-300 rounded-full p-1"
                              onClick={() => setCurrentEditFieldIndex(idx)}
                            >
                              <EditIcon />
                            </button>

                            <button
                              className="h-fit border border-gray-300 rounded-full p-1"
                              onClick={() =>
                                setFieldList((prev) =>
                                  prev.filter((f, i) => i !== idx),
                                )
                              }
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
