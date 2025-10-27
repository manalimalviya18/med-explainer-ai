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
    
    let patientInfoText = "";
    if (patientInfo.length > 0) {
      patientInfoText = `Patient Information:\n${patientInfo.join('\n')}\n\n`;
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

    const systemPrompt = `You are a professional and empathetic medical assistant AI.
Your task is to analyze medical reports (blood tests, prescriptions, urine tests, etc.) and explain them in clear, simple, non-technical language in the user's preferred language.

IMPORTANT: Respond in ${language} language ONLY.

Your Key Objectives:
1. Identify main findings in the report (diagnosis, abnormal values, infection signs, etc.)
2. Explain what each finding means in simple terms - like talking to a parent, not a doctor
3. Describe each prescribed medicine's purpose and how it helps
4. Add care advice (hydration, rest, when to revisit doctor)
5. Use a friendly, reassuring, and supportive tone
6. Never prescribe new medicines or treatments - only explain what's in the report
7. Always include a medical disclaimer at the end

Structure your response as a JSON object with these fields:
{
  "summary": "Brief overview of the patient's condition",
  "findings": ["Key finding 1", "Key finding 2", ...],
  "medications": [
    {"name": "Medicine name", "purpose": "What it does"},
    ...
  ],
  "careAdvice": ["Advice 1", "Advice 2", ...],
  "reassurance": "Comforting message about the condition"
}

Use emojis appropriately to make it more friendly and readable.
Write in a warm, caring tone that reduces anxiety while being informative.`;

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
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Fallback: return the raw response as summary
      analysisResult = {
        summary: aiResponse,
        findings: [],
        medications: [],
        careAdvice: [],
        reassurance: "Please consult with your healthcare provider for personalized medical advice."
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
