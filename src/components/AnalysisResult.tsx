import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Activity, FileText, Pill, Lightbulb, AlertCircle, ClipboardList } from "lucide-react";

interface ReportAnalysis {
  fileName: string;
  reportName: string;
  reportAnalysis: {
    normalParameters: string[];
    abnormalParameters: string[];
  };
  keyFindings: string;
  correlation?: string;
  medicines: Array<{ name: string; purpose: string }>;
  recommendations: string[];
}

interface AnalysisResultProps {
  result: {
    patientSummary: {
      age: string;
      gender: string;
      weight: string;
      description: string;
    };
    reports: ReportAnalysis[];
    overallAdvice: string[];
    disclaimer: string;
  };
}

export const AnalysisResult = ({ result }: AnalysisResultProps) => {
  // Safety check
  if (!result || !result.patientSummary || !result.reports) {
    return (
      <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-sm leading-relaxed ml-2 text-amber-800 dark:text-amber-300">
          Unable to display analysis results. Please try analyzing the report again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">📋 Medical Report Analysis</h2>
        <p className="text-muted-foreground mt-2">{result.reports.length} {result.reports.length === 1 ? 'Report' : 'Reports'} Analyzed</p>
      </div>

      <Separator />

      {/* Patient Summary */}
      {result.patientSummary && (
        <Card className="p-6 bg-gradient-to-br from-accent/30 to-background border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">👶 Patient Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              {result.patientSummary.age && result.patientSummary.age !== "Not provided" && (
                <p><strong>Age:</strong> {result.patientSummary.age}</p>
              )}
              {result.patientSummary.gender && result.patientSummary.gender !== "Not provided" && (
                <p><strong>Gender:</strong> {result.patientSummary.gender}</p>
              )}
              {result.patientSummary.weight && result.patientSummary.weight !== "Not provided" && (
                <p><strong>Weight:</strong> {result.patientSummary.weight}</p>
              )}
              {result.patientSummary.description && result.patientSummary.description !== "No specific symptoms mentioned" && (
                <p><strong>Problem/Description:</strong> {result.patientSummary.description}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Individual Report Analyses */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Individual Report Analysis
        </h3>

        {result.reports.map((report, reportIndex) => (
          <Card key={reportIndex} className="p-6 border-2">
            <div className="space-y-4">
              {/* Report Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b">
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    📄 Report {reportIndex + 1}: {report.reportName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{report.fileName}</p>
                </div>
              </div>

              {/* Key Findings */}
              {report.keyFindings && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-sm leading-relaxed ml-2">
                    <strong>Key Findings:</strong> {report.keyFindings}
                  </AlertDescription>
                </Alert>
              )}

              {/* Report Analysis Accordion */}
              <Accordion type="multiple" defaultValue={[`analysis-${reportIndex}`, `medicines-${reportIndex}`]} className="space-y-3">
                {/* Parameters Analysis */}
                <AccordionItem value={`analysis-${reportIndex}`} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="font-semibold">🩸 Detailed Analysis</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {/* Normal Parameters */}
                      {report.reportAnalysis.normalParameters && report.reportAnalysis.normalParameters.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                            ✅ Normal Parameters
                          </h5>
                          <ul className="space-y-2">
                            {report.reportAnalysis.normalParameters.map((param, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                                <span>{param}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Abnormal Parameters */}
                      {report.reportAnalysis.abnormalParameters && report.reportAnalysis.abnormalParameters.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                            ⚠️ Abnormal Parameters
                          </h5>
                          <ul className="space-y-2">
                            {report.reportAnalysis.abnormalParameters.map((param, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
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
                {report.correlation && (
                  <div className="p-4 bg-accent/30 rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      🔍 Clinical Correlation
                    </h5>
                    <p className="text-sm text-muted-foreground">{report.correlation}</p>
                  </div>
                )}

                {/* Medicines */}
                {report.medicines && report.medicines.length > 0 && (
                  <AccordionItem value={`medicines-${reportIndex}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-primary" />
                        <span className="font-semibold">💊 Prescribed Medications</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {report.medicines.map((med, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium">{med.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">{med.purpose}</p>
                              </div>
                            </div>
                            {idx < report.medicines.length - 1 && <Separator className="mt-2" />}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Recommendations */}
                {report.recommendations && report.recommendations.length > 0 && (
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      💡 Recommendations
                    </h5>
                    <ul className="space-y-1">
                      {report.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-secondary font-bold mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion>
            </div>
          </Card>
        ))}
      </div>

      {/* Overall Advice */}
      {result.overallAdvice && result.overallAdvice.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-secondary/20 to-background border-secondary/30">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-secondary" />
              🩺 Overall Healthcare Advice
            </h3>
            <ul className="space-y-2">
              {result.overallAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-secondary font-bold mt-0.5">•</span>
                  <span className="text-sm leading-relaxed">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

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
