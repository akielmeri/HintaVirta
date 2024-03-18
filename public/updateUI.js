// updateUI.js

import { appState, priceStats, settings } from "./appState.js";
import { applyPulseEffect, determinePriceLevel } from "./utilities.js";

// Tämän avulla näytetään ilmoitus käyttäjälle käyttöliittymässä.
export const showNotification = (message) => {
  let notificationArea = document.getElementById("notificationArea");
  let priceChart = document.getElementById("priceChart");
  let priceTable = document.getElementById("priceTable");

  // Piilotetaan kaavio ja taulukko
  priceChart.style.display = "none";
  priceTable.style.display = "none";

  // Näytetään ilmoitus
  notificationArea.textContent = message;
  notificationArea.style.display = "block";
};

// Tällä päivitetään sivulla näkyvät hintatilastot:
// nykyinen hinta, sekä valitun päivän korkein, matalin ja keskiarvohinta.
export const displayPriceStats = () => {
  // Apufunktio, joka lisää asettaa kaksi desimaalia ja korvaa pisteen pilkulla
  const formatPrice = (price) => price.toFixed(2).replace(".", ",");
  const priceLevels = ["price-high", "price-moderate", "price-low"];

  // Haetaan elementit
  const lowestPriceLabel = document.getElementById("lowestPriceLabel");
  const highestPriceLabel = document.getElementById("highestPriceLabel");
  const averagePriceValue = document.getElementById("averagePrice");
  const lowestPriceValue = document.getElementById("lowestPrice");
  const highestPriceValue = document.getElementById("highestPrice");
  const currentPriceValue = document.getElementById("currentPrice");

  // Asetetaan tilastot näkyviin
  averagePriceValue.textContent = formatPrice(priceStats.averagePrice);
  priceLevels.forEach((level) => averagePriceValue.classList.remove(level));
  averagePriceValue.classList.add(determinePriceLevel(priceStats.averagePrice));

  lowestPriceValue.textContent = formatPrice(priceStats.lowestPrice);
  priceLevels.forEach((level) => lowestPriceValue.classList.remove(level));
  lowestPriceValue.classList.add(determinePriceLevel(priceStats.lowestPrice));

  highestPriceValue.textContent = formatPrice(priceStats.highestPrice);
  priceLevels.forEach((level) => highestPriceValue.classList.remove(level));
  highestPriceValue.classList.add(determinePriceLevel(priceStats.highestPrice));

  currentPriceValue.textContent = formatPrice(priceStats.currentPrice);
  priceLevels.forEach((level) => currentPriceValue.classList.remove(level));
  currentPriceValue.classList.add(determinePriceLevel(priceStats.currentPrice));

  // Kellonajat koreimmalle ja matalimmalle hinnalle
  highestPriceLabel.textContent = `${priceStats.highestPriceHour}-${(parseInt(priceStats.highestPriceHour) + 1).toString().padStart(2, "0")}`;
  lowestPriceLabel.textContent = `${priceStats.lowestPriceHour}-${(parseInt(priceStats.lowestPriceHour) + 1).toString().padStart(2, "0")}`;
};

// Tällä täytetään hintataulukko valitun päivän hintatiedoilla ja näytetään se.
export const fillAndDisplayTable = (pricePoints) => {
  let tableBody = document.querySelector("#priceTable tbody");
  let options = { weekday: "long", year: "numeric", month: "numeric", day: "numeric" };
  let tableDate = new Date(pricePoints[0].date).toLocaleDateString("fi-FI", options);

  document.querySelector("#priceTable th:first-child").textContent = tableDate;
  document.querySelector("#priceTable tr:nth-child(2) th").textContent = "Klo";
  tableBody.innerHTML = ""; // Tyhjennetään mahdollinen olemassa oleva sisältö

  // Lisätään hintatiedot taulukkoon
  pricePoints.forEach((item) => {
    let row = tableBody.insertRow();
    let hour = item.hour;
    let endHour = parseInt(hour) + 1;
    let hourCell = row.insertCell();
    hourCell.textContent = hour + " - " + ("0" + endHour).slice(-2);
    let priceCell = row.insertCell();
    let price = settings.includeTax ? item.price * 1.24 : item.price;
    priceCell.textContent = price.toFixed(2).replace(".", ",");
    priceCell.classList.add(determinePriceLevel(price));
  });

  // Piilotetaan mahdollinen ilmoitus ja näytetään taulukko
  let container = document.getElementById("priceTable");
  var notificationArea = document.getElementById("notificationArea");
  notificationArea.style.display = "none";
  container.style.display = "block";
  applyPulseEffect(container); // Pieni efekti kun taulukko päivittyy
};

// Piirtää hintakaavion valitun päivän hintatiedoilla ja näyttää sen.
export const plotGraph = (pricePoints) => {
  const canvas = document.getElementById("priceCanvas");
  const canvasContainer = canvas.parentElement;
  canvasContainer.style.display = "block"; // Palautetaan näkyviin
  const date = new Date(pricePoints[0].date).toLocaleDateString("fi-FI");

  // Valmistele data kaaviota varten
  const labels = pricePoints.map(point => point.hour);
  const dataPoints = pricePoints.map(point => point.price);

  const chartData = {
    labels,
    datasets: [{
      label: "c/kWh",
      backgroundColor: "#2779A0",
      hoverBackgroundColor: "#2A8AB9",
      borderColor: "rgb(255, 99, 132)",
      data: dataPoints,
    }],
  };

  const chartConfig = {
    type: "bar",
    data: chartData,
    options: {
      borderRadius: 10,
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: `Sähkön hinta - ${date}` },
        tooltip: {
          callbacks: {
            title: ([{label}]) => `klo ${label}-${(parseInt(label) + 1).toString().padStart(2, "0")}`,
          },
        },
      },
      scales: {
        x: { title: { display: true, text: "Kellonaika" }, grid: { display: false }},
        y: { title: { display: true, text: "c/KWh" }, grid: { display: true }},
      },
    },
  };

  // Tuhoaa vanhan kaavion, jos se on olemassa, ja luo uuden
  if (appState.priceChart) appState.priceChart.destroy();
  appState.priceChart = new Chart(canvas, chartConfig);
};

// Tällä näytetään sovelluksen pääsisältö, kun hintatiedot on haettu ja käsitelty.
export const showContent = () => {
  const appContent = document.querySelector(".content-container");
  appContent.classList.remove("hidden");
};
