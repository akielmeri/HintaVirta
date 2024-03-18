// utilities.js

import { settings } from "./appState.js";

// Erottaa päivämäärän ja kellonajan toisistaan ja palauttaa ne objektina
// Esim. "2024-03-01T12:00:00" -> { dateString: "2024-03-01", hourString: "12" }
export const formatDateTimeComponents = (date) => {
  // Apufunktio, joka lisää nollan yksittäisen numeron eteen
  const pad = (num) => ("0" + num).slice(-2);

  const hourString = pad(date.getHours());
  const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return { dateString, hourString };
};

// Lisää pulssiefektin elementtiin. Käytetään silloin kun taulukko päivitetään.
export const applyPulseEffect = (element) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.add("pulse-effect");

  const animationDuration = 400;
  setTimeout(() => {
    element.classList.remove("pulse-effect");
    console.log("Pulse effect completed and class removed.");
  }, animationDuration);
};

// Määrittää hinnan tason perustuen annettuun hintaan.
// Käytetään hintojen värien määrittämiseen käyttöliittymässä.
export const determinePriceLevel = (price) => {
  if (price >= settings.expensive) {
    return "price-high";
  } else if (price >= settings.moderate) {
    return "price-moderate";
  } else if (price < settings.moderate) {
    return "price-low";
  }
};

// Suodattaa hinnat annetun päivämäärän perusteella
export const filterPricesByDate = (pricePoints, date) => {
  let dateString = formatDateTimeComponents(date).dateString;
  let filteredData = pricePoints.filter((item) => {
    let itemDate = item.date;
    return itemDate === dateString;
  });
  console.log(filteredData);
  return filteredData;
};
