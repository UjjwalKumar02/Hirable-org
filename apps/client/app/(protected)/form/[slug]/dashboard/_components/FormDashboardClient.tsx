"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, FE_URL } from "../../../../../../config";
import { api } from "../../../../../../lib/api";
import { Form } from "../../../../../../types/form.type";
import { Submission } from "../../../../../../types/submission.type";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Button from "../../../../../../components/Button";
import { useRouter } from "next/navigation";
import { ToggleIcon } from "../../../../../../icons/ToggleIcon";
import QueryIcon from "../../../../../../icons/QueryIcon";
import { DeleteIcon } from "../../../../../../icons/DeleteIcon";
import CopyIcon from "../../../../../../icons/CopyIcon";
import formatDate from "../../../../../../lib/helpers/formatDate";
import Link from "next/link";

export default function FormDashboardClient({ slug }: { slug: string }) {
  const [formDetails, setFormDetails] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const router = useRouter();

  // Fetch form details
  const fetchFormDetails = async () => {
    try {
      setInitialLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/details`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setFormDetails(jsonData.formDetails);
      setIsPublished(jsonData.formDetails.isPublished);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await api(`${API_BASE_URL}/form/${slug}/submissions`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setSubmissions(jsonData.submissions);
    } catch (error) {
      alert("Internal server error");
    }
  };

  useEffect(() => {
    fetchFormDetails();
    fetchSubmissions();
  }, []);

  // Toggle publish handler
  const handleTogglePublish = async () => {
    try {
      setPublishLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/toggle-publish`, {
        method: "PATCH",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setFormDetails((prev) => {
        if (prev === null) {
          return null;
        } else {
          return { ...prev, isPublished: jsonData.isPublished };
        }
      });

      setIsPublished(jsonData.isPublished);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setPublishLoading(false);
    }
  };

  // Delete form handler
  const handleDeleteForm = async () => {
    try {
      setDeleteLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      router.push("/home");
    } catch (error) {
      alert("Internal server error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Copy link handler
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${FE_URL}/form/${slug}/submit`);

    alert("Copied to the clipboard");
  };

  if (initialLoading) return <>Loading...</>;

  return (
    <div className="flex text-md tracking-tight">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Nav */}
        <Navbar pageTitle="Dashboard" />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-5xl max-w-5xl ">
            {/* Header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">
                {/* {formDetails?.title ?? "Error"} */}
              </h2>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleTogglePublish}
                  className="flex items-center gap-1.5"
                  loading={publishLoading}
                >
                  <ToggleIcon /> Toggle Publish
                </Button>

                <Link href={`${FE_URL}/form/${slug}/query`}>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => console.log("Navigating..")}
                    className="flex items-center gap-1.5"
                  >
                    <QueryIcon /> Query using LLM
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDeleteForm}
                  className="flex items-center gap-1.5"
                  loading={deleteLoading}
                >
                  <DeleteIcon /> Delete Form
                </Button>
              </div>
            </div>
            {/* Form header card */}
            <div className="flex flex-col gap-5 mt-5 border border-gray-200 px-8 py-8 rounded-lg shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  {formDetails?.title ?? "Error"}
                </h2>

                {isPublished === true ? (
                  <p className="text-sm text-green-500 font-medium">
                    Published
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">Draft</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p>Number of submissions: {submissions.length}</p>

                {isPublished ? (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5"
                  >
                    <CopyIcon /> Copy published url
                  </Button>
                ) : (
                  <p>
                    {formatDate(
                      new Date(formDetails?.updatedAt ?? Date.now()),
                    ) ?? "Error"}
                  </p>
                )}
              </div>
            </div>

            {/* Response table */}
            <div className="mt-5 flex flex-col gap-5 bg-white border border-gray-200 shadow-xs rounded-lg p-6">
              <h1 className="text-lg font-medium pl-1">Responses</h1>

              {/* X scroll */}
              <div className="overflow-x-auto">
                {formDetails === null || formDetails.formFields.length === 0 ? (
                  <p>Error</p>
                ) : (
                  <table className="w-full border-collapse  border border-gray-200">
                    {/* Column names */}
                    <thead className=" border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 font-medium">#</th>
                        {formDetails.formFields.map((f, index) => (
                          <th key={index} className="px-4 py-2 font-medium">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Answers */}
                    <tbody className="text-center">
                      {submissions.length === 0 ? (
                        <tr className="px-4 py-2">
                          <td className="px-4 py-2">No responses yet!</td>
                        </tr>
                      ) : (
                        submissions.map((s, index) => {
                          const answerMap = new Map(
                            s.fieldAnswers.map((a) => [a.formFieldId, a.value]),
                          );
                          return (
                            <tr key={index} className="px-4 py-2">
                              <td className="px-4 py-2">{index + 1}</td>

                              {formDetails.formFields.map((field, idx) => (
                                <td key={idx} className="px-4 py-2">
                                  {answerMap.get(field.id) ?? null}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
