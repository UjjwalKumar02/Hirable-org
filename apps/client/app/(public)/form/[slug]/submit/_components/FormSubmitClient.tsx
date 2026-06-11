"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../../config";
import { Form } from "../../../../../../types/form.type";
import Input from "../../../../../../components/Input";
import { FieldAnswer } from "../../../../../../types/submission.type";
import TextArea from "../../../../../../components/TextArea";
import Dropdown from "../../../../../../components/Dropdown";
import Button from "../../../../../../components/Button";
import { useRouter } from "next/navigation";

export default function FormSubmitClient({ slug }: { slug: string }) {
  const [formDetails, setFormDetails] = useState<Form | null>(null);
  const [responseData, setResponseData] = useState<FieldAnswer[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  // Fetch form details
  const fetchFormDetails = async () => {
    try {
      setFetchLoading(true);

      const res = await fetch(`${API_BASE_URL}/form/${slug}/details`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setFormDetails(jsonData.formDetails);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchFormDetails();
  }, []);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevent page reload
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      // shows browser validation messages
      form.reportValidity();
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/form/${slug}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responseData }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      console.log(responseData);
      console.log("Form submitted!");
      router.push("/form/done");
    } catch (error) {
      alert("Internal server error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Onchange handler
  const handleOnChange = ({
    e,
    formFieldId,
  }: {
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;
    formFieldId: string;
  }) => {
    const value = e.target.value;

    setResponseData((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.formFieldId === formFieldId,
      );

      if (existingIndex !== -1) {
        // update the existing answer field
        const updated = [...prev];

        updated[existingIndex] = { ...updated[existingIndex], value: value };

        return updated;
      } else {
        // add a new answer field
        return [...prev, { formFieldId, value }];
      }
    });
  };

  if (fetchLoading) {
    return <>Loading...</>;
  }

  if (formDetails !== null && formDetails.isPublished === false) {
    return (
      <>
        This form is not receiving responses anymore. Please contact the owner.
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 pt-14 tracking-tight">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-fit flex flex-col px-9 py-9 border border-gray-200 rounded-md shadow-xs"
      >
        <div className="w-full flex flex-col gap-7 pt-2 pb-5 border-b border-gray-200">
          <h1 className="text-xl font-medium">
            {formDetails?.title ?? "Error"}
          </h1>

          <p className="">{formDetails?.description ?? "Error"}</p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 pt-6 pb-4 px-2">
          {formDetails !== null &&
            formDetails.formFields.length !== 0 &&
            formDetails.formFields.map((f, index) => (
              <div key={index}>
                {f.type === "TEXT" && (
                  <Input
                    // @ts-ignore
                    type={"text"}
                    title={`${f.required ? f.label + "*" : f.label} ${
                      f.wordLimit !== 0 &&
                      f.wordLimit !== undefined &&
                      f.wordLimit !== null
                        ? `(word limit: ${f.wordLimit})`
                        : ""
                    }`}
                    size="md"
                    required={f.required}
                    maxLength={f.wordLimit ?? 10000}
                    className="md:max-w-100 md:min-w-100"
                    onChange={(e) => handleOnChange({ e, formFieldId: f.id })}
                  />
                )}

                {f.type === "LONG_TEXT" && (
                  <TextArea
                    label={`${f.required ? f.label + "*" : f.label} ${
                      f.wordLimit !== 0 &&
                      f.wordLimit !== undefined &&
                      f.wordLimit !== null
                        ? `(word limit: ${f.wordLimit})`
                        : ""
                    }`}
                    required={f.required}
                    maxLength={f.wordLimit ?? 10000}
                    className="md:max-w-100 md:min-w-100 px-2 py-2"
                    onChange={(e) => handleOnChange({ e, formFieldId: f.id })}
                  />
                )}

                {(f.type === "EMAIL" || f.type === "NUMBER") && (
                  <Input
                    title={f.required ? f.label + "*" : f.label}
                    // @ts-ignore
                    type={f.type.toLowerCase()}
                    size="md"
                    className="md:max-w-100 md:min-w-100"
                    required={f.required}
                    onChange={(e) => handleOnChange({ e, formFieldId: f.id })}
                  />
                )}

                {f.type === "DROPDOWN" && (
                  <Dropdown
                    label={f.required ? f.label + "*" : f.label}
                    options={f.options ?? []}
                    className="md:max-w-100 md:min-w-100"
                    required={f.required}
                    onChange={(e) => handleOnChange({ e, formFieldId: f.id })}
                    selectOption={true}
                  />
                )}
              </div>
            ))}

          {/* Sumbit button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => console.log("Submitting...")}
            type="submit"
            className="w-fit mt-2"
            loading={submitLoading}
          >
            Submit
          </Button>
        </div>
      </form>

      <p className="text-center font-medium text-sm">
        Made with Hirable &hearts;
      </p>
    </div>
  );
}
