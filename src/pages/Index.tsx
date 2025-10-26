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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if (!selectedFile) {
      toast({
        title: "Missing file",
        description: "Please upload a medical report first.",
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

    // TODO: Implement AI analysis with Lovable Cloud
    // Simulating analysis for now
    setTimeout(() => {
      const mockResult = {
        summary: "Based on the uploaded report, this appears to be a routine blood test showing some elevated white blood cell count, which typically indicates a viral infection in the body.",
        findings: [
          "White Blood Cell (WBC) count is slightly elevated at 12,500 cells/µL (normal range: 4,000-11,000)",
          "All other blood parameters are within normal ranges",
          "No signs of bacterial infection or serious complications"
        ],
        medications: [
          {
            name: "Cefixime + Ofloxacin",
            purpose: "Antibiotic combination to prevent bacterial complications and support recovery"
          },
          {
            name: "Montelukast + Levocetirizine",
            purpose: "Helps reduce inflammation and allergic symptoms like cough and congestion"
          },
          {
            name: "Mefenamic Acid + Paracetamol",
            purpose: "Reduces fever and relieves pain or body aches"
          }
        ],
        careAdvice: [
          "Ensure plenty of fluids throughout the day to help the body fight the infection",
          "Light, easily digestible meals are recommended",
          "Adequate rest is important for recovery",
          "Monitor temperature regularly - contact doctor if fever exceeds 104°F",
          "Watch for signs of dehydration or extreme lethargy"
        ],
        reassurance: "This is a common viral infection that typically resolves within a few days with proper medication and care. There's no need to worry, but do follow the prescribed treatment and monitor for any concerning symptoms."
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your medical report has been analyzed successfully.",
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedFile(null);
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
              selectedFile={selectedFile} 
              onFileSelect={setSelectedFile}
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
