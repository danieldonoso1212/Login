// Funciones


function processInputText(text) {
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
  const withoutPunctuation = normalizedText.replace(/[^\w\s]/gi, ''); // Remove punctuation
  const withoutSpaces = withoutPunctuation.replace(/\s/g, ''); // Remove spaces
  return withoutSpaces.toUpperCase(); // Convert to uppercase
}

function cifrado(plaintext, a, b) {
  const alphabet = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'Ñ': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18,
    'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26
  };
  const m = 27;
  let ciphertext = '';

  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i].toUpperCase();
    const index = alphabet[char];

    if (index === undefined) {
      ciphertext += char;
    } else {
      const encryptedIndex = ((a * index) + b) % m;
      const encryptedChar = Object.keys(alphabet)[encryptedIndex];
      ciphertext += encryptedChar;
    }
  }

  return ciphertext;
}

// Evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('encrypt-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const inputText = document.getElementById('encrypt-text').value;
    const keyA = parseInt(document.getElementById('key-a').value);
    const keyB = parseInt(document.getElementById('key-b').value);

    const processedInputText = processInputText(inputText);
    const encryptedText = cifrado(processedInputText, keyA, keyB);

    document.getElementById('encrypted-result').innerText = `Encrypted Text: ${encryptedText}`;

    const frequency = {};
    for (const char of encryptedText) {
      if (char.match(/[a-zA-Z]/)) {
        if (frequency[char]) {
          frequency[char]++;
        } else {
          frequency[char] = 1;
        }
      }
    }

    const labels = Object.keys(frequency);
    const data = Object.values(frequency);

    const ctx = document.createElement('canvas').getContext('2d');
    document.getElementById('frequency-analysis').innerHTML = '';
    document.getElementById('frequency-analysis').appendChild(ctx.canvas);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Character Frequency',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxis: {
            beginAtZero: true
          }
        }
      }
    });
  });
});