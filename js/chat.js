let appConfig = {};
let url = "http://192.168.20.95:32091/public/spider/hello";

async function fetchConfig() {
    try {
    console.log(url)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const configData = await response.json();

        console.log(configData)

        // Update the appConfig variable with fetched details
        appConfig = {
            interface: configData.interface,
            restEndpoint: configData.rest_endpoint,
            socketEndpoint: "http://localhost:8000/",
            username: configData.randuser
        };
    } catch (error) {
        console.error('Failed to fetch configuration:', error);
    }
}

fetchConfig();



import { processText } from './textProcessing.js';

document.addEventListener("DOMContentLoaded", function () {
  const toggleChatButton = document.getElementById("toggle-chat");
  const chatContainer = document.getElementById("chat-container");
  const toggleIcon = toggleChatButton.querySelector("i");

  toggleChatButton.addEventListener("click", function () {
    chatContainer.classList.toggle("show");
    // Check if the chat container is shown and toggle the icon
    if (chatContainer.classList.contains("show")) {
      toggleIcon.classList.remove("fa-comments");
      toggleIcon.classList.add("fa-times");
    } else {
      toggleIcon.classList.remove("fa-times");
      toggleIcon.classList.add("fa-comments");
    }
  });


  document
    .getElementById("userInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        let userText = this.value;
        if (userText) {
          displayMessage(userText, "user");
          if (appConfig.interface == "socketio") {
            sendMessageToRasaSocket(userText);
          } else if (appConfig.interface == "rest") {
            sendMessageToRasaRest(userText);
          } else {
            displayMessage("Interface not set correctly", null, "system");
          }
          this.value = "";
        }
      }
    });
  document.getElementById("send-button").addEventListener("click", function () {
    let userInputField = document.getElementById("userInput");
    let userText = userInputField.value;
    if (userText) {
      displayMessage(userText, "user");
      if (appConfig.interface == "socketio") {
        sendMessageToRasaSocket(userText);
      } else if (appConfig.interface == "rest") {
        sendMessageToRasaRest(userText);
      } else {
        displayMessage("Interface not set correctly", null, "system");
      }
      userInputField.value = "";
    }
  });
});

function displayMessage(text, buttons, sender) {
  const chatbox = document.getElementById("chatbox");

  // Create message container
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);


  // Process text to convert URLs and [b] tags
  text = processText(text);

  // Use innerHTML to render the modified text with HTML tags
  msgDiv.innerHTML = text;
  msgDiv.classList.add("user");

  chatbox.appendChild(msgDiv); // Append the message div first

  // Handle buttons if provided
// Handle buttons if provided
if (buttons && Array.isArray(buttons)) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  buttons.forEach((button) => {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = button.title;
    buttonElement.classList.add("button", button.type);

    buttonElement.addEventListener("click", () => {
      displayUserMessage(button.title);
      if (appConfig.interface == "socketio") {
        sendMessageToRasaSocket(button.payload);
      } else if (appConfig.interface == "rest") {
        sendMessageToRasaRest(button.payload); // Ensure this uses the correct variable
      } else {
        displayMessage("Interface not set correctly", null, "system");
      }
      // Disable all buttons in the container
      Array.from(buttonContainer.children).forEach(child => {
        child.disabled = true;
        child.classList.add("disabled-button");
      });
    });

    buttonContainer.appendChild(buttonElement);
  });
  chatbox.appendChild(buttonContainer); // Append the button container after the message div
}


  // Scroll to the bottom of the chatbox
  chatbox.scrollTop = chatbox.scrollHeight;

  return msgDiv;
}



function showTypingIndicator() {
  const chatbox = document.getElementById("chatbox");
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.innerHTML = "<div></div><div></div><div></div>"; // Simple dots animation or your custom animation
  typingIndicator.setAttribute("id", "typing-indicator");
  chatbox.appendChild(typingIndicator);
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom to show the indicator
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.parentNode.removeChild(typingIndicator);
  }
}



function displayUserMessage(text) {
  displayMessage(text, null, 'user');
}

async function sendMessageToRasaRest(message) {
  const chatbox = document.getElementById("chatbox");

  // Show typing indicator
  showTypingIndicator();

  try {
    const response = await fetch(appConfig.restEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender: appConfig.username, message: message }),
    });

    const responseData = await response.json();

    // Hide typing indicator
    removeTypingIndicator();

    // Process and display the response
    if (Array.isArray(responseData) && responseData.length > 0) {
      responseData.forEach((botMessage) => {
        const buttons = botMessage.buttons ? botMessage.buttons : null;
        displayMessage(botMessage.text, buttons, "bot");
      });
    } else {
      // Single message response
      const buttons = responseData.buttons ? responseData.buttons : null;
      displayMessage(responseData.text, buttons, "bot");
    }
  } catch (error) {
    console.error("Error fetching response", error);
    // Hide typing indicator in case of error
    showTypingIndicator(false);
    displayMessage("Error fetching response", null, "system");
  }
}



let loadingMessage = null;

function sendMessageToRasaSocket(message) {
  const chatbox = document.getElementById("chatbox");

  // Show typing indicator
  showTypingIndicator();

  if (!window.socket) {
    window.socket = io(appConfig.socketEndpoint);

    window.socket.on("connect", function() {
      console.log("Socket.IO connected.");
    });

    window.socket.on("bot_uttered", function (botMessage) {

    console.log(botMessage);
      // Hide typing indicator when the bot sends a message
      removeTypingIndicator();

      // Process and display the message
      if (Array.isArray(botMessage)) {
        botMessage.forEach((message) => {
          const buttons = message.quick_replies ? message.quick_replies : null;
          displayMessage(message.text, buttons, "bot");
        });
      } else {
        const buttons = botMessage.quick_replies ? botMessage.quick_replies : null;
        displayMessage(botMessage.text, buttons, "bot");
      }
    });
  }

  window.socket.emit("user_uttered", { message: message, sender: appConfig.username });
}

