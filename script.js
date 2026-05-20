const ibanChoiceBtn = document.getElementById('ibanChoiceBtn');
const tcidChoiceBtn = document.getElementById('tcidChoiceBtn');
const creditCardChoiceBtn = document.getElementById('creditCardChoiceBtn');
const ibanSection = document.getElementById('ibanSection');
const tcidSection = document.getElementById('tcidSection');
const creditCardSection = document.getElementById('creditCardSection');
const ibanButton = document.getElementById('ibanButton');
const tcidButton = document.getElementById('tcidButton');
const creditCardButton = document.getElementById('creditCardButton');
const ibanInput = document.getElementById('ibanInput');
const tcidInput = document.getElementById('tcidInput');
const creditCardInput = document.getElementById('creditCardInput');
const ibanResult = document.getElementById('ibanResult');
const tcidResult = document.getElementById('tcidResult');
const creditCardResult = document.getElementById('creditCardResult');

// IBAN seçimi
ibanChoiceBtn.addEventListener('click', () => {
  ibanSection.style.display = 'block';
  tcidSection.style.display = 'none';
  creditCardSection.style.display = 'none';
  ibanResult.textContent = '';
  ibanResult.className = 'result';
  ibanChoiceBtn.classList.add('active');
  tcidChoiceBtn.classList.remove('active');
  creditCardChoiceBtn.classList.remove('active');
});

// TC Kimlik No seçimi
tcidChoiceBtn.addEventListener('click', () => {
  ibanSection.style.display = 'none';
  tcidSection.style.display = 'block';
  creditCardSection.style.display = 'none';
  tcidResult.textContent = '';
  tcidResult.className = 'result';
  tcidChoiceBtn.classList.add('active');
  ibanChoiceBtn.classList.remove('active');
  creditCardChoiceBtn.classList.remove('active');
});

// Kredi Kartı seçimi
creditCardChoiceBtn.addEventListener('click', () => {
  ibanSection.style.display = 'none';
  tcidSection.style.display = 'none';
  creditCardSection.style.display = 'block';
  creditCardResult.textContent = '';
  creditCardResult.className = 'result';
  creditCardChoiceBtn.classList.add('active');
  ibanChoiceBtn.classList.remove('active');
  tcidChoiceBtn.classList.remove('active');
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

// Kredi Kartı doğrulama fonksiyonu (Luhn Algoritması)
function validateCreditCard(cardNumber) {
  // Sadece rakamları tut
  const digits = cardNumber.replace(/\D/g, '');
  
  // 13-19 hane arasında olmalı
  if (!/^\d{13,19}$/.test(digits)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  // Sağdan sola doğru ilerle
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    // Her ikinci rakamı 2 ile çarp
    if (isEven) {
      digit *= 2;
      // Sonuç 9'dan büyükse, 9 çıkar
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  // Toplam 10'a bölünebilir mi?
  return sum % 10 === 0;
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

  // İlk 10 hanenin toplamını hesapla
  let totalSum = 0;
  for (let i = 1; i < 11; i++) {
    totalSum += digits[i-1];
  }
  

  let oddSum = 0;
  for (let i = 1; i < 10; i += 2) {
    oddSum += digits[i-1];
  }


  let evenSum = 0;
  for (let i = 2; i < 9; i += 2) {
    evenSum += digits[i-1];
  }
  
  // 10. haneyi hesapla
  let checkDigit10 = (oddSum*7 - evenSum) % 10;
  
  // 10. hane kontrol et
  if (digits[9] !== checkDigit10) {
    return false;
  }

   // 11. haneyi kontrol et (ilk 10 hanenin toplamının 10 ile bölümünden kalan)
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

// Kredi Kartı doğrulama butonu
creditCardButton.addEventListener('click', () => {
  const cardNumber = creditCardInput.value.trim();

  if (cardNumber) {
    const isValid = validateCreditCard(cardNumber);
    if (isValid) {
      creditCardResult.textContent = '✓ Kredi Kartı geçerlidir!';
      creditCardResult.className = 'result valid';
    } else {
      creditCardResult.textContent = '✗ Kredi Kartı geçersizdir!';
      creditCardResult.className = 'result invalid';
    }
  } else {
    creditCardResult.textContent = 'Lütfen kredi kartı numarası girin.';
    creditCardResult.className = 'result';
  }
});
