from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from flask_socketio import SocketIO
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__, static_folder='frontend')
app.secret_key = 'your_secret_key'  # Use a secure secret key
socketio = SocketIO(app, cors_allowed_origins="*")

# Simulated in-memory database
users = {}

@app.route('/')
def index():
    if 'username' in session:
        return app.send_static_file('index.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password']
        
        # Server-side validation
        if not username:
            flash('Username is required.')
            return render_template('login.html')
        
        if not password:
            flash('Password is required.')
            return render_template('login.html')
        
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password. Please try again.')
            
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password']
        
        # Server-side validation
        if not username:
            flash('Username is required.')
            return render_template('signup.html')
        
        if len(username) < 3:
            flash('Username must be at least 3 characters long.')
            return render_template('signup.html')
        
        if len(username) > 20:
            flash('Username must be less than 20 characters long.')
            return render_template('signup.html')
        
        if not username.replace('_', '').isalnum():
            flash('Username can only contain letters, numbers, and underscores.')
            return render_template('signup.html')
        
        if not password:
            flash('Password is required.')
            return render_template('signup.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters long.')
            return render_template('signup.html')
        
        if username in users:
            flash('Username already exists. Please choose a different one.')
            return render_template('signup.html')
        
        # Create user
        users[username] = generate_password_hash(password)
        flash('Account created successfully! Please sign in.')
        return redirect(url_for('login'))
        
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('frontend', path)

@socketio.on('send_message')
def handle_send_message(data):
    print(data)
    socketio.emit("new_message", data)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=6003)
