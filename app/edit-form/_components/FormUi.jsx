"use client";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { db } from "../../../config";
import { userResponses } from "../../../config/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CldUploadWidget, CldImage } from "next-cloudinary";

const FormUi = ({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enabledSignIn = false,
}) => {
  const { user, isSignedIn } = useUser();
  const [formData, setFormData] = useState({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [errors, setErrors] = useState({});
  let formRef = useRef();
  const router = useRouter();

  const validateField = (name, value) => {
    let error = "";
    if (name.includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email format";
    }
    if (name.includes("phone")) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) error = "Invalid phone number (10 digits required)";
    }
    return error;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (fieldName, itemName, value) => {
    const list = formData?.[fieldName] ? formData?.[fieldName] : [];
    if (value) {
      list.push({ label: itemName, value: value });
      setFormData({ ...formData, [fieldName]: list });
    } else {
      const result = list.filter((item) => item.label !== itemName);
      setFormData({ ...formData, [fieldName]: result });
    }
  };


  const handleFileUpload = (result) => {
    console.log("upload", result);
    if (result?.info?.secure_url) {
      setFormData((prev) => ({ ...prev, fileUrl: result.info.secure_url }));
      setUploadedFileName(result.info.original_filename); // Store file name
      toast.success("File uploaded successfully!");
    } else {
      toast.error("File upload failed!");
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
  
    let missingRequiredFields = [];
  
    jsonForm?.fields?.forEach((field) => {
      if (field?.required && !formData?.[field.fieldName]) {
        missingRequiredFields.push(field.label);
      }
    });
  
    if (missingRequiredFields.length > 0) {
      toast.error(`Please fill out required fields: ${missingRequiredFields.join(", ")}`);
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }
  
    try {
      const result = await db.insert(userResponses).values({
        jsonResponse: formData,
        createdAt: moment().format("DD/MM/YYYY"),
        formRef: formId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
  
      if (result) {
        formRef.reset();
        setUploadedImageUrl("");
        setUploadedFileName("");
        toast.success("Response Submitted Successfully!");
        router.push("/success");
      } else {
        toast.error("Failed to submit the response. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting form:", error);
      toast.error("Something went wrong");
    }
  };
  

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className="border rounded-md p-5 md:w-[720px]"
      data-theme={selectedTheme}
      style={{
        boxShadow: selectedStyle?.key === "boxshadow" && "5px 5px 0px black",
        border: selectedStyle?.key === "border" && selectedStyle.value,
      }}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h3 className="text-sm text-gray-500 mb-5 text-center">{jsonForm?.formHeading}</h3>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          {field?.fieldType === "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field.label}</label>
              <Select required={field?.required} onValueChange={(v) => handleSelectChange(field.fieldName, v)}>
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={field?.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field?.options?.map((item, idx) => (
                    <SelectItem key={idx} value={typeof item === "object" ? item.value : item}>
                      {typeof item === "object" ? item.label : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.fieldType === "radio" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field.label}</label>
              <RadioGroup required={field?.required}>
                {field?.options?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <RadioGroupItem value={item.label} id={item.label} onClick={() => handleSelectChange(field.fieldName, item.label)} />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.fieldType === "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              {field?.options?.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Checkbox onCheckedChange={(v) => handleCheckboxChange(field?.label, item.label ? item.label : item, v)} />
                  <h2>{item.label ? item.label : item}</h2>
                </div>
              ))}
            </div>
          ) : field.fieldType === "file" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field.label}</label>
          
              <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={handleFileUpload}>
                {({ open }) => (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        open();
                      }}
                    >
                      Upload File
                    </Button>
          
                    {uploadedFileName && <span className="text-sm text-gray-600">{uploadedFileName}</span>}
                  </div>
                )}
              </CldUploadWidget>
          
              {field?.required && !formData?.fileUrl && (
                <p className="text-red-500 text-xs mt-1">This file is required.</p>
              )}
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              <Input
                className="bg-transparent"
                type={field?.fieldType}
                placeholder={field?.placeholder}
                name={field?.fieldName}
                required={field?.required}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          )}

          {editable && (
            <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)} />
          )}
        </div>
      ))}

      {!enabledSignIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : isSignedIn && enabledSignIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : (
        <Button>
          <SignInButton mode="modal">Sign in before Submit</SignInButton>
        </Button>
      )}
    </form>
  );
};

export default FormUi;
