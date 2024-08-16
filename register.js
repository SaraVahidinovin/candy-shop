const form = document.getElementById('registration-form');
const errorMessage = document.getElementById('error-msg');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;


    if (!name || !username || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'All fields are required.';
        return;
    }

    // Email domain restriction
    const organizationDomain = "@gmail.com"; 
    if (!email.endsWith(organizationDomain)) {
        displaySignUpErrorMessage('You must use your organization email address');
        return;
    }

    if (password.length < 8) {
        displayLoginErrorMessage('Password must be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        displayLoginErrorMessage('Passwords do not match.');
        return;
    }

    registerUser(name, username, email, password);
});

function registerUser(name, username, email, password) {
    // Check if username or email already exists
    if (localStorage.getItem(username)) {
        displaySignUpErrorMessage('Username already exists.');
        return;
    }

    const newUser = {
        name: name,
        username: username,
        email: email,
        password: hashPassword(password)
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('Registered Users are:', users);
    alert('Registration successful!');
    window.location.href = 'login.html'; // Redirect to login page
}

function displaySignUpErrorMessage(message) {
    errorMessage.innerText = message;
}

// Existing hashPassword function
function hashPassword(password) {
    return btoa(password); // Simple Base64 encoding
}


