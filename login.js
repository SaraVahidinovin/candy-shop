const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-msg');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginUser(username, password);
});

function loginUser(username, password) {
    // Check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === username);

    if (!user) {
        displayLoginErrorMessage('User not found.');
        return;
    }

    // Validate the password
    if (user.password !== hashPassword(password)) {
        displayLoginErrorMessage('Incorrect password.');
        return;
    }

    // Successful login
    alert('Login successful!');

    window.location.href = 'home.html';
}

function displayLoginErrorMessage(message) {
    errorMessage.innerText = message;
}

function hashPassword(password) {
    return btoa(password);
}
