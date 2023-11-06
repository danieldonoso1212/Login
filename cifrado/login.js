var failedAttempts = parseInt(sessionStorage.getItem('failedAttempts')) || 0;
var blockTime = parseInt(sessionStorage.getItem('blockTime')) || 0;

function checkCredentials(username, password) {
  const users = [
    { username: 'AdminUEB1234', password: 'UEB2023*Bosque' },
    { username: 'AdminUEB5678', password: 'Ueb2023*BOSQUE' },
    { username: 'AdminUEB9012', password: 'UeB2023*BoSqUe' }
  ];
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
}

function showError(message) {
  alert(message);
}

function blockLogin() {
  blockTime += (failedAttempts + 1) * 5;
  document.getElementById('username').disabled = true;
  document.getElementById('password').disabled = true;
  document.getElementById('login-button').disabled = true;
  setTimeout(() => {
    document.getElementById('username').disabled = false;
    document.getElementById('password').disabled = false;
    document.getElementById('login-button').disabled = false;
    failedAttempts = 0;
    blockTime = 0;
    sessionStorage.setItem('failedAttempts', failedAttempts);
    sessionStorage.setItem('blockTime', blockTime);
  }, blockTime * 2000);
}

document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  if (checkCredentials(username, password)) {
    sessionStorage.setItem('isLoggedIn', 'true');
    window.location.replace('postindex.html');
  } else {
    failedAttempts++;
    showError('Datos incorrectos. Intenta de nuevo');
    sessionStorage.setItem('isLoggedIn', 'false');
    sessionStorage.setItem('failedAttempts', failedAttempts);
    sessionStorage.setItem('blockTime', blockTime);
  }
  if (failedAttempts === 3) {
    showError('Datos incorrectos. Intenta de nuevo en 1 minuto');
    blockLogin();
  }
});

if (failedAttempts > 0) {
  document.getElementById('username').disabled = true;
  document.getElementById('password').disabled = true;
  document.getElementById('login-button').disabled = true;
  blockLogin();
}
