import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FATSECRET_API_URL = "https://platform.fatsecret.com/rest/server.api";
const OAUTH_URL = "https://oauth.fatsecret.com/connect/token";

let accessToken = "";

// Function to get an access token from FatSecret
async function getAccessToken() {
    try {
        const response = await axios.post(
            OAUTH_URL,
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.FATSECRET_CONSUMER_KEY}:${process.env.FATSECRET_CONSUMER_SECRET}`
                    ).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        accessToken = response.data.access_token;
        console.log("New Access Token:", accessToken);
    } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
    }
}

// API Route to Search for Foods
app.get("/api/food", async (req, res) => {
    try {
        if (!accessToken) await getAccessToken();

        const { query } = req.query;
        const response = await axios.get(FATSECRET_API_URL, {
            params: {
                method: "foods.search",
                format: "json",
                search_expression: query || "banana",
            },
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching food data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
