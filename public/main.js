// main.js

// Tuo kaikki tarvittavat moduulit
import { fetchData } from "./api.js";
import { formatDateTimeComponents, filterPricesByDate } from "./utilities.js";
import { showNotification, displayPriceStats, fillAndDisplayTable, plotGraph, showContent } from "./updateUI.js";
import { appState, priceStats, settings } from "./appState.js";

// Hakee ja näyttää nykyisen hinnan perustuen järjestelmän kellonaikaan ja päivämäärään.
const getCurrentPrice = (pricePoints) => {
  let currentHour = formatDateTimeComponents(new Date()).hourString;
  let currentDay = formatDateTimeComponents(new Date()).dateString;
  const taxMultiplier = settings.includeTax ? 1.24 : 1; // mahdollinen ALV:n lisäys
  let currentPrice = pricePoints.find((item) => item.hour === currentHour && item.date === currentDay);
  if (currentPrice) {
    priceStats.currentPrice = currentPrice.price * taxMultiplier;
  } else {
    document.getElementById("currentPrice").textContent = "Ei saatavilla";
  }
};

// Laskee ja päivittää tilastot annetuista hintapisteistä `priceStats`-objektiin.
const calculateStats = (pricePoints) => {
  if (pricePoints.length != 24) return;
  const taxMultiplier = settings.includeTax ? 1.24 : 1; // mahdollinen ALV:n lisäys

  priceStats.highestPrice = Math.max(...pricePoints.map((item) => item.price * taxMultiplier));
  priceStats.lowestPrice = Math.min(...pricePoints.map((item) => item.price * taxMultiplier));
  priceStats.averagePrice = pricePoints.reduce((acc, item) => acc + item.price * taxMultiplier, 0) / pricePoints.length;

  // Etsitään korkeimman ja matalimman hinnan kellonajat
  priceStats.highestPriceHour = pricePoints.find((item) => item.price * taxMultiplier === priceStats.highestPrice).hour;
  priceStats.lowestPriceHour = pricePoints.find((item) => item.price * taxMultiplier === priceStats.lowestPrice).hour;
};

// Käsittelee päivän valinnan ja päivittää sovelluksen tilaa vastaavasti.
const handleDateSelection = (selectedDay) => {
  const targetDate = new Date();

  if (selectedDay === "yesterday") {
    targetDate.setDate(targetDate.getDate() - 1);
  } else if (selectedDay === "tomorrow") {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const filteredData = filterPricesByDate(appState.priceData, targetDate);
  if (filteredData.length !== 24) {
    showNotification("Huomisen hintoja ei vielä saatavilla!");
    return;
  }
  getCurrentPrice(appState.priceData);
  calculateStats(filteredData);
  displayPriceStats(filteredData);
  fillAndDisplayTable(filteredData);
  plotGraph(filteredData);
};

// Alustaa sovelluksen lataamalla kolmen päivän hintatiedot API-kutsun avulla ja asettamalla alkuvalinnat.
const initializeApp = async () => {
  try {
    appState.priceData = await fetchData();
    handleDateSelection(appState.currentSelectedDay);
    showContent();
  } catch (error) {
    console.error("Virhe datan käsittelyssä:", error);
  }
};

// Sovelluksen käynnistys ja tapahtumankuuntelijoiden asetus.
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Sovelluksen alustus
    await initializeApp();
    console.log("Sovellus alustettu. Asetukset:", settings);
  } catch (error) {
    console.error("Virhe sovelluksen alustuksessa:", error);
  }

  // Päivän valintanappien tapahtumankuuntelija
  document.getElementById("dateSelection").addEventListener("click", (e) => {
    // Poistetaan 'selected'-luokka aiemmin valitulta napilta, jos sellainen on
    const currentSelectedButton = document.querySelector("#dateSelection .selected");
    if (currentSelectedButton) {
      currentSelectedButton.classList.remove("selected");
    }

    // Lisätään 'selected'-luokka klikatulle napille ja päivitetään sovelluksen tila
    e.target.classList.add("selected");
    appState.currentSelectedDay = e.target.id;
    console.log("Valittu päivä:", appState.currentSelectedDay);

    // Käsitellään päivän valinta
    handleDateSelection(appState.currentSelectedDay);
  });
});
