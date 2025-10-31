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

    // Build the user message with text and images
    const patientInfo: string[] = [];
    if (patientData.age) patientInfo.push(`- Age: ${patientData.age} years`);
    if (patientData.weight) patientInfo.push(`- Weight: ${patientData.weight} kg`);
    if (patientData.gender) patientInfo.push(`- Gender: ${patientData.gender}`);
    
    const language = patientData.language || "english";
    const description = patientData.description || "";
    
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
    
    const messageContent: any[] = [
      {
        type: "text",
        text: `${patientInfoText}Please analyze the uploaded medical reports and prescriptions. Provide a comprehensive medical explanation in ${language} language.`
      }
    ];

    // Add all uploaded files as images
    if (files && files.length > 0) {
      for (const file of files) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: file.data // base64 data URL
          }
        });
      }
    }

    const systemPrompt = `You are a professional medical report interpreter and health explainer AI.
Your purpose is to analyze uploaded medical reports and describe them in a clear, empathetic, and simple manner.
Your response must always be structured, formatted, and easy for non-medical users to understand.

IMPORTANT: Respond in ${language} language ONLY.

🎯 Core Objectives:
1. Analyze the lab report (values, remarks, abnormalities).
2. Correlate findings with the user's described symptoms or problem.
3. Summarize normal and abnormal results separately.
4. Provide simplified explanations in the user's selected language.
5. Suggest when to consult a doctor (never prescribe medication).
6. Explain listed medicines in simple terms (if provided).
7. Maintain factual accuracy, clarity, and empathy.

Structure your response as a JSON object with these fields:
{
  "patientSummary": {
    "age": "from input or 'Not provided'",
    "gender": "from input or 'Not provided'",
    "weight": "from input or 'Not provided'",
    "description": "from input or 'No specific symptoms mentioned'"
  },
  "reportAnalysis": {
    "normalParameters": ["list of normal findings with brief explanations"],
    "abnormalParameters": ["list of abnormal findings with simple explanations"]
  },
  "correlation": "Summarize how report findings relate to the user's symptoms. Keep tone neutral, helpful, and non-alarming.",
  "medicines": [
    {"name": "Medicine name", "purpose": "Brief explanation of what it does (e.g., 'antibiotic to fight infection')"}
  ],
  "doctorAdvice": ["When to revisit doctor", "What symptoms to monitor", "General care advice (hydration, rest, etc.)"],
  "disclaimer": "⚠️ This analysis is for educational purposes only. Please consult a qualified doctor for medical decisions."
}

Formatting Rules:
- Use emojis for clarity (💧😴🍎🩺🧼🙏)
- Keep explanations under 2-3 lines per point
- Use clear, short sentences
- Maintain a warm, human tone
- Never include system or JSON references in output
- Keep response under 400 words total`;

    // Call Lovable AI Gateway
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

    console.log("AI response received");

    // Try to parse JSON response
    let analysisResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       aiResponse.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      analysisResult = JSON.parse(jsonString);
      
      // Log the parsed result for debugging
      console.log("Successfully parsed AI response");
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw AI response:", aiResponse);
      
      // Fallback: return a properly structured response
      analysisResult = {
        patientSummary: {
          age: patientData.age || "Not provided",
          gender: patientData.gender || "Not provided",
          weight: patientData.weight || "Not provided",
          description: patientData.description || "No specific symptoms mentioned"
        },
        reportAnalysis: {
          normalParameters: [],
          abnormalParameters: ["Unable to parse report automatically. Please review the analysis manually."]
        },
        correlation: "Analysis could not be completed. Please consult with your healthcare provider.",
        medicines: [],
        doctorAdvice: ["Please consult with your healthcare provider for a detailed explanation of your report."],
        disclaimer: "⚠️ This analysis is for educational purposes only. Please consult a qualified doctor for medical decisions."
      };
    }

    return new Response(JSON.stringify(analysisResult), {
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
