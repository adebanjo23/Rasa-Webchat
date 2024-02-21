document.addEventListener('DOMContentLoaded', function() {
    const toggleChatButton = document.getElementById('toggle-chat');
    const chatContainer = document.getElementById('chat-container');
    const toggleIcon = toggleChatButton.querySelector('i');

    toggleChatButton.addEventListener('click', function() {
        chatContainer.classList.toggle('show');
        // Check if the chat container is shown and toggle the icon
        if (chatContainer.classList.contains('show')) {
            toggleIcon.classList.remove('fa-comments');
            toggleIcon.classList.add('fa-times');
        } else {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-comments');
        }
    });

    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            let userText = this.value;
            if (userText) {
                displayMessage(userText, 'user');
                if (config.useSocket) {
                    sendMessageToRasaSocket(userText);
                } else {
                    sendMessageToRasaRest(userText);
                }
                this.value = ''; // Clear input after sending
            }
        }
    });
    document.getElementById('send-button').addEventListener('click', function() {
        let userInputField = document.getElementById('userInput');
        let userText = userInputField.value;
        if (userText) {
            displayMessage(userText, 'user');
            if (config.useSocket) {
                sendMessageToRasaSocket(userText);
            } else {
                sendMessageToRasaRest(userText);
            }
            userInputField.value = ''; // Clear input after sending
        }
    });
});


function displayMessage(text, sender) {
    const chatbox = document.getElementById('chatbox');

    // Create the message bubble
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;

    // Append the message bubble to the chatbox
    chatbox.appendChild(msgDiv);

    // Scroll to the bottom of the chatbox to show latest message
    chatbox.scrollTop = chatbox.scrollHeight;
}




async function sendMessageToRasaRest(message) {
    const response = await fetch(config.restEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: 'user', message: message }),
    });
    const responseData = await response.json();
    if (responseData && responseData.length > 0) {
        responseData.forEach((msg) => {
            displayMessage(msg.text, 'bot');
        });
    }
}

function sendMessageToRasaSocket(message) {
    if (!window.socket) {
        window.socket = io(config.socketEndpoint);
        window.socket.on('bot_uttered', function(data) {
            displayMessage(data.text, 'bot');
        });
    }
    window.socket.emit('user_uttered', { message: message, sender: 'user' });
}
