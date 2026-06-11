import { useRef, useState } from "react";
import { FormField, FormFieldType } from "../../../../../../types/form.type";
import Input from "../../../../../../components/Input";
import Dropdown from "../../../../../../components/Dropdown";
import Button from "../../../../../../components/Button";

const OPTION_TYPES = ["DROPDOWN"];
const WORDLIMIT_TYPES = ["TEXT", "LONG_TEXT"];

export interface EditFieldProps {
  setCurrentEditFieldIndex: React.Dispatch<number | null>;
  setFieldList: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  fieldData: FormField;
}

export default function EditField({
  index,
  fieldData,
  setFieldList,
  setCurrentEditFieldIndex,
}: EditFieldProps) {
  const labelRef = useRef<HTMLInputElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const optionsRef = useRef<HTMLInputElement | null>(null);
  const requiredRef = useRef<HTMLSelectElement | null>(null);
  const wordLimitRef = useRef<HTMLInputElement | null>(null);

  const [fieldtype, setFieldType] = useState<FormFieldType>(fieldData.type);

  // Converting Options array to string
  const defaultOptionString = fieldData.options?.join(",") ?? "";

  // Save Field handler
  const handleSaveField = () => {
    if (labelRef.current?.value === "") {
      alert("Label is required!");
      return;
    }
    if (OPTION_TYPES.includes(fieldtype) && optionsRef.current?.value === "") {
      alert("Options cant be empty!");
      return;
    }

    const wordLimitValue = Number(wordLimitRef.current?.value);

    const field: FormField = {
      label: labelRef.current?.value ?? "",
      type: typeRef.current?.value as FormFieldType,
      // @ts-ignore
      options: OPTION_TYPES.includes(fieldtype)
        ? optionsRef.current?.value.split(",").map((o) => o.trim())
        : [],
      required: requiredRef.current?.value === "true" ? true : false,
      // @ts-ignore
      wordLimit:
        wordLimitValue === null ||
        wordLimitValue === undefined ||
        wordLimitValue === 0 ||
        isNaN(wordLimitValue)
          ? null
          : wordLimitValue,
    };

    setFieldList((prev) => prev.map((item, i) => (i === index ? field : item)));
    setCurrentEditFieldIndex(null);
  };

  return (
    <div className="bg-gray-50 p-3 border border-gray-200 rounded-xl flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        {/* Label */}
        <Input
          reference={labelRef}
          size="sm"
          title="Label"
          type="text"
          defaultValue={fieldData.label}
        />

        {/* Type */}
        <Dropdown
          reference={typeRef}
          label="Type"
          options={["TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "DROPDOWN"]}
          onChange={(e) => {
            setFieldType(e.target.value as FormFieldType);
          }}
          defaultValue={fieldData.type}
        />

        {/* Options */}
        {OPTION_TYPES.includes(fieldtype) && (
          <Input
            reference={optionsRef}
            size="sm"
            title="Options"
            type="text"
            placeholder="first, second, third"
            defaultValue={defaultOptionString}
          />
        )}

        {/* Required */}
        <Dropdown
          reference={requiredRef}
          label="Required"
          options={["true", "false"]}
          defaultValue={String(fieldData.required)}
        />

        {/* Word limit */}
        {WORDLIMIT_TYPES.includes(fieldtype) && (
          <Input
            reference={wordLimitRef}
            size="sm"
            title="Word limit (optional)"
            type="text"
            defaultValue={`${
              fieldData.wordLimit === null ||
              fieldData.wordLimit === undefined ||
              fieldData.wordLimit === 0 ||
              isNaN(fieldData.wordLimit)
                ? ""
                : fieldData.wordLimit
            }`}
          />
        )}
      </div>

      <div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveField}
          className="h-fit w-full"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
