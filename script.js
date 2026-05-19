const ibanChoiceBtn = document.getElementById('ibanChoiceBtn');
const tcidChoiceBtn = document.getElementById('tcidChoiceBtn');
const ibanSection = document.getElementById('ibanSection');
const tcidSection = document.getElementById('tcidSection');
const ibanButton = document.getElementById('ibanButton');
const tcidButton = document.getElementById('tcidButton');
const ibanInput = document.getElementById('ibanInput');
const tcidInput = document.getElementById('tcidInput');
const ibanResult = document.getElementById('ibanResult');
const tcidResult = document.getElementById('tcidResult');

// IBAN seçimi
ibanChoiceBtn.addEventListener('click', () => {
  ibanSection.style.display = 'block';
  tcidSection.style.display = 'none';
  ibanResult.textContent = '';
  ibanResult.className = 'result';
  ibanChoiceBtn.classList.add('active');
  tcidChoiceBtn.classList.remove('active');
});

// TC Kimlik No seçimi
tcidChoiceBtn.addEventListener('click', () => {
  ibanSection.style.display = 'none';
  tcidSection.style.display = 'block';
  tcidResult.textContent = '';
  tcidResult.className = 'result';
  tcidChoiceBtn.classList.add('active');
  ibanChoiceBtn.classList.remove('active');
});

// IBAN mod 97 doğrulama fonksiyonu
function validateIBAN(iban) {
  // IBAN'ı büyük harfe çevir ve boşlukları kaldır
  iban = iban.toUpperCase().replace(/\s/g, '');
  
  // IBAN formatını kontrol et (başında ülke kodu 2 harf)
  if (!/^[A-Z]{2}[0-9]{2}/.test(iban)) {
    return false;
  }
  
  // İlk 4 karakteri sona taşı
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  
  // Harfleri numaralarla değiştir (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (let char of rearranged) {
    if (/[0-9]/.test(char)) {
      numericString += char;
    } else {
      numericString += (char.charCodeAt(0) - 55).toString();
    }
  }
  
  // Mod 97 kontrol et (1'e eşit olmalı)
  let remainder = 0;
  for (let digit of numericString) {
    remainder = (remainder * 10 + parseInt(digit)) % 97;
  }
  
  return remainder === 1;
}

// TC Kimlik No doğrulama fonksiyonu
function validateTCID(tcid) {
  // Sadece rakam ve 11 hane olmalı
  if (!/^[0-9]{11}$/.test(tcid)) {
    return false;
  }
  
  // İlk hane 0 olamaz
  if (tcid[0] === '0') {
    return false;
  }
  
  const digits = tcid.split('').map(Number);

  let totalSum = 0;
  for (let i = 1; i < 11; i++) {
    totalSum += digits[i-1];
  }
  
  // İlk 9 hanenin tek pozisyonlarını toplayıp 3 ile çarp
  let oddSum = 0;
  for (let i = 1; i < 10; i += 2) {
    oddSum += digits[i-1];
  }

  // İlk 8 hanenin çift pozisyonlarını toplayıp 9 ile çarp
  let evenSum = 0;
  for (let i = 2; i < 9; i += 2) {
    evenSum += digits[i-1];
  }
  
  let checkDigit10 = (oddSum*7 - evenSum) % 10;
  
  // 10. hane kontrol et
  if (digits[9] !== checkDigit10) {
    return false;
  }

  if (digits[10] !== (totalSum % 10)) {
    return false;
  }
  
  return true;
}

// IBAN doğrulama butonu
ibanButton.addEventListener('click', () => {
  const iban = ibanInput.value.trim();

  if (iban) {
    const isValid = validateIBAN(iban);
    if (isValid) {
      ibanResult.textContent = '✓ IBAN geçerlidir!';
      ibanResult.className = 'result valid';
    } else {
      ibanResult.textContent = '✗ IBAN geçersizdir!';
      ibanResult.className = 'result invalid';
    }
  } else {
    ibanResult.textContent = 'Lütfen IBAN girin.';
    ibanResult.className = 'result';
  }
});

// TC Kimlik No doğrulama butonu
tcidButton.addEventListener('click', () => {
  const tcid = tcidInput.value.trim();

  if (tcid) {
    const isValid = validateTCID(tcid);
    if (isValid) {
      tcidResult.textContent = '✓ TC Kimlik No geçerlidir!';
      tcidResult.className = 'result valid';
    } else {
      tcidResult.textContent = '✗ TC Kimlik No geçersizdir!';
      tcidResult.className = 'result invalid';
    }
  } else {
    tcidResult.textContent = 'Lütfen TC Kimlik No girin.';
    tcidResult.className = 'result';
  }
});
