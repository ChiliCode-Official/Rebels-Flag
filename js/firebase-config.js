// Configuración de Firebase y almacenamiento local
// Si no agregas las credenciales de Firebase, funcionará perfectamente con LocalStorage sincronizado.
// Para habilitar Firebase en tiempo real en la nube, simplemente completa el objeto firebaseConfig con tu proyecto GRATUITO de Firebase Spark.

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Datos por defecto (idénticos a Olympiq original)
const DEFAULT_SPORTS_DATA = {
  nextMatch: {
    competition: "League Premier • Next match",
    team1: { name: "Conquerors Club", score: 0, logo: "./framerusercontent.com/images/BMydq0c1FDGSLhQMgkxnx9NNZs.png" },
    team2: { name: "Sky Strikers", score: 0, logo: "./framerusercontent.com/images/XXDqeq2Fs9apOJriLnbPVUlQMtY.png" },
    matchDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: "Olympus Stadium, Arena 1",
    tickerText: "Next: Tigers vs Flash Flames",
    tickerLink: "#countdown-section"
  },
  liveScore: {
    isLive: false,
    period: "1st Half",
    team1Score: 18,
    team2Score: 14
  },
  futureMatches: [
    {
      id: "m1",
      city: "San Francisco",
      date: "04 May",
      homeTeam: "Conquerors Club",
      awayTeam: "Sky Strikers",
      homeLogo: "./framerusercontent.com/images/BMydq0c1FDGSLhQMgkxnx9NNZs.png",
      awayLogo: "./framerusercontent.com/images/XXDqeq2Fs9apOJriLnbPVUlQMtY.png",
      status: "Upcoming",
      ticketLink: "./tickets.html"
    },
    {
      id: "m2",
      city: "New York",
      date: "12 May",
      homeTeam: "Tigers",
      awayTeam: "Flash Flames",
      homeLogo: "./framerusercontent.com/images/dkNXveWt5BekH4MsBH1hUML6CJI.png",
      awayLogo: "./framerusercontent.com/images/sjKCo1wPx2BX3gdQX4HkLHQ.png",
      status: "Upcoming",
      ticketLink: "./tickets.html"
    },
    {
      id: "m3",
      city: "Chicago",
      date: "19 May",
      homeTeam: "Rebels Flag",
      awayTeam: "Apex Predators",
      homeLogo: "./framerusercontent.com/images/BMydq0c1FDGSLhQMgkxnx9NNZs.png",
      awayLogo: "./framerusercontent.com/images/XXDqeq2Fs9apOJriLnbPVUlQMtY.png",
      status: "Upcoming",
      ticketLink: "./tickets.html"
    }
  ],
  recentResults: [
    {
      id: "r1",
      city: "Los Angeles",
      date: "28 Apr",
      homeTeam: "Sky Strikers",
      awayTeam: "Flash Flames",
      homeScore: 88,
      awayScore: 74,
      winner: "Sky Strikers Wins"
    },
    {
      id: "r2",
      city: "Boston",
      date: "22 Apr",
      homeTeam: "Tigers",
      awayTeam: "Flash Flames",
      homeScore: 62,
      awayScore: 71,
      winner: "Flash Flames Wins"
    },
    {
      id: "r3",
      city: "Seattle",
      date: "15 Apr",
      homeTeam: "Conquerors Club",
      awayTeam: "Sky Strikers",
      homeScore: 94,
      awayScore: 89,
      winner: "Conquerors Club Wins"
    }
  ]
};

window.SportsDB = {
  firebaseConfig: firebaseConfig,
  defaultData: DEFAULT_SPORTS_DATA,
  
  getData: async function() {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && window.firebase) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.firestore();
        const doc = await db.collection("olympiq_rebels").doc("current_data").get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (err) {
        console.warn("Error leyendo de Firebase, usando fallback local:", err);
      }
    }
    
    const local = localStorage.getItem("rebels_sports_data");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SPORTS_DATA;
  },

  saveData: async function(data) {
    localStorage.setItem("rebels_sports_data", JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("sportsDataUpdated", { detail: data }));

    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && window.firebase) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.firestore();
        await db.collection("olympiq_rebels").doc("current_data").set(data);
        console.log("Datos sincronizados en Firebase Firestore con éxito.");
      } catch (err) {
        console.error("Error guardando en Firebase:", err);
        throw err;
      }
    }
    return true;
  },

  subscribe: function(callback) {
    window.addEventListener("sportsDataUpdated", (e) => callback(e.detail));
    window.addEventListener("storage", (e) => {
      if (e.key === "rebels_sports_data" && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch (err) {}
      }
    });

    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && window.firebase) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.firestore();
        db.collection("olympiq_rebels").doc("current_data").onSnapshot((doc) => {
          if (doc.exists) {
            callback(doc.data());
          }
        }, (err) => console.warn("Firebase snapshot error:", err));
      } catch (err) {
        console.warn("No se pudo iniciar listener de Firebase:", err);
      }
    }
  }
};
