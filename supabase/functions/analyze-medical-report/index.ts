import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData, files } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing medical report for patient:", patientData);
    console.log("Number of files:", files?.length || 0);

    const language = patientData.language || "english";
    const description = patientData.description || "";

    // Build patient info once for all reports
    const patientInfo: string[] = [];
    if (patientData.age) patientInfo.push(`- Age: ${patientData.age} years`);
    if (patientData.weight) patientInfo.push(`- Weight: ${patientData.weight} kg`);
    if (patientData.gender) patientInfo.push(`- Gender: ${patientData.gender}`);
    
    let patientInfoText = "";
    if (patientInfo.length > 0 || description) {
      patientInfoText = "Patient Information:\n";
      if (patientInfo.length > 0) {
        patientInfoText += patientInfo.join('\n') + '\n';
      }
      if (description) {
        patientInfoText += `- Problem/Symptoms: ${description}\n`;
      }
      patientInfoText += '\n';
    }

    // Analyze each report separately
    const analysisResults = [];
    
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Analyzing report ${i + 1}/${files.length}: ${file.name}`);

        const messageContent: any[] = [
          {
            type: "text",
            text: `${patientInfoText}This is report ${i + 1} of ${files.length}. Report name: ${file.name}\n\nPlease analyze this specific medical report and provide a comprehensive medical explanation in ${language} language.`
          },
          {
            type: "image_url",
            image_url: {
              url: file.data
            }
          }
        ];

    const systemPrompt = `You are a professional medical report interpreter and health explainer AI.
Your purpose is to analyze uploaded medical reports and describe them in a clear, empathetic, and simple manner.
Your response must always be structured, formatted, and easy for non-medical users to understand.

IMPORTANT: Respond in ${language} language ONLY.

🎯 Core Objectives:
1. Analyze this specific lab report (values, remarks, abnormalities).
2. Correlate findings with the user's described symptoms or problem.
3. Summarize normal and abnormal results separately.
4. Provide simplified explanations in the user's selected language.
5. Suggest when to consult a doctor (never prescribe medication).
6. Explain listed medicines in simple terms (if provided in this report).
7. Maintain factual accuracy, clarity, and empathy.

Structure your response as a JSON object with these fields:
{
  "reportName": "Name or type of this report (e.g., Blood Test, CBC Report, Urine Analysis)",
  "reportAnalysis": {
    "normalParameters": ["list of normal findings with brief explanations"],
    "abnormalParameters": ["list of abnormal findings with simple explanations"]
  },
  "keyFindings": "Brief 2-3 sentence summary of the most important findings from THIS report",
  "correlation": "How this report's findings relate to the symptoms (if applicable)",
  "medicines": [
    {"name": "Medicine name", "purpose": "Brief explanation"}
  ],
  "recommendations": ["Specific advice based on THIS report's findings"]
}

Formatting Rules:
- Use emojis for clarity (💧😴🍎🩺🧼🙏)
- Keep explanations under 2-3 lines per point
- Focus ONLY on THIS specific report
- Use clear, short sentences
- Maintain a warm, human tone`;

        // Call Lovable AI Gateway for this specific report
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: messageContent }
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("AI gateway error:", response.status, errorText);
          
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          if (response.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          throw new Error(`AI gateway error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        console.log(`AI response received for report ${i + 1}`);

        // Try to parse JSON response for this report
        let reportResult;
        try {
          const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/```\n([\s\S]*?)\n```/);
          const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
          reportResult = JSON.parse(jsonString);
          reportResult.fileName = file.name; // Add filename to result
          console.log(`Successfully parsed AI response for report ${i + 1}`);
        } catch (parseError) {
          console.error(`Failed to parse AI response for report ${i + 1}:`, parseError);
          reportResult = {
            fileName: file.name,
            reportName: file.name,
            reportAnalysis: {
              normalParameters: [],
              abnormalParameters: ["Unable to parse this report automatically."]
            },
            keyFindings: "Analysis could not be completed for this report.",
            correlation: "Please consult with your healthcare provider.",
            medicines: [],
            recommendations: ["Please consult with your healthcare provider for a detailed explanation."]
          };
        }
        
        analysisResults.push(reportResult);
      }
    }

    // Create comprehensive response with patient info and all reports
    const finalResponse = {
      patientSummary: {
        age: patientData.age || "Not provided",
        gender: patientData.gender || "Not provided",
        weight: patientData.weight || "Not provided",
        description: description || "No specific symptoms mentioned"
      },
      reports: analysisResults,
      overallAdvice: [
        "Keep all reports for future reference",
        "Consult with your healthcare provider for comprehensive treatment",
        "Follow prescribed medications and care advice"
      ],
      disclaimer: "⚠️ This analysis is for educational purposes only. Please consult a qualified doctor for medical decisions."
    };

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-medical-report:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
