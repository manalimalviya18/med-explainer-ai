import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Pill, Lightbulb, AlertCircle } from "lucide-react";

interface AnalysisResultProps {
  result: {
    overallSummary: string;
    keyFindings: Array<{ title: string; details: string }>;
    medications: Array<{ name: string; purpose: string }>;
    careRecommendations: string[];
    medicalDisclaimer: string;
  };
}


export const AnalysisResult = ({ result }: AnalysisResultProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Overall Summary - Always visible */}
      <Card className="p-6 bg-gradient-to-br from-accent/30 to-background border-primary/20">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">📋 Overall Summary</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {result.overallSummary}
          </p>
        </div>
      </Card>

      {/* Collapsible Sections using Accordion */}
      <Accordion type="multiple" defaultValue={["findings", "medications", "recommendations"]} className="space-y-4">
        {/* Key Findings */}
        {result.keyFindings && result.keyFindings.length > 0 && (
          <AccordionItem value="findings" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-accent/50 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">🔍 Key Findings</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6 pt-2">
                {result.keyFindings.map((finding, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-base">{finding.title}</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-4 border-l-2 border-primary/20">
                      {finding.details}
                    </div>
                    {index < result.keyFindings.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Medications */}
        {result.medications && result.medications.length > 0 && (
          <AccordionItem value="medications" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-accent/50 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">💊 Prescribed Medications</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                {result.medications.map((med, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-base">{med.name}</p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {med.purpose}
                        </p>
                      </div>
                    </div>
                    {index < result.medications.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Care Recommendations */}
        {result.careRecommendations && result.careRecommendations.length > 0 && (
          <AccordionItem value="recommendations" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-accent/50 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">💡 Care Recommendations</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ul className="space-y-3 pt-2">
                {result.careRecommendations.map((advice, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Medical Disclaimer - Always visible */}
      <Alert className="border-muted">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription className="text-xs text-muted-foreground ml-2 leading-relaxed">
          {result.medicalDisclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
};
