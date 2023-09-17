const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">ChatGPT</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
};

// New simplified function
const simpleResponse = (chatElement, responseText) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = responseText;
    chatbox.scrollTo(0, chatbox.scrollHeight);
};

const handleChat = async () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
  
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
  
    const chatbox = document.querySelector('.chats');
    
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
  
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    const summary = await getSummary(userMessage);
    
    simpleResponse(incomingChatLi, summary);
    try {
        const response = await fetch('/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            question: userMessage,
            summaryResponse: summary  // Replace summaryResponse with the name used in your server logic if different
          }),
        });
    
        const data = await response.json();
        if (response.ok) {
          console.log("Server Response:", data.message);
        } else {
          console.log("Error:", data);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
  };

  const getSummary = async (transcript) => {
    const response = await fetch('http://localhost:3000/get-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transcript })
    });
    
    const data = await response.json();
    return data.summary;
  };

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
  
sendChatBtn.addEventListener("click", handleChat);
