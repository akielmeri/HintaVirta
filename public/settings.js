// settings.js

// Funktio ilmoitusviestien näyttämiseen
const displayNotification = (message, backgroundColor) => {
  const notificationArea = document.getElementById('confirmMessageArea');
  notificationArea.textContent = message;
  notificationArea.style.backgroundColor = backgroundColor;
  notificationArea.style.display = 'block';
};

// Funktio asetusten lataamiseen localStoragesta
const loadSettings = () => {
  return {
    expensivePriceThreshold: parseInt(localStorage.getItem('expensivePriceThreshold'), 10) || 10, // Oletusarvo 10, jos ei ole asetettu
    moderatePriceThreshold: parseInt(localStorage.getItem('moderatePriceThreshold'), 10) || 5, // Oletusarvo 5, jos ei ole asetettu
    includeTax: localStorage.getItem('includeTax') !== null ? localStorage.getItem('includeTax') === 'true' : true, // Oletusarvo true, jos ei ole asetettu
  };
};



// Tällä tallennetaan käyttäjän asettamat asetukset localStorageen
const saveSettings = (expensivePriceThreshold, moderatePriceThreshold, includeTax) => {
  // Kohtuullinen hinta ei voi olla suurempi kuin kallis hinta
  if (parseInt(moderatePriceThreshold, 10) >= parseInt(expensivePriceThreshold, 10)) {
    displayNotification('Kohtuullisen hinnan raja on oltava pienempi kuin kalliin hinnan raja.', 'red');
  } else {
    // Tallennetaan asetukset localStorageen
    localStorage.setItem('expensivePriceThreshold', expensivePriceThreshold.toString());
    localStorage.setItem('moderatePriceThreshold', moderatePriceThreshold.toString());
    localStorage.setItem('includeTax', includeTax.toString());

    displayNotification('Asetukset tallennettu!', 'green');

    // Poistetaan tallenna-nappulan käyttö ja muutetaan sen tyyliä
    const saveButton = document.getElementById('save');
    saveButton.disabled = true;
    saveButton.style.backgroundColor = 'grey';

    // Päivitetään peruuta-napin teksti
    document.getElementById('cancel').textContent = 'Palaa takaisin';
  }
};



// DOM-sisällön lataus -tapahtuman kuuntelija
document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();

  // Täytetään lomakkeen kentät nykyisillä asetuksilla
  document.getElementById('expensivePriceThreshold').value = settings.expensivePriceThreshold;
  document.getElementById('moderatePriceThreshold').value = settings.moderatePriceThreshold;
  document.querySelector('#includeTax').checked = settings.includeTax;

  // Tallenna-napin tapahtuma
  document.getElementById('save').addEventListener('click', () => {
    const expensivePriceThreshold = document.getElementById('expensivePriceThreshold').value;
    const moderatePriceThreshold = document.getElementById('moderatePriceThreshold').value;
    const includeTax = document.querySelector('#includeTax').checked;

    saveSettings(expensivePriceThreshold, moderatePriceThreshold, includeTax);
  });

  // Peruuta-napin tapahtuma
  document.getElementById('cancel').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

// Tapahtumakuuntelija asetuslomakkeen muutoksille
document.getElementById('settingsGrid').addEventListener('input', (event) => {
  if (['expensivePriceThreshold', 'moderatePriceThreshold', 'includeTax'].includes(event.target.id)) {
    const saveButton = document.getElementById('save');
    saveButton.disabled = false;
    saveButton.style.backgroundColor = '#007bff';
    document.getElementById('cancel').textContent = 'Peruuta';
    document.getElementById('confirmMessageArea').style.display = 'none';
  }
});
