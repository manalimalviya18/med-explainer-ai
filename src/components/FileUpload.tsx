import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  }, []);

  const validateAndSelectFile = (file: File) => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, image (JPG/PNG), or text file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB.",
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);
    toast({
      title: "File uploaded",
      description: `${file.name} has been selected successfully.`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const clearFile = () => {
    onFileSelect(null as any);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload Medical Report</h3>
          <p className="text-sm text-muted-foreground">
            Upload your medical report or prescription (PDF, Image, or Text file)
          </p>
        </div>

        {!selectedFile ? (
          <div
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
              ${isDragging 
                ? 'border-primary bg-accent/50' 
                : 'border-border hover:border-primary/50 hover:bg-accent/20'
              }
            `}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-accent rounded-full">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Drop your file here or{" "}
                    <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, JPG, PNG, and TXT files up to 20MB
                  </p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
