// appState.js

// Sovelluksen tila
export const appState = {
  priceData: [], // Sisältää kaikki haetut hintatiedot myöhempää käsittelyä varten
  priceChart: null,
  currentSelectedDay: "today", // Käyttäjän valitsema päivä
};

// Käyttäjälle näytettävät valitun päivän hintatilastot ja kellonajat
export const priceStats = {
  currentPrice: "",
  averagePrice: "",
  averagePriceHour: "",
  lowestPrice: "",
  lowestPriceHour: "",
  highestPrice: "",
  highestPriceHour: "",
};

// Kalliin ja kohtuullisen hinnan raja-arvot sekä ALV:n sisällyttämisen asetukset.
// Jos käyttäjä muuttaa asetuksia, ne tallennetaan localStorageen.
// Muuten käytetään oletusarvoja.
export const settings = {
  expensive: parseInt(localStorage.getItem("expensivePriceThreshold")) || 10,
  moderate: parseInt(localStorage.getItem("moderatePriceThreshold")) || 5,
  includeTax: localStorage.getItem("includeTax") !== null ? localStorage.getItem("includeTax") === "true" : true,
};
