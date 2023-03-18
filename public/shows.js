const hasWatchedButtons = document.querySelectorAll(".has-watched-button");
const isFavoriteButtons = document.querySelectorAll(".is-favorite-button");

hasWatchedButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        
        const hasWatched = event.target.dataset.hasWatched === "true" ? true : false;
        console.log(`clicked hasWatchedButton; hasWatched: ${hasWatched}`);
        const hasWatchedNewValue = !hasWatched;
        
        const body = JSON.stringify({
            showId: event.target.value,
            hasWatched: hasWatchedNewValue
        });
        
        fetch("/has-watched", { 
            method: "PUT", 
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (response.ok) {
                console.log("fetch response ok");
                event.target.dataset.hasWatched = hasWatchedNewValue;
                event.target.innerHTML = hasWatchedNewValue ? "Watched" : "Not Watched";
            }
            else {
                console.error("fetch response not ok");
            }
        });
        
    });
});

isFavoriteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        
        const isFavorite = event.target.dataset.isFavorite === "true" ? true : false;
        console.log(`clicked isFavoriteButton; isFavorite: ${isFavorite}`);
        const isFavoriteNewValue = !isFavorite;
        
        const body = JSON.stringify({
            showId: event.target.value,
            isFavorite: isFavoriteNewValue
        });
        
        fetch("/is-favorite", { 
            method: "PUT", 
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (response.ok) {
                console.log("fetch response ok");
                event.target.dataset.isFavorite = isFavoriteNewValue;
                event.target.innerHTML = isFavoriteNewValue ? "Favorite" : "Not Favorite";
            }
            else {
                console.error("fetch response not ok");
            }
        });
        
    });
});
