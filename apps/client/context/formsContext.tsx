"use client";

import { createContext, useEffect, useState } from "react";
import { Form } from "../types/form.type";

// Context type
type FormsContextType = {
  forms: Form[];
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;
};

// Context
export const FormsContext = createContext<FormsContextType | null>(null);

// Context provider
export default function FormsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    let isLocalPresent = localStorage.getItem("forms");

    if (isLocalPresent && isLocalPresent !== null && isLocalPresent !== "") {
      setForms(JSON.parse(localStorage.getItem("forms") ?? "") ?? []);

      console.log(
        `Local updation to forms context, ${JSON.parse(localStorage.getItem("forms") ?? "Empty")}`,
      );
    }
  }, []);

  return (
    <FormsContext.Provider value={{ forms, setForms }}>
      {children}
    </FormsContext.Provider>
  );
}
