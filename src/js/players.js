// Sample player data
const players = [
  {
    id: "tyrese-haliburton",
    name: "Tyrese Haliburton",
    number: 0,
    image: "images/hali.avif",
    position: "Point Guard",
    stats: {
      points: 20.1,
      rebounds: 3.9,
      assists: 10.8,
      steals: 1.2,
      fg: "48.8%",
      threeP: "36.7%",
      ft: "85.1%",
    },
    height: "6'4\"",
    weight: "185 lbs",
    age: 25,
    college: "Iowa State",
    draft: "2020: 1st Rd. 12th",
    experience: "3 years",
    achievements: ["NBA All-Star [2024]", "NBA All-Rookie First Team [2021]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "pascal-siakam",
    name: "Pascal Siakam",
    number: 43,
    image: "images/siakam.png",
    position: "Forward",
    stats: {
      points: 21.3,
      rebounds: 7.6,
      assists: 4.8,
      steals: 0.9,
      fg: "52.9%",
      threeP: "38.6%",
      ft: "71.3%",
    },
    height: "6'8\"",
    weight: "230 lbs",
    age: 29,
    college: "New Mexico State",
    draft: "2016: 1st Rd. 27th",
    experience: "8 years",
    achievements: ["NBA Champion [2019]", "2x NBA All-Star"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "andrew-nembhard",
    name: "Andrew Nembhard",
    number: 2,
    image: "images/drew.webp",
    position: "Point Guard",
    stats: {
      points: 9.2,
      rebounds: 2.1,
      assists: 4.1,
      steals: 0.8,
      fg: "48.8%",
      threeP: "35.7%",
      ft: "89%",
    },
    height: "6'4\"",
    weight: "191 lbs",
    age: 25,
    college: "Gonzaga",
    draft: "2022: 2nd Rd. 31st",
    experience: "3 years",
    achievements: [
      "NBA All-Rookie Second Team [2023]",
      "WCC Sixth Man of the Year",
    ],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "aaron-nesmith",
    name: "Aaron Nesmith",
    number: 23,
    image: "images/neismith.png",
    position: "Guard",
    stats: {
      points: 12.2,
      rebounds: 3.8,
      assists: 1.5,
      steals: 0.9,
      fg: "50.2%",
      threeP: "40.7%",
      ft: "82%",
    },
    height: "6'5\"",
    weight: "213 lbs",
    age: 25,
    college: "Vanderbilt",
    draft: "2020: 1st Rd. 14th",
    experience: "4 years",
    achievements: ["SEC Freshman of the Year [2019]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "benedict-mathurin",
    name: "Benedict Mathurin",
    number: "00",
    image: "images/mathurin.avif",
    position: "Guard",
    stats: {
      points: 14.5,
      rebounds: 3.7,
      assists: 2.0,
      steals: 0.8,
      fg: "45.9%",
      threeP: "35.8%",
      ft: "78.2%",
    },
    height: "6'6\"",
    weight: "210 lbs",
    age: 22,
    college: "Arizona",
    draft: "2022: 1st Rd. 6th",
    experience: "2 years",
    achievements: [
      "NBA All-Rookie Second Team [2023]",
      "Pac-12 Player of the Year [2022]",
    ],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "tj-mcconnell",
    name: "T.J. McConnell",
    number: 9,
    image: "images/tj.webp",
    position: "Guard",
    stats: {
      points: 9.8,
      rebounds: 2.6,
      assists: 4.3,
      steals: 1.1,
      fg: "57.8%",
      threeP: "41.0%",
      ft: "68.3%",
    },
    height: "6'1\"",
    weight: "190 lbs",
    age: 33,
    college: "Arizona",
    draft: "Undrafted",
    experience: "10 years",
    achievements: ["NBA Hustle Award [2021]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "jay-huff",
    name: "Jay Huff",
    number: 32,
    image: "images/player-placeholder.png",
    position: "Center",
    stats: {
      points: 7.8,
      rebounds: 3.6,
      assists: 1.0,
      steals: 0.5,
      blocks: 1.2,
      fg: "58.0%",
      threeP: "40.0%",
      ft: "78.0%",
    },
    height: "7'1\"",
    weight: "240 lbs",
    age: 28,
    college: "Virginia",
    draft: "Undrafted",
    experience: "4 years",
    achievements: ["ACC Defensive Player of the Year [2021]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "obi-toppin",
    name: "Obi Toppin",
    number: 1,
    image: "images/obiCutout.png",
    position: "Forward",
    stats: {
      points: 10.3,
      rebounds: 3.9,
      assists: 1.5,
      steals: 0.5,
      fg: "57.3%",
      threeP: "40.3%",
      ft: "82.4%",
    },
    height: "6'9\"",
    weight: "220 lbs",
    age: 26,
    college: "Dayton",
    draft: "2020: 1st Rd. 8th",
    experience: "4 years",
    achievements: ["Naismith College Player of the Year [2020]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "ben-sheppard",
    name: "Ben Sheppard",
    number: 26,
    image: "images/shepCutout.png",
    position: "Guard",
    stats: {
      points: 5.1,
      rebounds: 1.8,
      assists: 1.2,
      steals: 0.6,
      fg: "45.8%",
      threeP: "36.4%",
      ft: "75.0%",
    },
    height: "6'6\"",
    weight: "185 lbs",
    age: 23,
    college: "Belmont",
    draft: "2023: 2nd Rd. 26th",
    experience: "1 year",
    achievements: ["Ohio Valley Conference Player of the Year [2023]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "jarace-walker",
    name: "Jarace Walker",
    number: 5,
    image: "images/jaraceCutout.png",
    position: "Forward",
    stats: {
      points: 3.8,
      rebounds: 2.4,
      assists: 0.9,
      steals: 0.4,
      fg: "42.1%",
      threeP: "28.6%",
      ft: "66.7%",
    },
    height: "6'8\"",
    weight: "240 lbs",
    age: 20,
    college: "Houston",
    draft: "2023: 1st Rd. 8th",
    experience: "1 year",
    achievements: ["AAC All-Rookie Team [2023]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "isaiah-jackson",
    name: "Isaiah Jackson",
    number: 22,
    image: "images/JacksonCutout.jpg",
    position: "Forward",
    stats: {
      points: 8.2,
      rebounds: 5.7,
      assists: 1.0,
      steals: 0.6,
      blocks: 2.1,
      fg: "63.0%",
      threeP: "0%",
      ft: "70.0%",
    },
    height: "6'8\"",
    weight: "205 lbs",
    age: 23,
    college: "Kentucky",
    draft: "2021: 1st Rd. 22nd",
    experience: "4 years",
    achievements: ["SEC All-Freshman Team [2021]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "johnny-furphy",
    name: "Johnny Furphy",
    number: 12,
    image: "images/fruphCutout.png",
    position: "Forward",
    stats: {
      points: 2.5,
      rebounds: 1.2,
      assists: 0.3,
      steals: 0.2,
      fg: "38.5%",
      threeP: "33.3%",
      ft: "75.0%",
    },
    height: "6'8\"",
    weight: "202 lbs",
    age: 19,
    college: "Kansas",
    draft: "2024: 2nd Rd. 35th",
    experience: "Rookie",
    achievements: ["Big 12 All-Freshman Team [2024]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "taelon-peter",
    name: "Taelon Peter",
    number: 4,
    image: "images/player-placeholder.png",
    position: "Guard",
    stats: {
      points: 1.8,
      rebounds: 1.2,
      assists: 1.1,
      steals: 0.2,
      fg: "42.0%",
      threeP: "30.0%",
      ft: "70.0%",
    },
    height: "6'3\"",
    weight: "185 lbs",
    age: 23,
    college: "UNC Greensboro",
    draft: "Undrafted",
    experience: "Rookie",
    achievements: ["Southern Conference Player of the Year [2024]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "kam-jones",
    name: "Kam Jones",
    number: 7,
    image: "images/player-placeholder.png",
    position: "Guard",
    stats: {
      points: 0.0,
      rebounds: 0.0,
      assists: 0.0,
      steals: 0.0,
      fg: "0%",
      threeP: "0%",
      ft: "0%",
    },
    height: "6'4\"",
    weight: "200 lbs",
    age: 23,
    college: "Marquette",
    draft: "2024: 2nd Rd. 49th",
    experience: "Rookie",
    achievements: ["Big East Player of the Year [2024]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "tony-bradley",
    name: "Tony Bradley",
    number: 13,
    image: "images/player-placeholder.png",
    position: "Center",
    stats: {
      points: 4.9,
      rebounds: 2.7,
      assists: 0.7,
      steals: 0.3,
      blocks: 0.5,
      fg: "58.0%",
      threeP: "0%",
      ft: "65.0%",
    },
    height: "6'10\"",
    weight: "248 lbs",
    age: 27,
    college: "North Carolina",
    draft: "2017: 1st Rd. 28th",
    experience: "7 years",
    achievements: ["NCAA Champion [2017]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "garrison-mathews",
    name: "Garrison Mathews",
    number: 24,
    image: "images/player-placeholder.png",
    position: "Guard",
    stats: {
      points: 4.0,
      rebounds: 0.7,
      assists: 0.5,
      steals: 0.3,
      fg: "42.0%",
      threeP: "38.5%",
      ft: "85.0%",
    },
    height: "6'5\"",
    weight: "215 lbs",
    age: 29,
    college: "Lipscomb",
    draft: "Undrafted",
    experience: "6 years",
    achievements: ["ASUN Player of the Year [2019]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "jeremiah-robinson-earl",
    name: "Jeremiah Robinson-Earl",
    number: 25,
    image: "images/player-placeholder.png",
    position: "Forward",
    stats: {
      points: 4.8,
      rebounds: 5.4,
      assists: 0.8,
      steals: 0.4,
      fg: "45.0%",
      threeP: "32.0%",
      ft: "75.0%",
    },
    height: "6'9\"",
    weight: "240 lbs",
    age: 25,
    college: "Villanova",
    draft: "2021: 2nd Rd. 32nd",
    experience: "4 years",
    achievements: ["NCAA Champion [2018]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "quenton-jackson",
    name: "Quenton Jackson",
    number: 29,
    image: "images/QuentonCutout.png",
    position: "Guard",
    stats: {
      points: 11.8,
      rebounds: 3.4,
      assists: 3.6,
      steals: 0.6,
      fg: "48.0%",
      threeP: "40.0%",
      ft: "80.0%",
    },
    height: "6'4\"",
    weight: "173 lbs",
    age: 27,
    college: "Texas A&M",
    draft: "Undrafted",
    experience: "3 years",
    achievements: ["SEC Sixth Man of the Year [2022]"],
    logo: "images/reggieandsiakam.png",
  },
  {
    id: "ethan-thompson",
    name: "Ethan Thompson",
    number: 55,
    image: "images/player-placeholder.png",
    position: "Guard",
    stats: {
      points: 2.0,
      rebounds: 0.0,
      assists: 1.0,
      steals: 0.0,
      fg: "50.0%",
      threeP: "0%",
      ft: "0%",
    },
    height: "6'4\"",
    weight: "195 lbs",
    age: 26,
    college: "Oregon State",
    draft: "Undrafted",
    experience: "Rookie",
    achievements: ["All-Pac-12 First Team [2021]"],
    logo: "images/reggieandsiakam.png",
  },
];

const grid = document.getElementById("players-grid");
const modal = document.getElementById("player-modal");
const searchInput = document.getElementById("player-search");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");

let currentPage = 1;
const playersPerPage = 6;

function renderPlayers(filter = "all", search = "", page = 1) {
  grid.innerHTML = "";
  let filtered = players.filter((p) => {
    const matchesFilter =
      filter === "all" ||
      p.position.toLowerCase().includes(filter.replace("s", "")); // "guards" -> "guard"
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const startIndex = (page - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const paginatedPlayers = filtered.slice(startIndex, endIndex);

  paginatedPlayers.forEach((player) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <div class="player-img"><img src="${player.image}" alt="${player.name}"></div>
      <div class="player-info">
        <h2>${player.name} <span class="player-number">#${player.number}</span></h2>
        <div class="player-position">${player.position}</div>
        <div class="player-stats">${player.stats.points} PPG, ${player.stats.rebounds} RPG, ${player.stats.assists} APG</div>
      </div>
    `;
    card.onclick = () =>
      (window.location.href = `player-profile.html?id=${player.id}`);
    grid.appendChild(card);
  });

  // Show/hide pagination buttons
  if (nextPageBtn) {
    nextPageBtn.style.display = endIndex < filtered.length ? "flex" : "none";
  }
  if (prevPageBtn) {
    prevPageBtn.style.display = page > 1 ? "flex" : "none";
  }
}

function showProfile(player) {
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" onclick="closeModal()">Back to Players</button>
      <div class="profile-header">
        <img src="${player.image}" alt="${player.name}" class="profile-img">
        <div>
          <h1>${player.name} <span>#${player.number}</span></h1>
          <h2>${player.position}</h2>
        </div>
      </div>
      <div class="profile-stats">
        <h3>Season Stats</h3>
        <table>
          <tr><th>Stat</th><th>Value</th></tr>
          <tr><td>Points</td><td>${player.stats.points}</td></tr>
          <tr><td>Rebounds</td><td>${player.stats.rebounds}</td></tr>
          <tr><td>Assists</td><td>${player.stats.assists}</td></tr>
          <tr><td>Steals</td><td>${player.stats.steals}</td></tr>
          <tr><td>FG%</td><td>${player.stats.fg}</td></tr>
          <tr><td>3P%</td><td>${player.stats.threeP}</td></tr>
          <tr><td>FT%</td><td>${player.stats.ft}</td></tr>
        </table>
      </div>
      <div class="profile-details">
        <div><strong>Height</strong><span>${player.height}</span></div>
        <div><strong>Weight</strong><span>${player.weight}</span></div>
        <div><strong>Age</strong><span>${player.age}</span></div>
        <div><strong>College</strong><span>${player.college}</span></div>
        <div><strong>Draft</strong><span>${player.draft}</span></div>
        <div><strong>Experience</strong><span>${player.experience}</span></div>
      </div>
      <div class="profile-achievements">
        <h3>Achievements</h3>
        <ul>
          ${player.achievements.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </div>
      <div class="profile-logo"><img src="${
        player.logo
      }" alt="Pacers Logo"></div>
    </div>
  `;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

searchInput.addEventListener("input", (e) => {
  currentPage = 1;
  renderPlayers(getActiveFilter(), e.target.value, currentPage);
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentPage = 1;
    renderPlayers(getActiveFilter(), searchInput.value, currentPage);
  });
});

if (nextPageBtn) {
  nextPageBtn.addEventListener("click", () => {
    currentPage++;
    renderPlayers(getActiveFilter(), searchInput.value, currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (prevPageBtn) {
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPlayers(getActiveFilter(), searchInput.value, currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function getActiveFilter() {
  return document.querySelector(".filter-buttons .active").dataset.filter;
}

renderPlayers();
window.closeModal = closeModal;
