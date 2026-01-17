interface Env {
    GEMINI_API_KEY: string;
}

interface ChatRequest {
    message: string;
    history?: { role: string; content: string }[];
    userRole?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body: ChatRequest = await request.json();
        const { message, history = [], userRole = 'user' } = body;

        if (!message) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key not configured' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Build system prompt based on user role
        let systemPrompt = `You are Ekitsa Assistant, a helpful AI for a medical lab and healthcare platform called Ekitsa. 
Be concise, friendly, and professional. Help users with:
- Finding labs and tests
- Booking appointments
- Understanding test results
- General health queries

`;

        if (userRole === 'lab_owner') {
            systemPrompt += `The user is a LAB OWNER. Help them with:
- Managing their lab listings
- Understanding booking analytics
- Adding new tests to their lab
- Marketing and growth tips for their lab business
- Handling patient inquiries efficiently`;
        } else if (userRole === 'doctor') {
            systemPrompt += `The user is a DOCTOR. Help them with:
- Patient referrals
- Lab test recommendations
- Understanding diagnostic reports
- Appointment management`;
        } else {
            systemPrompt += `The user is a PATIENT. Help them with:
- Finding nearby labs
- Understanding which tests they might need
- Booking test appointments
- Preparing for lab tests (fasting, etc.)
- Understanding their health records`;
        }

        // Build conversation history for Gemini
        const contents = [
            { role: 'user', parts: [{ text: systemPrompt + '\n\nStart the conversation.' }] },
            { role: 'model', parts: [{ text: 'Hello! I\'m your Ekitsa Assistant. How can I help you today?' }] },
            ...history.map((msg) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
        ];

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        );

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error('Gemini API error:', errorText);
            return new Response(JSON.stringify({ error: 'AI service error', details: errorText }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const geminiData = await geminiResponse.json();
        const reply =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm sorry, I couldn't generate a response. Please try again.";

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Chat function error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
};
