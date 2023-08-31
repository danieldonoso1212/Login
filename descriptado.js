var alphabet = {
  'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
  'K': 10, 'L': 11, 'M': 12, 'N': 13, 'Ñ': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18,
  'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26
};

function frequency(text) {
  var freq = {};
  var chars = text.split('');
  for (var i = 0; i < chars.length; i++) {
    var char = chars[i];
    if (char in freq) {
      freq[char]++;
    } else {
      freq[char] = 1;
    }
  }
  return freq;
}

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (var x = 1; x < m; x++) { // Start from x = 1 for correct modular inverse
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
}

function decrypt(ciphertext, char1, char2) {
  var m = Object.keys(alphabet).length;
  var b = alphabet[char2];
  var index1 = alphabet[char1];
  var index2 = alphabet[char2];
  
  // Find a and b based on frequency analysis assumptions
  var a;
  for (var candidateA = 1; candidateA < m; candidateA++) {
    if ((index1 - b + m) * modInverse(candidateA, m) % m === index2) {
      a = candidateA;
      break;
    }
  }
  
  var invA = modInverse(a, m);
  var plaintext = '';
  for (var i = 0; i < ciphertext.length; i++) {
    var char = ciphertext[i];
    var index = alphabet[char];
    if (index === undefined) {
      plaintext += char;
    } else {
      var decryptedIndex = (invA * (index - b + m)) % m;
      if (decryptedIndex < 0) {
        decryptedIndex += m;
      }
      var decryptedChar = Object.keys(alphabet)[decryptedIndex];
      plaintext += decryptedChar;
    }
  }
  return plaintext;
}

document.getElementById("decrypt-form").addEventListener("submit", function (event) {
  event.preventDefault();
  var ciphertext = document.getElementById("decrypt-text").value.toUpperCase();
  var freqData = frequency(ciphertext);
  var sortedFreq = Object.entries(freqData).sort((a, b) => b[1] - a[1]);

  var possibleChar1 = sortedFreq[0][0];
  var possibleChar2 = sortedFreq[1][0];
  var possibleChar3 = sortedFreq[2][0];

  var decryptedResults = [];

  for (var i = 0; i < 3; i++) {
    var char1, char2;
    if (i === 0) {
      char1 = possibleChar1;
      char2 = possibleChar2;
    } else if (i === 1) {
      char1 = possibleChar1;
      char2 = possibleChar3;
    } else {
      char1 = possibleChar2;
      char2 = possibleChar3;
    }

    var decryptedText = decrypt(ciphertext, char1, char2);
    decryptedResults.push({
      text: decryptedText,
      char1: alphabet[char1],
      char2: alphabet[char2]
    });
  }

  var decryptedResult = document.getElementById("decrypted-result");
  decryptedResult.innerHTML = `
   
    
        Text: ${decryptedResults[0].text} (Probable a: ${decryptedResults[0].char1}, Probable b: ${decryptedResults[0].char2})
     
        Text: ${decryptedResults[1].text} (Probable a: ${decryptedResults[1].char1}, Probable b: ${decryptedResults[1].char2})
     
        Text: ${decryptedResults[2].text} (Probable a: ${decryptedResults[2].char1}, Probable b: ${decryptedResults[2].char2})
    
  `;
  
  var ctx = document.getElementById("frequency-chart").getContext("2d");
  var labels = Object.keys(freqData);
  var data = Object.values(freqData);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Character Frequency",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
