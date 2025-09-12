const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_V3_KEY;

//Serve the static front end from /public
app.use(express.static(path.join(__dirname, 'public')));

//GET Search API
app.get("/api/search", async(req,res) =>{
    try{
        const query = (req.query.query || "").trim();
        if (!query) return res.status(400).json({
            error: "Missing Query"
        });

        const url = new URL(`${TMDB_BASE}/search/movie`);
        url.searchParams.set("api_key", API_KEY);
        url.searchParams.set("query", query);
        url.searchParams.set("include_adult", "false");

        const r = await fetch(url);
        const data = await r.json();
        return res.status(r.status).json(data);

    }catch(err){
        return res.status(500).json({
            error: "Search failed", detail: String(err)
        });
    }
});

//Similar API
app.get("/api/similar/:id", async(req,res) =>{
    try{
        
        const id = req.params.id;
        const url = new URL(`${TMDB_BASE}/movie/${id}/similar`);
        url.searchParams.set("api_key", API_KEY);

        const r = await fetch(url);
        const data = await r.json();
        return res.status(r.status).json(data);

    }catch(err){
        return res.status(500).json({
            error: "Similar search failed.", detail: String(err)
        });
    }
});

app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
    if(!API_KEY){
        console.log("Missing API Key in .env file")
    }
})