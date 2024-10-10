from flask import Flask, send_from_directory
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='frontend')
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('frontend', path)

@socketio.on('send_message')
def handle_send_message(data):
    print(data)
    socketio.emit("new_message", data)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=6003)
