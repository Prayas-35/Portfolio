"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  currentFiles?: string[]; // URLs of current files
  onChange: (files: File[]) => void;
  onRemove?: (index: number) => void;
  preview?: boolean;
  required?: boolean;
  folder?: string;
}

export default function FileUpload({
  id,
  label,
  accept = "image/*",
  multiple = false,
  currentFiles = [],
  onChange,
  onRemove,
  preview = true,
  required = false,
}: FileUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    onChange(files);

    // Create preview URLs
    if (preview) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleRemoveNew = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExisting = (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white">
        {label} {required && "*"}
      </Label>
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        required={required && currentFiles.length === 0 && previewUrls.length === 0}
        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
      />

      {/* Preview existing files */}
      {preview && currentFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {currentFiles.map((url, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-700"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveExisting(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                ✕
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg">
                Current
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview new files */}
      {preview && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className="relative group">
              <img
                src={url}
                alt={`New preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-green-500"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveNew(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                ✕
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-xs p-1 rounded-b-lg">
                New
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
