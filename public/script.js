const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatOutput = document.getElementById('chat-output');

async function fetchChatGPTResponse(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, something went wrong. Please try again later.';
    }
}

sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'user-message';
    userMessageElement.textContent = message;
    chatOutput.appendChild(userMessageElement);

    // Clear input field
    userInput.value = '';

    // Fetch response from ChatGPT
    const response = await fetchChatGPTResponse(message);

    // Display ChatGPT response
    const botMessageElement = document.createElement('div');
    botMessageElement.className = 'bot-message';
    botMessageElement.textContent = response;
    chatOutput.appendChild(botMessageElement);

    // Scroll to the bottom
    //Ameesh
    chatOutput.scrollTop = chatOutput.scrollHeight;
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
