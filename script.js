const API_URL =
  "https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest";
const videoList = document.getElementById("video-list");
const searchInput = document.getElementById("search");
const options = { method: "GET", headers: { accept: "application/json" } };

let allVideos = [];

// Fetch videos from API
async function fetchVideos() {
  try {
    const response = await fetch(API_URL, options);
    const data = await response.json();

    //console.log("API Response:", data.data.data[0].items.id); // Debugging step

    // Check if data structure is correct
    if (data && data.data && Array.isArray(data.data.data)) {
      allVideos = data.data.data; // Store all videos for filtering
      displayVideos(allVideos);
    } else {
      console.error("Invalid API response format");
      videoList.innerHTML = "<p>Error loading videos. Please try again.</p>";
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    videoList.innerHTML =
      "<p>Failed to fetch videos. Check console for details.</p>";
  }
}

// Display videos on page
function displayVideos(videos) {
  videoList.innerHTML = ""; // Clear previous results

  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");
    videoCard.innerHTML = `
            <img src="${video.items.snippet.thumbnails.standard.url}" alt="${video.items.snippet.localized.title}">
            <h3>${video.items.snippet.localized.title}</h3>
            <p>${video.items.snippet.channelTitle}</p>
        `;

    videoCard.addEventListener("click", () => {
      window.open(
        `https://www.youtube.com/watch?v=${video.items.id}`,
        "_blank"
      );
    });

    videoList.appendChild(videoCard);
  });
}

// Filter videos based on search input
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredVideos = allVideos.filter(
    (video) =>
      video.items.snippet.localized.title.toLowerCase().includes(searchTerm) ||
      video.items.snippet.channelTitle.toLowerCase().includes(searchTerm)
  );
  displayVideos(filteredVideos);
});

// Load videos on page load
fetchVideos();
