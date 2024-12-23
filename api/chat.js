const fetch = require('node-fetch');

module.exports = async (req, res) => {
    console.log('Request received:', req.method, req.body);

    if (req.method !== 'POST') {
        console.error('Invalid request method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        console.error('Missing "message" in request body:', req.body);
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error('OpenAI API key not configured');
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        console.log('Sending request to OpenAI API with message:', message);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
            }),
        });

        console.log('Response received from OpenAI API:', response.status);

        const data = await response.json();
        console.log('OpenAI API Response Data:', data);

        if (!response.ok) {
            console.error('OpenAI API Error:', data.error || 'Unknown error');
            return res.status(response.status).json({ error: data.error.message || 'Error from OpenAI API' });
        }

        const reply = data.choices[0].message.content.trim();
        console.log('Reply generated:', reply);

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Unexpected Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
