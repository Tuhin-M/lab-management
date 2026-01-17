import type { Plugin } from 'vite';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA6fm9EFlGw3PQrj9k4oFPaNGQGSdJUrAY';

interface ChatRequest {
    message: string;
    history?: { role: string; content: string }[];
    userRole?: string;
}

export function chatApiPlugin(): Plugin {
    return {
        name: 'chat-api-middleware',
        configureServer(server) {
            server.middlewares.use('/api/chat', async (req, res, next) => {
                if (req.method === 'OPTIONS') {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    res.statusCode = 204;
                    res.end();
                    return;
                }

                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Method not allowed' }));
                    return;
                }

                try {
                    // Read request body
                    let body = '';
                    await new Promise<void>((resolve) => {
                        req.on('data', (chunk) => { body += chunk; });
                        req.on('end', resolve);
                    });

                    const { message, history = [], userRole = 'user' }: ChatRequest = JSON.parse(body);

                    if (!message) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Message is required' }));
                        return;
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

                    // Build conversation for Gemini
                    const contents = [
                        { role: 'user', parts: [{ text: systemPrompt + '\n\nStart the conversation.' }] },
                        { role: 'model', parts: [{ text: "Hello! I'm your Ekitsa Assistant. How can I help you today?" }] },
                        ...history.map((msg) => ({
                            role: msg.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: msg.content }],
                        })),
                        { role: 'user', parts: [{ text: message }] },
                    ];

                    // Call Gemini API
                    const geminiResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
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
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'AI service error', details: errorText }));
                        return;
                    }

                    const geminiData = await geminiResponse.json();
                    const reply =
                        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
                        "I'm sorry, I couldn't generate a response. Please try again.";

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ reply }));
                } catch (error: any) {
                    console.error('Chat API error:', error);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
                }
            });
        },
    };
}
