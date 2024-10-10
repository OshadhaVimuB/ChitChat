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
