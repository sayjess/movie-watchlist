const movieListEl = document.getElementById('movie-list');
const searchButtonEl = document.getElementById('search-btn');
const inputEl = document.getElementById('user-input');
const loadingSpinner = document.getElementById('loading-spinner');

async function getMovieDetails() {
    loadingSpinner.style.display = 'block';
    // const title = inputEl.value;
    const title = 'blade runner'
    if (title) {
        const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=55262bf2&s=${title}`);
        const data = await response.json();
        const movies = data.Search;
        const detailedMovies = [];

        for (const movie of movies) {
            const imdbID = movie.imdbID;
            const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=55262bf2&plot=short`);
            const detailedMovie = await response.json();
            detailedMovies.push(detailedMovie);
        }
        loadingSpinner.style.display = 'none';
        displayMovies(detailedMovies);
    }
}

function displayMovies(movies) {
    const movieListHTML = movies.map(function(movie) {
        const { Poster, Title, imdbRating, Runtime, Genre, Plot } = movie;

        return `
            <div class="flex">
                <img class="movie-poster" src="${Poster !== 'N/A' ? Poster : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.png'}" alt="${Title}">
                <div class='movie-details flex'>
                    <div class='movie-details-one flex'>
                        <h2 class="movie-title">${Title}</h2>
                        <span class='flex'>
                            <i class="fa-solid fa-star"></i>
                            <p class="movie-rating">${imdbRating ? imdbRating : 'N/A'}</p>
                        </span>
                    </div>
                    <div class='movie-details-two flex'>
                        <p class="movie-info">Duration: ${Runtime ? Runtime : 'N/A'}</p>
                        <p class="movie-info">Genre: ${Genre ? Genre : 'N/A'}</p>
                        <span class='flex'>
                            <i class="fa-solid fa-circle-plus"></i>
                            <p>Watchlist</p>
                        </span>
                    </div>
                    <p class="movie-plot">${Plot ? Plot : 'N/A'}</p>
                </div>
            </div>
        `
    }).join('')

    movieListEl.innerHTML = movieListHTML
}

// searchButtonEl.addEventListener('click', getMovieDetails);

getMovieDetails()
