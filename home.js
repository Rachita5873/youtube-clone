const api = "AIzaSyCJJZSTYYoDE6GyzEc2xVOjQJBpbQitpEM";
const baseURL = "https://www.googleapis.com/youtube/v3";
const container = document.getElementById("container");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("input1");


function calculateTimeGap(publishTime){
let publishDate = new Date(publishTime);
let currentDate = new Date();
let secondsGap = (currentDate.getTime() - publishDate.getTime())/ 1000;
const secondsPerDay = 24*60*60;
const secondsPerWeek = 7 * secondsPerDay;
const secondsPerMonth = 30 * secondsPerDay;
const secondsPerYear = 365 * secondsPerDay;

if(secondsGap < secondsPerDay){
    return `${Math.ceil(secondsGap/(60*60))} hrs ago`;
}
if(secondsGap < secondsPerWeek){
    return `${Math.ceil(secondsGap/secondsPerWeek)} weeks ago`;
}
if(secondsGap < secondsPerMonth){
    return `${Math.ceil(secondsGap/secondsPerMonth)} months ago`;
}

    return `${Math.ceil(secondsGap/secondsPerYear)} years ago`;

}

async function fetchChannelLogo(channelId){
    const endpoint = `${baseURL}/channels?key=${api}&id=${channelId}&part=snippet`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0].snippet.thumbnails.high.url;
    }
    catch (error) {
        alert("failed to load channel for ", channelId);
    }
}

function navigateToVideoDetails(videoId){
document.cookie = `id=${videoId}; path=/playvideo.html`;
    window.location.href="http://127.0.0.1:5500/playvideo.html";

}

async function getVideoStats(videoId){
const endpoint = `${baseURL}/videos?key=${api}&part=statistics&id=${videoId}`;
try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].statistics;
}
catch (error) {
    alert("failed stats", videoId);
}
}

function renderVideosOnUI(videoList) {
    container.innerHTML="";
    videoList.forEach((video) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video";
        videoContainer.innerHTML = `<img src="${video.snippet.thumbnails.high.url}" alt="" class="thumbnail" />
<div class="bottom-container">
    <div class="logo-container">
        <img class="logo" src="${video.channelLogo}" alt="" >
    </div>
    <div class="title-container">
    <p class="title">${video.snippet.title}</p>
    <p class="gray-text">${video.snippet.channelTitle}</p>
    <p class="gray-text">${video.statistics.viewCount} . ${calculateTimeGap(video.snippet.publishTime)}</p>
</div>
</div>`;
videoContainer.addEventListener("click", ()=>{
    navigateToVideoDetails(video.id.videoId);
})

container.appendChild(videoContainer);
    });

}

async function fetchSearchResult(searchString) {
    const endpoint = `${baseURL}/search?key=${api}&q=${searchString}&part=snippet&maxResults=20`
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        for(let i=0; i<result.items.length; i++){
            let currentVideoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;
            const currentVideoStats = await getVideoStats(currentVideoId);
            let channelLogo = await fetchChannelLogo(channelId);
            result.items[i].statistics = currentVideoStats;
            result.items[i].channelLogo = channelLogo;
        }
        renderVideosOnUI(result.items);
    }
    catch (error) {
        alert("error occurred");
    }
}

searchButton.addEventListener("click", () => {
    const searchValue = input1.value;
    fetchSearchResult(searchValue);
});

fetchSearchResult("");