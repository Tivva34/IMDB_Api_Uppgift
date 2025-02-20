console.log("Script.js is loaded!");

import { fetchFavoriteMovies, fetchTopMovies, fetchMovieDetails, searchMovies } from "./modules/api.js";
import { createMovieCard } from "./components/movieCard.js";
import { renderElements } from "./utils/domUtils.js";
import { renderTrailers } from "./modules/caroussel.js";

// Objekt för att initiera olika sidor baserat på URL
const pageInitializers = {
    'index.html': initializeHomePage,
    'favorites.html': initializeFavoritesPage,
    'movie.html': initializeMoviePage,
    'search.html': initializeSearchPage
};

const currentPage = window.location.pathname.split('/').pop();  // Ta bort / i pathname

// Kolla vilken sida som är aktiv
const initializePage = pageInitializers[currentPage];

if (initializePage) {
    initializePage();  // Kalla på initializer för current page
} else {
    console.error('No initializer found for this page:', currentPage);
}

// Funktion för att initiera söksidan
async function initializeSearchPage() {
    const cardContainer = document.getElementById("cardContainer");
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    console.log("Sökfråga:", query); // Logga för att säkerställa att sökfrågan funkar

    if (query) {
        const searchInput = document.getElementById("searchInput"); // Säkerställ att input finns
        if (searchInput) {
            searchInput.value = query; // Fyll input med sökfrågan
        }

        try {
            // Skicka sökfrågan till API-funktionen
            const searchResults = await searchMovies(query);
            console.log("Fullständigt API-svar:", searchResults); // Logga hela API-svaret

            // Kontrollera om svar innehåller sökresultat
            if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
                const movies = searchResults;  // Använd hela arrayen istället för searchResults.
                console.log("Sökresultat:", movies); // logga för att se om vi får några resultat

                if (movies.length === 0) {
                    cardContainer.innerHTML = "<p>No results found for your search.</p>";
                    return;
                }

                // Töm cardContainer innan vi lägger till nya kort
                cardContainer.innerHTML = '';

                // Skapa filmkorten för varje film vi får tillbaks från api
                const movieCards = movies
                    .filter(movie => movie.Title && movie.Year && movie.Poster) // Filtrera bort filmer utan all nödvändig data
                    .map(movie => createMovieCard({
                        id: movie.imdbID,
                        title: movie.Title,
                        year: movie.Year,
                        poster: movie.Poster || './res/missing-poster.jpg', // Fallback-bild om ingen finns
                    }));

                console.log("Renderar filmkort:", movieCards); // Logga vilka kort som renderas

                // Lägg till filmkorten i DOM
                movieCards.forEach(card => {
                    console.log("Lägger till kort:", card); // Logga varje kort som läggs till
                    if (card) {
                        cardContainer.appendChild(card);
                    }
                });
            } else {
                cardContainer.innerHTML = "<p>No results found for your search.</p>";
            }
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            cardContainer.innerHTML = "<p>Failed to load search results.</p>";
        }
    } else {
        cardContainer.innerHTML = "<p>No query parameter provided in URL.</p>";
    }
}

// initiera startsidan
async function initializeHomePage() {
    try {
        // Hämta favoritfilmer från Jespers API
        const favoriteMovies = await fetchFavoriteMovies();

        if (!favoriteMovies || favoriteMovies.length === 0) {
            console.error("No movies found in the custom API.");
            return;
        }

        // Rendera trailers
        for (let i = 0; i < Math.min(favoriteMovies.length, 5); i++) {
            renderTrailers(favoriteMovies[i], i + 1); // Laddar varje film och dess index (1–5)
        }

        // Rendera kort för favoritfilmer
        const container = document.getElementById('movie-cards-container');
        const movieCards = favoriteMovies
            .filter(movie => movie.title && movie.year && movie.poster) // Filtrera bort filmer utan all nödvändig data
            .map(movie => createMovieCard({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                poster: movie.poster || './res/missing-poster.jpg' // Fallback för poster om den saknas
            }));
        movieCards.forEach(card => {
            if (card) { // Kontrollera om kortet är giltigt innan vi lägger till det
                container.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Failed to initialize homepage with custom API:", error);
        document.getElementById("cardContainer").innerHTML = "<p>Failed to load movies.</p>";
    }
    //försöker dela upp på flera sidor
    // Hämta populära filmer (20 stycken: 2 sidor 10 filmer)
    try {
        const topMoviesPage1 = await fetchTopMovies(1); // Hämta filmer från första sidan
        const topMoviesPage2 = await fetchTopMovies(2); // Hämta filmer från andra sidan

        // Kombinera filmer från båda sidor
        const topMovies = [...topMoviesPage1, ...topMoviesPage2];

        if (topMovies.length > 0) {
            const cardContainer = document.getElementById("cardContainer");

            // Skapa filmkort för varje film
            const movieCards = topMovies
                .filter(movie => movie.Title && movie.Year && movie.Poster) // Filtrera filmer med fullständig data
                .map(movie => createMovieCard({
                    id: movie.imdbID,
                    title: movie.Title,
                    year: movie.Year,
                    poster: movie.Poster || './res/missing-poster.jpg', // Använd fallback-bild om ingen finns
                }));

            // Lägg till korten i DOM
            movieCards.forEach(card => {
                if (card) { // Kontrollera så vi inte försöker lägga till ogiltiga kort
                    cardContainer.appendChild(card);
                }
            });
        } else {
            console.log("No top movies found.");
        }
    } catch (error) {
        console.error("Failed to load additional top movies:", error);
    }
}

// Funktion för att initiera filmsidan
async function initializeMoviePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get("id");

    if (!imdbID) {
        console.error("No movie ID found in URL.");
        return;
    }

    try {
        const movieDetails = await fetchMovieDetails(imdbID);
        renderMovieDetails(movieDetails);
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
    }
}

// Rendera filminformation på en specifik film (filmvisningssidan)
function renderMovieDetails(movie) {
    const movieInfoContainer = document.getElementById("movieInformation");
    movieInfoContainer.innerHTML = `
        <h1>${movie.Title}</h1>
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <p>${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Year:</strong> ${movie.Year}</p>
    `;
}

// Funktion för att initiera favoritsidan
function initializeFavoritesPage() {
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const cardContainer = document.getElementById("cardContainer");

    if (favorites.length === 0) {
        cardContainer.innerHTML = "<p>You have no favorite movies yet.</p>";
        return;
    }

    const movieCards = favorites
        .filter(movie => movie.title && movie.year && movie.poster) // Filtrera bort filmer utan fullständig data
        .map(createMovieCard);
    renderElements(cardContainer, movieCards);
}

// Lyssnare för att hantera sökformulär
document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    // Kontrollera om elementen finns i DOM
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Förhindra att sidan laddas om vid form submission

            const query = searchInput.value.trim(); // Hämtar användarens söktext

            // Om inget är skrivet i sökfältet, gör inget
            if (query === "") {
                return;
            }

            // Omdirigera till rätt URL beroende på sökfrågan
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        });
    }
});
