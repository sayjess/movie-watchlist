const movieListEl = document.getElementById('movie-list')
const searchButtonEl = document.getElementById('search-btn')
const inputEl = document.getElementById('user-input')
const loadingSpinner = document.getElementById('loading-spinner')


document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        handleAddWatchlist(e.target.dataset.add)
    } else if(e.target.dataset.remove){
        handleRemoveWatchlist(e.target.dataset.remove)
    }
})

function handleRemoveWatchlist(imdbID){
    const storedData = JSON.parse(localStorage.getItem('dataListArrays')) || []
    const updatedData = storedData.filter(item => item.imdbID !== imdbID)
    if (updatedData.length === 0) {
        localStorage.removeItem('dataListArrays');
      } else {
        localStorage.setItem('dataListArrays', JSON.stringify(updatedData))
    }
    renderWatchList()
}



function handleAddWatchlist(imdbID) {
    if(localStorage.getItem('dataListArrays') === null) {
        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=55262bf2&plot=short`)
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('dataListArrays', JSON.stringify([data]))
                })
   } else {
        const existingData = JSON.parse(localStorage.getItem('dataListArrays')) || [];

        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=55262bf2&plot=short`)
                .then(res => res.json())
                .then(data => {
                    const isDataAlreadyExists = existingData.some(item => item.imdbID === imdbID);
                    if (!isDataAlreadyExists) {
                        existingData.push(data)
                        localStorage.setItem('dataListArrays', JSON.stringify(existingData))
                    }
                })
   }
}

function renderWatchList() {
    const watchListContainer = document.getElementById('watch-list')
    const watchlistData = localStorage.getItem('dataListArrays')
    const parsedWatchlist = JSON.parse(watchlistData)
    if (parsedWatchlist && parsedWatchlist.length > 0) {
        const watchListHTML = parsedWatchlist.map(movie => {
            const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = movie;
            return `
            <div class="movie flex">
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
                        <p class="movie-info">${Runtime ? Runtime : 'N/A'}</p>
                        <p class="movie-info">${Genre ? Genre : 'N/A'}</p>
                        <span class='watchlist-container flex' data-remove='${imdbID}>
                            <i class="fa-solid fa-circle-minus" data-remove='${imdbID}'></i>
                            <p data-remove='${imdbID}'>Remove</p>
                        </span>
                    </div>
                    <p class="movie-plot">${Plot ? Plot : 'N/A'}</p>
                </div>
            </div>
        `
        })
        watchListContainer.innerHTML = watchListHTML
    } else {
        watchListContainer.innerHTML = `
            <div class="empty flex">
                <p>Your watchlist is looking a little empty...</p>
                <a href='index.html' class="add-movies-container flex">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p class="add-movies-txt">Let’s add some movies!</p>
                </a>
            </div>
        `
    }
}


async function getMovieDetails() {
    loadingSpinner.style.display = 'block'
    const title = inputEl.value
    if (title) {
        const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=55262bf2&s=${title}`)
        const data = await response.json()
        if (data.Error !== "Movie not found!"){
            const movies = data.Search
            const detailedMovies = []
            for (const movie of movies) {
                const imdbID = movie.imdbID
                const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=55262bf2&plot=short`)
                const detailedMovie = await response.json()
                detailedMovies.push(detailedMovie)
            }
            loadingSpinner.style.display = 'none'
            displayMovies(detailedMovies)
        } else {
            loadingSpinner.style.display = 'none'
            document.getElementById('explore').textContent = "Not available"
        }

    }
}

function displayMovies(movies) {
    const movieListHTML = movies.map(function(movie) {
        const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = movie;
        return `
            <div class="movie flex">
                <img class="movie-poster" src="${Poster !== 'N/A' ? Poster : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.png'}" alt="${Title}">
                <div class='movie-details flex'>
                    <div class='movie-details-one flex'>
                        <h2 class="movie-title">${Title}</h2>
                        <span class='rating-container flex'>
                            <i class="fa-solid fa-star"></i>
                            <p class="movie-rating">${imdbRating ? imdbRating : 'N/A'}</p>
                        </span>
                    </div>
                    <div class='movie-details-two flex'>
                        <p class="movie-info">${Runtime ? Runtime : 'N/A'}</p>
                        <p class="movie-info">${Genre ? Genre : 'N/A'}</p>
                        <button class='watchlist-container flex' data-add='${imdbID}>
                            <i class="fa-solid fa-circle-plus" data-add='${imdbID}'></i>
                            <p class='watchlist-text' data-add='${imdbID}'>Watchlist</p>
                        </button>
                    </div>
                    <p class="movie-plot">${Plot ? Plot : 'N/A'}</p>
                </div>
            </div>
        `
    }).join('')
    movieListEl.innerHTML = movieListHTML
}

if (document.body.classList.contains('index-page')) {
    searchButtonEl.addEventListener('click', getMovieDetails)
} else if (document.body.classList.contains('watchlist-page')) {
    document.addEventListener('DOMContentLoaded', renderWatchList)
}