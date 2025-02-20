const Api_Key = "301ede5"; // API-nyckel
const Base_URL = "http://www.omdbapi.com/"; // Base URL för OMDB

// Fetch favorite movies från Jespers API
export async function fetchFavoriteMovies() {
    const url = "https://santosnr6.github.io/Data/favoritemovies.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching favorite movies:", error);
        return []; // Återvänd en tom lista vid fel
    }
}

// Fetch movie details genom IMDB ID
export async function fetchMovieDetails(movieID) {
    const url = `${Base_URL}?apikey=${Api_Key}&i=${movieID}&plot=full`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            throw new Error(`Movie not found: ${data.Error}`);
        }
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null; // Returnerar null om något går fel
    }
}

// Fetch movies baserat på sökning i OMDB API
export async function searchMovies(query) {
    const url = `${Base_URL}?apikey=${Api_Key}&s=${encodeURIComponent(query)}&page=1`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            console.warn(`No results found for query: "${query}"`);
            return [];
        }
        return data.Search || []; // Returnera filmer om det finns
    } catch (error) {
        console.error("Error searching for movies:", error);
        return []; // Om något går fel, returnera en tom array
    }
}

// Fetch top movies från OMDB API
export async function fetchTopMovies(page) {
    const url = `${Base_URL}?apikey=${Api_Key}&s=popular&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            console.warn("No top movies found:", data.Error);
            return [];
        }
        return data.Search || []; // Returnera filmer om det finns
    } catch (error) {
        console.error("Error fetching top movies:", error);
        return []; // Om något går fel, returnera en tom array
    }
}

// Fetch movies baserat på genre (t.ex. komedi, action etc.)
export async function fetchMoviesByGenre(genre, page = 1) {
    const url = `${Base_URL}?apikey=${Api_Key}&s=${encodeURIComponent(genre)}&type=movie&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            console.warn(`No results found for genre: "${genre}"`);
            return [];
        }
        return data.Search || []; // Returnera filmer om det finns
    } catch (error) {
        console.error(`Error fetching movies by genre (${genre}):`, error);
        return []; // Om något går fel, returnera en tom array
    }
}

// Fetch movies baserat på år 
export async function fetchMoviesByYear(year, page = 1) {
    const url = `${Base_URL}?apikey=${Api_Key}&y=${encodeURIComponent(year)}&type=movie&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            console.warn(`No results found for year: "${year}"`);
            return [];
        }
        return data.Search || []; // Returnera filmer om det finns
    } catch (error) {
        console.error(`Error fetching movies by year (${year}):`, error);
        return []; // Om något går fel, returnera en tom array
    }
}

// Fetch movies baserat på land
export async function fetchMoviesByCountry(country, page = 1) {
    const url = `${Base_URL}?apikey=${Api_Key}&s=movie&country=${encodeURIComponent(country)}&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
            console.warn(`No results found for country: "${country}"`);
            return [];
        }
        return data.Search || []; // Returnera filmer om det finns
    } catch (error) {
        console.error(`Error fetching movies by country (${country}):`, error);
        return []; // Om något går fel, returnera en tom array
    }
}
