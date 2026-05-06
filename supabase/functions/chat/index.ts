// Lovable AI chatbot for Deepak's portfolio
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "DeepBot", a friendly AI assistant embedded on Deepak Sharma's portfolio website. Answer questions about Deepak concisely and helpfully (2-4 sentences usually). If asked about something you don't know, say so and suggest contacting Deepak directly.

ABOUT DEEPAK:
- Name: Deepak Sharma
- Role: Aspiring Data Analyst & AI Engineer
- Education: B.Tech in AI & Data Science, expected 2027, CGPA 8.6/10
- Tagline: "Turning Data into Decisions"
- Location: India
- Email: ds6739820@gmail.com
- Phone: +91 6378875936
- GitHub: https://github.com/Deepaksharma0011
- Available for: internships, freelance projects, full-time opportunities

SKILLS:
Python, SQL, Excel, Power BI, Tableau, Pandas, NumPy, Matplotlib, Seaborn, Machine Learning, Deep Learning, TensorFlow, Keras, OpenCV, MediaPipe, CNN, EDA, Data Visualization.

PROJECTS:
1. Hand Gesture Controller — Real-time hand gesture recognition with OpenCV + MediaPipe for touch-free human-computer interaction. Repo: https://github.com/Deepaksharma0011/hand-gesture-controller
2. Face Emotion Detection — Deep learning CNN with TensorFlow detecting emotions from facial expressions in real time. Use cases: customer experience, mental wellness analytics. Repo: https://github.com/Deepaksharma0011/Face-Emotion-Detection
3. Airline Delay Analysis — End-to-end EDA on large airline datasets to uncover delay patterns and operational inefficiencies. Repo: https://github.com/Deepaksharma0011/Airline-Delay-Analysis

CERTIFICATIONS:
- Data Analyst Job (Deloitte)
- Tableau And PowerBI (Upflairs)
- SQL Advance (HackerRank)

FREELANCE: Yes, Deepak is open to freelance work — recruiters can reach out via email.

Keep replies friendly, professional, and brief. Use plain text (no markdown headings).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(messages ?? []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
