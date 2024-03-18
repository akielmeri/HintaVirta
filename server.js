// Dynamic import for dotenv
import('dotenv/config');

// ESM imports
import express from 'express';
import path from 'path'; // Ensure this is only imported once, and using ESM syntax
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static("public"));



app.get("/api/data", async (req, res) => {
  // Extract query parameters from client request
  const { startPeriod, endPeriod } = req.query;

  const apiUrl = `https://web-api.tp.entsoe.eu/api?${new URLSearchParams({
    documentType: "A44",
    in_Domain: "10YFI-1--------U",
    out_Domain: "10YFI-1--------U",
    periodStart: startPeriod,
    periodEnd: endPeriod,
    securityToken: process.env.API_KEY, // Securely using the API key from .env
  }).toString()}`;

  try {
    const apiResponse = await fetch(apiUrl, { method: "GET", cache: "no-cache" });
    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    const xmlData = await apiResponse.text();
    res.send(xmlData); // Send the XML data back to the client
  } catch (error) {
    console.error("API call error:", error.message);
    res.status(500).send("Server error occurred while fetching data");
  }
});
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
