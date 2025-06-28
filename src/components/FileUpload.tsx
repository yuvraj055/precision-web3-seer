
import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const solFile = files.find(file => file.name.endsWith('.sol'));
    
    if (!solFile) {
      setError("Please upload a Solidity (.sol) file");
      return;
    }

    if (solFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size must be less than 5MB");
      return;
    }

    onFileUpload(solFile);
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sol')) {
      setError("Please upload a Solidity (.sol) file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    onFileUpload(file);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Smart Contract</h3>
        <p className="text-muted-foreground">
          Upload your Solidity (.sol) file for comprehensive security analysis
        </p>
      </div>

      <Card
        className={`relative p-8 border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          type="file"
          accept=".sol"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium mb-1">
              Drop your Solidity file here
            </p>
            <p className="text-muted-foreground text-sm">
              or click to browse files
            </p>
          </div>
          
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </Card>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Supported formats: .sol • Max size: 5MB
      </div>
    </div>
  );
};
