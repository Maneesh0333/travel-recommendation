const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let travelData = {};

fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

searchBtn.addEventListener("click", searchRecommendations);
clearBtn.addEventListener("click", clearResults);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchRecommendations();
});

function searchRecommendations() {
  const keyword = searchInput.value.trim().toLowerCase();

  results.innerHTML = "";

  if (!keyword) return;

  let places = [];

  // Beach
  if (keyword === "beach" || keyword === "beaches") {
    places = travelData.beaches;
  }
  // Temple
  else if (keyword === "temple" || keyword === "temples") {
    places = travelData.temples;
  }
  // Country / Countries
  else if (keyword === "country" || keyword === "countries") {
    travelData.countries.forEach((country) => {
      country.cities.forEach((city) => {
        places.push(city);
      });
    });
  }
  // Search by specific country name
  else {
    const country = travelData.countries.find(
      (c) => c.name.toLowerCase() === keyword,
    );

    if (country) {
      places = country.cities;
    }
  }

  if (!places || places.length === 0) {
    results.innerHTML = "<h2 style='color:#ff9800'>No recommendations found.</h2>";
    return;
  }

  displayResults(places);
}

function displayResults(places) {
  let heading = document.createElement("h2");
  heading.textContent = "Search Results";
  heading.style.color = "#ff9800";
  heading.style.marginBottom = "25px";
  heading.style.gridColumn = "1 / -1";
  results.appendChild(heading);

  places.forEach((place) => {
    results.innerHTML += `
        <div class="place">
            <img src="${place.imageUrl}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
        </div>
        `;
  });
}

function clearResults() {
  searchInput.value = "";
  results.innerHTML = "";
}
