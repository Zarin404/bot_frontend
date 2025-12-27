const chatbox = document.getElementById("chatbox");
const toggle = document.getElementById("chat-toggle");
const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

toggle.onclick = () => {
  chatbox.classList.toggle("active");
};

function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  fetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: text
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Backend error");
      }
      return res.json();
    })
    .then(data => {
      appendMessage(data.reply, "bot");
    })
    .catch(err => {
      console.error(err);
      appendMessage("Error connecting to bot.", "bot");
    });
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

