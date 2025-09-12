const resultsList = document.getElementById("results");
const similarList = document.getElementById("similar");
const similarSection = document.getElementById("similarSection");
const similarSearchSection = document.getElementById("similarSearchSection");
const pickedTitle = document.getElementById("pickedTitle");
const form = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
///
const IMG_BASE = "https://image.tmdb.org/t/p/w342";


function renderCards(movies, container, onClick){
    container.innerHTML = "";
    if(!movies || movies.length === 0){
        container.innerHTML=`<li class="empty">No Results Found.</li>`;
        return;
    }

    movies.forEach(m => {
        const card = document.createElement("li");
        card.className = "card";

        //poster image
        const img = document.createElement("img");
        img.alt = m.title || "poster";
        if(m.poster_path){
            img.src=`${IMG_BASE}${m.poster_path}`;
        }else{
            img.src = "placeholder.png";
            img.alt = "No poster available";
        }
        card.appendChild(img);

        const metadata = document.createElement("div");
        metadata.className = "meta";

        //title
        const h3 = document.createElement("h3");
        if (m.title){
            h3.textContent= m.title;
        } else if (m.name){
            h3.textContent = m.name;
        } else{
            h3.textContent = "Untitled"
        }
        metadata.appendChild(h3);

        //Year
        const p = document.createElement("p");
        p.className = "sub";
        let year = "-";
        if(m.release_date){
            year = m.release_date.slice(0,4);
        }
        p.textContent = year;
        metadata.appendChild(p);

        card.appendChild(metadata);

        //Event
        card.addEventListener("click", () => onClick(m));
        container.appendChild(card);
    });
}

//Search Form Submit
form.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const query = queryInput.value.trim();
    if (!query){
        alert("Please type a movie title.");
        return;
    }

    resultsList.innerHTML = `<li class="empty">Loading...</li>`;
    similarSection.hidden = true; //Keeps more similar movies hidden

    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if(!res.ok){
        resultsList.innerHTML=`<li>Search failed. Please try again. </li>`;
        return;
    }

    const data = await res.json();
    renderCards(data.results, resultsList, (movie) =>{
        loadSimilar(movie.id, movie.title)
    });
    similarSearchSection.hidden = false;     
});

//Loads the similar movie titles
async function loadSimilar(movieId, title){
    pickedTitle.textContent = title;
    similarSection.hidden = false;
    // similarSearchSection.hidden = false;

    similarList.innerHTML+`<li class="empty">Loading...</li>`

    const res = await fetch(`/api/similar/${movieId}`);
    if(!res.ok){
        similarList.innerHTML= `<li>Could not load similar movie titles.</li>`;
        return;
    }

    const data = await res.json();
    renderCards(data.results, similarList, (m) =>{
        loadSimilar(m.id, m.title)
    });
    similarSection.scrollIntoView({behavior:"smooth"});
}