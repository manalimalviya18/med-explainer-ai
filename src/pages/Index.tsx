import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FileUpload } from "@/components/FileUpload";
import { PatientForm, PatientData } from "@/components/PatientForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    weight: "",
    gender: "",
    language: "english"
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Missing file",
        description: "Please upload at least one medical report.",
        variant: "destructive",
      });
      return;
    }

    if (!patientData.age || !patientData.weight || !patientData.gender) {
      toast({
        title: "Missing information",
        description: "Please fill in all patient information fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert files to base64 for API transmission
      const filePromises = selectedFiles.map(async (file) => {
        return new Promise<{ name: string; type: string; data: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            data: reader.result as string
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const filesData = await Promise.all(filePromises);

      // Call the edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-medical-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientData,
            files: filesData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze report");
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete",
        description: "Your medical report has been analyzed successfully.",
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setAnalysisResult(null);
    setPatientData({
      age: "",
      weight: "",
      gender: "",
      language: "english"
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} />
      
      {showForm && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Upload Your Report</h2>
              <p className="text-muted-foreground">
                Let AI help you understand your medical information
              </p>
            </div>

            <FileUpload 
              selectedFiles={selectedFiles} 
              onFilesSelect={setSelectedFiles}
            />

            <PatientForm 
              data={patientData} 
              onChange={setPatientData}
            />

            <div className="flex justify-center pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Report
                  </>
                )}
              </Button>
            </div>

            {analysisResult && (
              <div id="results" className="pt-12">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-bold">Your Report Explained</h2>
                  <p className="text-muted-foreground">
                    Clear, simple explanations in your preferred language
                  </p>
                </div>

                <AnalysisResult result={analysisResult} />

                <div className="flex justify-center pt-8">
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    Analyze Another Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
