const socket = io();
let alternate = false;
let username = localStorage.getItem('username');

//Checking the username is available in the local storage if not it promts to ask the username
if (!username) {
    username = prompt("What's your name?");
    localStorage.setItem('username', username);
}


document.getElementById("message").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

const sendMessage = () => {
    const messageInput = document.getElementById("message");
    const data = {
        username: username,
        message: messageInput.value
    };
    socket.emit("send_message", data);
    messageInput.value = '';
};
socket.on("new_message", (data) => {
    const messagesBox = document.getElementById("messages");
    const messageClass = data.username === username ? 'self' : (alternate ? 'alternate' : '');
    alternate = !alternate;

    const messageHtml = `<div class="message ${messageClass}">${data.username}: ${data.message}</div>`;
    messagesBox.innerHTML += messageHtml;
    messagesBox.scrollTop = messagesBox.scrollHeight;
});

function toggleTheme() {
    document.body.classList.toggle("dark");
    document.querySelector(".chat-container").classList.toggle("dark");
    document.querySelector(".header").classList.toggle("dark");
    document.querySelector(".chat-box").classList.toggle("dark");
    document.querySelector('input[type="text"]').classList.toggle("dark");
    document.querySelector("button.send").classList.toggle("dark");

    const themeToggle = document.getElementById("theme-toggle");
    if (document.body.classList.contains("dark")) {
      themeToggle.innerHTML = `
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
  <circle cx="12" cy="12" r="5" />
  <line x1="12" y1="1" x2="12" y2="4" />
  <line x1="12" y1="20" x2="12" y2="23" />
  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
  <line x1="1" y1="12" x2="4" y2="12" />
  <line x1="20" y1="12" x2="23" y2="12" />
  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
</svg>
      `; // Sun icon
    } else {
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
          <path d="M21 12.79A9 9 0 1 1 12.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      `; // Moon icon
    }
  }       