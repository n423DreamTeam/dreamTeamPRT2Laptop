const players = [
  {
    id: "tyrese-haliburton",
    name: "Tyrese Haliburton",
    number: 0,
    image: "images/HaliCutout.jpg",
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
    image: "images/siakamCutout.png",
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
    logo: "images/pacerslogo.png",
  },
  {
    id: "andrew-nembhard",
    name: "Andrew Nembhard",
    number: 2,
    image: "images/NEMBY.png",
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
    image: "images/neismithCutout.png",
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
    logo: "images/pacerslogo.png",
  },
  {
    id: "benedict-mathurin",
    name: "Benedict Mathurin",
    number: "00",
    image: "images/mathurinCutout.png",
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
    logo: "images/pacerslogo.png",
  },
  {
    id: "tj-mcconnell",
    name: "T.J. McConnell",
    number: 9,
    image: "images/TJCutout.jpg",
    position: "Guard",
    stats: {
      points: 10.2,
      rebounds: 3.9,
      assists: 6.5,
      steals: 1.9,
      fg: "57.8%",
      threeP: "41.0%",
      ft: "68.3%",
    },
    height: "6'1\"",
    weight: "190 lbs",
    age: 32,
    college: "Arizona",
    draft: "Undrafted",
    experience: "10 years",
    achievements: ["NBA Hustle Award [2021]"],
    logo: "images/pacerslogo.png",
  },
  {
    id: "jay-huff",
    name: "Jay Huff",
    number: 32,
    image: "images/HuffCutout.jpg",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
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
    logo: "images/pacerslogo.png",
  },
];

// Get player ID from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get("id");
const player = players.find((p) => p.id === playerId);

const profileContainer = document.getElementById("player-profile");

if (player) {
  // Update page title
  document.title = `${player.name} - Player Profile`;

  // Render player profile
  profileContainer.innerHTML = `
    <div class="profile-wrapper">
      <a href="players.html" class="back-link">← Back to Players</a>
      
      <div class="profile-hero">
        <img src="${player.image}" alt="${player.name}" class="hero-img">
        <div class="hero-info">
          <h1>${player.name} <span class="hero-number">#${
    player.number
  }</span></h1>
          <h2 class="hero-position">${player.position}</h2>
        </div>
        <div class="logo-container">
          <img src="${player.logo}" alt="Pacers Logo" class="team-logo">
        </div>
      </div>

      <div class="profile-content">
        <section class="stats-section">
          <h3>Season Stats</h3>
          <div class="stats-grid">
            <div class="stat-box"><span class="stat-label">Points</span><span class="stat-value">${
              player.stats.points
            }</span></div>
            <div class="stat-box"><span class="stat-label">Rebounds</span><span class="stat-value">${
              player.stats.rebounds
            }</span></div>
            <div class="stat-box"><span class="stat-label">Assists</span><span class="stat-value">${
              player.stats.assists
            }</span></div>
            <div class="stat-box"><span class="stat-label">Steals</span><span class="stat-value">${
              player.stats.steals
            }</span></div>
            ${
              player.stats.blocks
                ? `<div class="stat-box"><span class="stat-label">Blocks</span><span class="stat-value">${player.stats.blocks}</span></div>`
                : ""
            }
            <div class="stat-box"><span class="stat-label">FG%</span><span class="stat-value">${
              player.stats.fg
            }</span></div>
            <div class="stat-box"><span class="stat-label">3P%</span><span class="stat-value">${
              player.stats.threeP
            }</span></div>
            <div class="stat-box"><span class="stat-label">FT%</span><span class="stat-value">${
              player.stats.ft
            }</span></div>
          </div>
        </section>

        <section class="details-section">
          <h3>Player Details</h3>
          <div class="details-grid">
            <div class="detail-item"><strong>Height:</strong> ${
              player.height
            }</div>
            <div class="detail-item"><strong>Weight:</strong> ${
              player.weight
            }</div>
            <div class="detail-item"><strong>Age:</strong> ${player.age}</div>
            <div class="detail-item"><strong>College:</strong> ${
              player.college
            }</div>
            <div class="detail-item"><strong>Draft:</strong> ${
              player.draft
            }</div>
            <div class="detail-item"><strong>Experience:</strong> ${
              player.experience
            }</div>
          </div>
        </section>

        <section class="achievements-section">
          <h3>Achievements</h3>
          <ul class="achievements-list">
            ${player.achievements.map((a) => `<li>🏆 ${a}</li>`).join("")}
          </ul>
        </section>
      </div>
    </div>
  `;
} else {
  profileContainer.innerHTML = `
    <div class="error-container">
      <h1>Player Not Found</h1>
      <p>Sorry, we couldn't find the player you're looking for.</p>
      <a href="players.html" class="btn">Back to Players</a>
    </div>
  `;
}
