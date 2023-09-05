const api = "AIzaSyCJJZSTYYoDE6GyzEc2xVOjQJBpbQitpEM";
const baseURL = "https://www.googleapis.com/youtube/v3";

const container1 = document.getElementById("comments-container");

window.addEventListener("load", () => {
let videoId = document.cookie.split("=")[1];
  if (YT) {
  new YT.Player("video-placeholder", {
    height: "300",
    width: "500",
    videoId, 
  });
  loadComments(videoId);
}
});


async function loadComments(videoId){
  let endpoint = `${baseURL}?key=${api}&videoId=${videoId}&maxResults=10&part=snippet`;
  const response = await fetch(endpoint);
  const result = await response.json();

  result.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      likeCount,
      authorProfileImageUrl: profileUrl,
      publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className="comment";
    div.innerHTML=`<b>${authorDisplayName}</b>
    <p>${textDisplay}</p>`;
    container1.appendChild(div);

  });
}