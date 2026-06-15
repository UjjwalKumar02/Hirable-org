"use client";

import { useContext, useEffect, useState } from "react";
import Navbar from "../../../../../../components/Navbar";
import Sidebar from "../../../../../../components/Sidebar";
import { Form } from "../../../../../../types/form.type";
import { api } from "../../../../../../lib/api";
import { API_BASE_URL, CREDIT_PER_LLM_CALL } from "../../../../../../config";
import { Chat, Query } from "../../../../../../types/query.type";
import { UserContext } from "../../../../../../context/userContext";
import Button from "../../../../../../components/Button";
import LLMResponseCard from "./LLMResponseCard";

export default function FormQueryClient({ slug }: { slug: string }) {
  const [formDetails, setFormDetails] = useState<Form | null>(null);
  const [query, setQuery] = useState<Query | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);

  const userContext = useContext(UserContext);

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

  // User context validation after useEffect
  if (userContext === null || userContext.user === null) {
    return <>Loading context...</>;
  }

  // LLM query handler
  const handleLLMQuery = async () => {
    if (query === null || query.question === "") {
      alert("Query can't be empty!");
      return;
    }

    // Frontend credits quick validation
    if (
      userContext.user?.creditBalance === 0 ||
      !userContext.user?.creditBalance ||
      userContext.user?.creditBalance < CREDIT_PER_LLM_CALL
    ) {
      alert("Credit is insufficient!");
      return;
    }

    try {
      setQueryLoading(true);

      const res = await api(`${API_BASE_URL}/form/${slug}/llm-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.question,
        }),
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setChats((prev) => [
        {
          llmResponse: jsonData.llmResponse,
          sources: jsonData.sources,
          query: query,
        },
        ...prev,
      ]);

      // Credits updation
      userContext.setUser((prev) => {
        if (prev === null) return prev;

        return {
          ...prev,
          creditBalance: jsonData.creditBalance,
        };
      });
      localStorage.setItem("credits", jsonData.creditBalance);

      // Clean up
      setQuery(null);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setQueryLoading(false);
    }
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
        <Navbar pageTitle={`Query -> ${formDetails?.title ?? "Error"} `} />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-4xl max-w-4xl ">
            {/* Header */}
            <div className="w-full flex flex-col gap-6 items-center justify-center mt-8 border border-gray-200 p-4 rounded-md shadow-xs">
              <h2 className="font-medium text-lg">
                Query : {formDetails?.title ?? "Error"}
              </h2>

              {/* Chat box container */}
              <div className="w-full flex items-center">
                <input
                  type="text"
                  placeholder="Write your query here..."
                  className="outline-none px-3 py-3 border border-gray-200 rounded-md w-full"
                  value={query?.question ?? ""}
                  onChange={(e) =>
                    setQuery({
                      question: e.target.value,
                      createdAt: new Date(Date.now()),
                    })
                  }
                />

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleLLMQuery}
                  loading={queryLoading}
                >
                  Query
                </Button>
              </div>
            </div>

            {/* All contents */}
            {/* Chat output container */}
            <div className="mt-5 flex flex-col gap-5">
              {chats.length > 0 &&
                chats.map((c, index) => (
                  <LLMResponseCard
                    key={index}
                    query={c.query}
                    llmResponse={c.llmResponse}
                    sources={c.sources}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
