import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Activity, Search, Pill, Stethoscope, AlertCircle, ClipboardList } from "lucide-react";

interface AnalysisResultProps {
  result: {
    patientSummary: {
      age: string;
      gender: string;
      weight: string;
      description: string;
    };
    reportAnalysis: {
      normalParameters: string[];
      abnormalParameters: string[];
    };
    correlation: string;
    medicines: Array<{ name: string; purpose: string }>;
    doctorAdvice: string[];
    disclaimer: string;
  };
}

export const AnalysisResult = ({ result }: AnalysisResultProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">📋 Medical Report Summary</h2>
      </div>

      <Separator />

      {/* Patient Summary */}
      <Card className="p-6 bg-gradient-to-br from-accent/30 to-background border-primary/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">👶 Patient Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            {result.patientSummary.age !== "Not provided" && (
              <p><strong>Age:</strong> {result.patientSummary.age}</p>
            )}
            {result.patientSummary.gender !== "Not provided" && (
              <p><strong>Gender:</strong> {result.patientSummary.gender}</p>
            )}
            {result.patientSummary.weight !== "Not provided" && (
              <p><strong>Weight:</strong> {result.patientSummary.weight}</p>
            )}
            {result.patientSummary.description !== "No specific symptoms mentioned" && (
              <p><strong>Problem/Description:</strong> {result.patientSummary.description}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Report Analysis - Accordion */}
      <Accordion type="multiple" defaultValue={["analysis", "medicines", "advice"]} className="space-y-4">
        {/* Report Analysis */}
        <AccordionItem value="analysis" className="border rounded-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">🩸 Report Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {/* Normal Parameters */}
              {result.reportAnalysis.normalParameters && result.reportAnalysis.normalParameters.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                    ✅ Normal Parameters
                  </h4>
                  <ul className="space-y-2">
                    {result.reportAnalysis.normalParameters.map((param, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Abnormal Parameters */}
              {result.reportAnalysis.abnormalParameters && result.reportAnalysis.abnormalParameters.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    ⚠️ Abnormal Parameters
                  </h4>
                  <ul className="space-y-2">
                    {result.reportAnalysis.abnormalParameters.map((param, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                        <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Correlation */}
        {result.correlation && (
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">🔍 Possible Cause (Non-Diagnostic)</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.correlation}</p>
            </div>
          </Card>
        )}

        {/* Medicines */}
        {result.medicines && result.medicines.length > 0 && (
          <AccordionItem value="medicines" className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">💊 Medicine Explanation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {result.medicines.map((med, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{med.purpose}</p>
                      </div>
                    </div>
                    {index < result.medicines.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Doctor Advice */}
        {result.doctorAdvice && result.doctorAdvice.length > 0 && (
          <AccordionItem value="advice" className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">🩺 Doctor Advice</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ul className="space-y-2">
                {result.doctorAdvice.map((advice, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span className="text-sm leading-relaxed">{advice}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Separator />

      {/* Disclaimer */}
      <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-sm leading-relaxed ml-2 text-amber-800 dark:text-amber-300">
          {result.disclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
};
