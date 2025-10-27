import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, Pill, Lightbulb, AlertCircle } from "lucide-react";
import { useState } from "react";

interface AnalysisResultProps {
  result: {
    overallSummary: string;
    keyFindings: Array<{ title: string; details: string }>;
    medications: Array<{ name: string; purpose: string }>;
    careRecommendations: string[];
    medicalDisclaimer: string;
  };
}

const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-left">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-2">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

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

      {/* Key Findings - Collapsible */}
      {result.keyFindings && result.keyFindings.length > 0 && (
        <CollapsibleSection title="🔍 Key Findings" icon={FileText} defaultOpen={true}>
          <div className="space-y-6">
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
        </CollapsibleSection>
      )}

      {/* Medications - Collapsible */}
      {result.medications && result.medications.length > 0 && (
        <CollapsibleSection title="💊 Prescribed Medications" icon={Pill} defaultOpen={true}>
          <div className="space-y-4">
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
        </CollapsibleSection>
      )}

      {/* Care Recommendations - Collapsible */}
      {result.careRecommendations && result.careRecommendations.length > 0 && (
        <CollapsibleSection title="💡 Care Recommendations" icon={Lightbulb} defaultOpen={true}>
          <ul className="space-y-3">
            {result.careRecommendations.map((advice, index) => (
              <li key={index} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-secondary font-bold mt-0.5">•</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

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
