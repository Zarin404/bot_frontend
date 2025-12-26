const chatbox = document.getElementById("chatbox");
const toggle = document.getElementById("chat-toggle");
const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Toggle chatbox visibility
toggle.onclick = () => {
  chatbox.classList.toggle("active");
};

// Append message to chat with proper alignment and spacing
function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);

  // Add spacing between messages
  const spacer = document.createElement("div");
  spacer.style.height = "8px";
  messages.appendChild(spacer);

  // Auto-scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

// Send user message to HF Space backend
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  fetch("https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/run/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [text] }) // HF expects input as array in "data"
  })
  .then(res => res.json())
  .then(data => {
    appendMessage(data.data[0], "bot"); // HF returns output inside data.data array
  })
  .catch(err => {
    appendMessage("Error connecting to bot.", "bot");
    console.error(err);
  });
}

// Send on button click
sendBtn.onclick = sendMessage;

// Send on Enter key press
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
