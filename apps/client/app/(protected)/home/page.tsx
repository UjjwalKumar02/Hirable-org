"use client";

import { API_BASE_URL } from "../../../config";
import Button from "../../../components/Button";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../lib/api";
// import { Form } from "../../../types/form.type";
import { UserContext } from "../../../context/userContext";
import Navbar from "../../../components/Navbar";
import CreateFormPopup from "./_components/CreateFormPopup";
import Sidebar from "../../../components/Sidebar";
import FormCard from "./_components/FormCard";
import { AddIcon } from "../../../icons/AddIcon";
import { FormsContext } from "../../../context/formsContext";

export default function Home() {
  // const [formList, setFormList] = useState<Form[]>([]);
  const [createFormPopup, setCreateFormPopup] = useState(false);

  const userContext = useContext(UserContext);
  const formsContext = useContext(FormsContext);

  if (!userContext || !formsContext) {
    return <>Loading context...</>;
  }

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await api(`${API_BASE_URL}/auth/me`);

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      // context.setUser(jsonData.user);

      localStorage.setItem("username", jsonData.user.username);
      localStorage.setItem("credits", jsonData.user.creditBalance);
      localStorage.setItem("userRole", jsonData.user.userRole);

      userContext.setUser({
        username: jsonData.user.username,
        creditBalance: jsonData.user.creditBalance,
        userRole: jsonData.user.userRole
      });
    } catch (error) {
      alert("Internal server error");
    }
  };

  // Fetch user forms
  const fetchUserForms = async () => {
    try {
      const res = await api(`${API_BASE_URL}/form/bulk`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      // setFormList(jsonData.forms);

      localStorage.setItem("forms", JSON.stringify(jsonData.forms));
      formsContext.setForms(jsonData.forms);
    } catch (error) {
      alert("Internal server error");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserForms();
  }, []);

  

  return (
    <div className="flex text-md tracking-tight">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Nav */}
        <Navbar pageTitle="Home" />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-4xl max-w-4xl ">
            {/* Header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">Your forms</h2>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCreateFormPopup(true)}
                className="flex items-center gap-1.5"
              >
                <AddIcon /> Create form
              </Button>
            </div>

            {/* Forms list */}
            <div className="flex flex-col gap-4 mt-5">
              {formsContext.forms.length > 0 &&
                formsContext.forms.map((f, i) => (
                  <FormCard
                    key={i}
                    slug={f.slug}
                    title={f.title}
                    description={f.description}
                    isPublished={f.isPublished}
                    createdAt={f.createdAt}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {createFormPopup && (
        <CreateFormPopup
          setCreateFormPopup={setCreateFormPopup}
        />
      )}
    </div>
  );
}
