async function authenticate() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    axios.post('http://localhost:3000/auth/login', {
        username: username,
        password: password
    })
    .then(function (response) {
        const token = response.data.access_token;
        if (token) {
            window.location.href = 'page2.html?username=' + username + '&token=' + token;
        } else {
            console.error('Токен не получен');
        }
    })
    .catch(function (error) {
        var errorMessage = document.getElementById('error');
        errorMessage.textContent = "Неправльные учётные данные, пожалуйста попробуйте снова";
    });
}

 var urlParams = new URLSearchParams(window.location.search);
 var username = urlParams.get('username');
 username = username.charAt(0).toUpperCase() + username.slice(1);
 document.getElementById('username').textContent = username;