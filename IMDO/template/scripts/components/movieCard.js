export function createMovieCard(movie) {
    // Kontrollera om filmens data finns
    const title = movie.title || "Unknown Title";  // Om titel saknas, använd fallback
    const year = movie.year || "Unknown Year";  // Om år saknas, använd fallback
    const poster = movie.poster || './res/missing-poster.jpg';  // Om poster saknas, använd fallback
    const imdbID = movie.id || "Unknown ID";  // Om film-ID saknas, använd fallback

    // Skapa en div för filmkortet
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Lägg till detaljer i kortet
    card.innerHTML = `
        <img src="${poster}" alt="${title}" class="movie-card__poster" />
        <h3 class="movie-card__title">${title}</h3>
        <p class="movie-card__year">${year}</p>
    `;

    // klick-event för att navigera till filmens detaljsida
    card.addEventListener('click', () => {
        window.location.href = `movie.html?id=${imdbID}`;
    });

    // Returnera skapade kortet
    return card;
}
