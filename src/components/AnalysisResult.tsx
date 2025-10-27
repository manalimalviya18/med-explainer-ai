import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, Heart, Pill, Lightbulb, Shield } from "lucide-react";

interface AnalysisResultProps {
  result: {
    summary: string;
    findings: string[];
    medications: Array<{ name: string; purpose: string }>;
    careAdvice: string[];
    reassurance: string;
  };
}

export const AnalysisResult = ({ result }: AnalysisResultProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-accent/30 to-background border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">Analysis Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </Card>

      {/* Key Findings */}
      {result.findings && result.findings.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Key Findings</h3>
            </div>
            <div className="space-y-3">
              {result.findings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Medications */}
      {result.medications && result.medications.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Prescribed Medications</h3>
            </div>
            <div className="space-y-4">
              {result.medications.map((med, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{med.purpose}</p>
                    </div>
                  </div>
                  {index < result.medications.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Care Advice */}
      {result.careAdvice && result.careAdvice.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Care Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {result.careAdvice.map((advice, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-secondary font-bold mt-0.5">•</span>
                  <span className="text-sm leading-relaxed">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Reassurance */}
      <Alert className="border-secondary/50 bg-secondary/5">
        <Shield className="w-4 h-4 text-secondary" />
        <AlertDescription className="text-sm leading-relaxed ml-2">
          {result.reassurance}
        </AlertDescription>
      </Alert>

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription className="text-xs text-muted-foreground ml-2">
          <strong>Medical Disclaimer:</strong> This explanation is for informational purposes only and is not a 
          substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare 
          provider for medical concerns.
        </AlertDescription>
      </Alert>
    </div>
  );
};
