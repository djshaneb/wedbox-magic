import { Upload } from "lucide-react";

interface EmptyImageUploadProps {
  inputId: string;
}

export const EmptyImageUpload = ({ inputId }: EmptyImageUploadProps) => (
  <label
    htmlFor={inputId}
    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-wedding-pink transition-colors bg-gray-50 hover:bg-gray-100"
  >
    <Upload className="h-12 w-12 text-wedding-pink mb-2" />
    <span className="text-sm text-gray-500">Upload wedding photo</span>
  </label>
);