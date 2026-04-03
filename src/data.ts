export type Language = 'de' | 'en';

export interface Continent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  hexColor: string;
  facts: string[];
  animals: string[];
  mapX: number;
  mapY: number;
}

export interface Ocean {
  id: string;
  name: string;
  emoji: string;
  color: string;
  facts: string[];
  animals?: string[];
  mapX: number;
  mapY: number;
}

export interface Question {
  q: string;
  options: string[];
  answer: string;
}

export interface Content {
  title: string;
  subtitle: string;
  learnBtn: string;
  quizBtn: string;
  continentQuizBtn: string;
  continentQuizTitle: string;
  backBtn: string;
  startQuiz: string;
  nextQuestion: string;
  finishQuiz: string;
  scoreTitle: string;
  scoreMessage: (score: number, total: number) => string;
  playAgain: string;
  prevFact: string;
  nextFact: string;
  finishFacts: string;
  continents: Continent[];
  oceans: Ocean[];
  questions: Question[];
  legal: {
    impressum: { title: string; content: string };
    datenschutz: { title: string; content: string };
    nutzungsbedingungen: { title: string; content: string };
  };
}

export const content: Record<Language, Content> = {
  de: {
    title: "Welt Meister!",
    subtitle: "Lerne alles über unsere 7 Kontinente und 5 Ozeane",
    learnBtn: "Lernen",
    quizBtn: "Quiz Starten",
    continentQuizBtn: "Kontinente lernen",
    continentQuizTitle: "Welcher Kontinent ist das?",
    backBtn: "Zurück",
    startQuiz: "Los geht's!",
    nextQuestion: "Nächste Frage",
    finishQuiz: "Ergebnis ansehen",
    scoreTitle: "Toll gemacht!",
    scoreMessage: (score, total) => {
      if (score === total) return `Wow! Du hast alle ${total} Fragen richtig beantwortet! Perfekt! 🌟`;
      if (score >= total * 0.8) return `Super! Du hast ${score} von ${total} Fragen richtig beantwortet! Fast perfekt! 🎉`;
      if (score >= total * 0.5) return `Gut gemacht! Du hast ${score} von ${total} Fragen richtig beantwortet. Weiter so! 👍`;
      return `Du hast ${score} von ${total} Fragen richtig beantwortet. Übung macht den Meister! 💪`;
    },
    playAgain: "Nochmal spielen",
    prevFact: "Zurück",
    nextFact: "Weiter",
    finishFacts: "Fertig",
    continents: [
      {
        id: 'na',
        name: 'Nordamerika',
        emoji: '🐻',
        color: 'bg-yellow-400',
        hexColor: '#facc15',
        mapX: 20,
        mapY: 30,
        facts: [
          "Hier liegen Länder wie die USA, Kanada und Mexiko.",
          "Bekannt für den riesigen Grand Canyon.",
          "Hier gibt es Bären, Wölfe und Weißkopfseeadler.",
          "Es gibt dort alle Klimazonen, von eiskalt bis tropisch heiß!"
        ],
        animals: ["Bison", "Grizzlybär", "Waschbär"]
      },
      {
        id: 'sa',
        name: 'Südamerika',
        emoji: '🦥',
        color: 'bg-green-400',
        hexColor: '#4ade80',
        mapX: 28,
        mapY: 70,
        facts: [
          "Heimat des Amazonas-Regenwaldes, der 'Lunge der Erde'.",
          "Der Amazonas-Fluss ist der wasserreichste Fluss der Welt.",
          "Hier leben Faultiere, Tukane und Jaguare.",
          "Die Anden sind das längste Gebirge der Welt."
        ],
        animals: ["Jaguar", "Faultier", "Papagei"]
      },
      {
        id: 'europe',
        name: 'Europa',
        emoji: '🏰',
        color: 'bg-purple-400',
        hexColor: '#c084fc',
        mapX: 52,
        mapY: 25,
        facts: [
          "Unser Heimatkontinent! (Für die meisten von uns)",
          "Hat sehr viele verschiedene Länder auf kleinem Raum.",
          "Bekannt für alte Burgen, den Eiffelturm und das Kolosseum.",
          "Der zweitkleinste Kontinent der Erde."
        ],
        animals: ["Fuchs", "Elch", "Braunbär"]
      },
      {
        id: 'africa',
        name: 'Afrika',
        emoji: '🦁',
        color: 'bg-orange-400',
        hexColor: '#fb923c',
        mapX: 52,
        mapY: 55,
        facts: [
          "Der heißeste Kontinent.",
          "Hier liegt die Sahara, die größte heiße Wüste.",
          "Der Nil fließt hier, einer der längsten Flüsse.",
          "Heimat von Löwen, Elefanten und Giraffen!"
        ],
        animals: ["Elefant", "Giraffe", "Löwe"]
      },
      {
        id: 'asia',
        name: 'Asien',
        emoji: '🐼',
        color: 'bg-red-400',
        hexColor: '#f87171',
        mapX: 75,
        mapY: 30,
        facts: [
          "Der größte Kontinent der Erde.",
          "Hier leben die meisten Menschen der Welt.",
          "Heimat des Mount Everest, dem höchsten Berg.",
          "Hier leben Pandas, Tiger und Orang-Utans!"
        ],
        animals: ["Panda", "Tiger", "Kamel"]
      },
      {
        id: 'oceania',
        name: 'Ozeanien',
        emoji: '🦘',
        color: 'bg-pink-400',
        hexColor: '#f472b6',
        mapX: 85,
        mapY: 75,
        facts: [
          "Der kleinste Kontinent der Erde.",
          "Besteht aus Australien und vielen kleinen Inseln.",
          "Heimat des Great Barrier Reefs, dem größten Korallenriff.",
          "Hier hüpfen Kängurus und schlafen Koalas!"
        ],
        animals: ["Känguru", "Koala", "Emu"]
      },
      {
        id: 'antarctica',
        name: 'Antarktika',
        emoji: '🐧',
        color: 'bg-blue-400',
        hexColor: '#60a5fa',
        mapX: 50,
        mapY: 90,
        facts: [
          "Der kälteste, windigste und trockenste Kontinent.",
          "Es gibt hier keine Länder und keine normalen Städte.",
          "Fast komplett von Eis bedeckt.",
          "Hier leben Pinguine und Robben, aber keine Eisbären!"
        ],
        animals: ["Pinguin", "Robbe", "Wal"]
      }
    ],
    oceans: [
      {
        id: 'pacific',
        name: 'Pazifischer Ozean',
        emoji: '🌊',
        color: 'bg-blue-600',
        facts: [
          "Der größte und tiefste Ozean der Erde.",
          "Bedeckt etwa ein Drittel der gesamten Erdoberfläche.",
          "Hier liegt der Marianengraben, die tiefste Stelle der Weltmeere."
        ],
        animals: ["Weißer Hai", "Meeresschildkröte", "Delfin"],
        mapX: 8,
        mapY: 50
      },
      {
        id: 'atlantic',
        name: 'Atlantischer Ozean',
        emoji: '🐋',
        color: 'bg-blue-500',
        facts: [
          "Der zweitgrößte Ozean.",
          "Trennt Amerika von Europa und Afrika.",
          "Bekannt für den Golfstrom, der warmes Wasser nach Europa bringt."
        ],
        animals: ["Buckelwal", "Papageitaucher", "Schwertfisch"],
        mapX: 38,
        mapY: 32
      },
      {
        id: 'indian',
        name: 'Indischer Ozean',
        emoji: '🐠',
        color: 'bg-teal-500',
        facts: [
          "Der drittgrößte Ozean.",
          "Liegt zwischen Afrika, Asien und Australien.",
          "Das Wasser hier ist oft besonders warm."
        ],
        animals: ["Clownfisch", "Mantarochen", "Dugong"],
        mapX: 68,
        mapY: 58
      },
      {
        id: 'southern',
        name: 'Südlicher Ozean',
        emoji: '🧊',
        color: 'bg-cyan-600',
        facts: [
          "Umkreist die Antarktis komplett.",
          "Hier schwimmen viele Eisberge.",
          "Lebensraum für viele Wale und Pinguine."
        ],
        animals: ["Kaiserpinguin", "Blauwal", "Seeleopard"],
        mapX: 50,
        mapY: 85
      },
      {
        id: 'arctic',
        name: 'Arktischer Ozean',
        emoji: '❄️',
        color: 'bg-sky-300',
        facts: [
          "Der kleinste und flachste Ozean.",
          "Liegt am Nordpol und ist oft von Eis bedeckt.",
          "Hier leben Eisbären und Walrosse."
        ],
        animals: ["Eisbär", "Walross", "Narwal"],
        mapX: 50,
        mapY: 10
      }
    ],
    questions: [
      { q: "Welcher ist der kälteste Kontinent?", options: ["Antarktika", "Europa", "Nordamerika", "Asien"], answer: "Antarktika" },
      { q: "Auf welchem Kontinent leben Kängurus?", options: ["Afrika", "Ozeanien", "Südamerika", "Europa"], answer: "Ozeanien" },
      { q: "Welcher Kontinent ist der größte?", options: ["Nordamerika", "Afrika", "Asien", "Antarktika"], answer: "Asien" },
      { q: "Wo liegt die Sahara-Wüste?", options: ["Asien", "Südamerika", "Afrika", "Ozeanien"], answer: "Afrika" },
      { q: "Auf welchem Kontinent liegt Deutschland?", options: ["Nordamerika", "Europa", "Asien", "Südamerika"], answer: "Europa" },
      { q: "Wo findest du den Amazonas-Regenwald?", options: ["Afrika", "Asien", "Südamerika", "Nordamerika"], answer: "Südamerika" },
      { q: "Welcher Kontinent hat keine Länder?", options: ["Antarktika", "Ozeanien", "Europa", "Südamerika"], answer: "Antarktika" },
      { q: "Wo leben Pinguine in freier Wildbahn?", options: ["Nordamerika", "Europa", "Asien", "Antarktika"], answer: "Antarktika" },
      { q: "Welcher Kontinent ist bekannt für den Grand Canyon?", options: ["Südamerika", "Nordamerika", "Afrika", "Asien"], answer: "Nordamerika" },
      { q: "Wo steht der Eiffelturm?", options: ["Asien", "Europa", "Nordamerika", "Ozeanien"], answer: "Europa" },
      { q: "Welcher Ozean ist der größte?", options: ["Pazifischer Ozean", "Atlantischer Ozean", "Indischer Ozean", "Arktischer Ozean"], answer: "Pazifischer Ozean" },
      { q: "Welcher Ozean liegt zwischen Amerika und Europa?", options: ["Indischer Ozean", "Pazifischer Ozean", "Atlantischer Ozean", "Südlicher Ozean"], answer: "Atlantischer Ozean" },
      { q: "Wo leben Eisbären?", options: ["Antarktika", "Arktischer Ozean", "Südlicher Ozean", "Pazifischer Ozean"], answer: "Arktischer Ozean" },
      { q: "Welches Tier lebt in Afrika?", options: ["Tiger", "Panda", "Giraffe", "Känguru"], answer: "Giraffe" },
      { q: "Auf welchem Kontinent leben Jaguare?", options: ["Afrika", "Asien", "Südamerika", "Europa"], answer: "Südamerika" }
    ],
    legal: {
      impressum: {
        title: "Impressum",
        content: `Diese Web-App wird betrieben von:\nDieter Balmer\nSchweiz\nE-Mail: dieterbalmer@gmail.com\n\nVerantwortlich für den Inhalt gemäß Schweizer Recht:\nDieter Balmer\n\nUrsprünglich für die Kinder im Klettgau entwickelt – heute für neugierige Kinder und Familien überall.`
      },
      datenschutz: {
        title: "Datenschutz",
        content: `Der Schutz deiner Daten ist uns sehr wichtig! Hier erklären wir dir einfach und klar, wie wir mit Informationen umgehen.\n\nWelche Daten werden gespeichert?\nWir speichern nur:\n- deine Punktzahlen (lokal auf deinem Gerät)\n\nDiese Daten werden ausschließlich im lokalen Speicher deines eigenen Browsers gespeichert. Sie verlassen niemals deinen Computer oder dein Gerät.\n\nKeine Cookies — kein Tracking\nWir verwenden:\n- keine Cookies\n- keine Web-Analytics\n- keine Werbung\n- keine Social-Media-Plugins\nWir verfolgen keine Nutzer.\n\nFür Kinder geeignet\nDiese App ist für Kinder gemacht. Es gibt keine externen Links, keinen Chat und keine Datenweitergabe.\n\nRechtsgrundlagen\nSchweiz – revDSG: Daten werden transparent und minimal verarbeitet.\nEU – DSGVO Art. 6(1)(f): Berechtigtes Interesse an Kindersicherheit.\n\nVerantwortliche Stelle\nDieter Balmer\nSchweiz\nE-Mail: dieterbalmer@gmail.com`
      },
      nutzungsbedingungen: {
        title: "Nutzungsbedingungen",
        content: `1. Nutzung\nDiese Web-App dient ausschließlich zu Lern- und Unterhaltungszwecken. Die Nutzung erfolgt kostenlos und auf eigene Verantwortung.\n\n2. Verfügbarkeit\nWir geben keine Garantie für ununterbrochene Nutzung, technische Fehlerfreiheit oder Kompatibilität.\n\n3. Haftung\nWir haften nicht für technische Probleme, Datenverlust, falsche Ergebnisse oder daraus entstehende Schäden.\n\n4. Änderungen\nWir dürfen die App jederzeit anpassen, erweitern oder abschalten.\n\n5. Urheberrecht\nAlle Inhalte dieser App sind urheberrechtlich geschützt. Der Code steht unter der MIT-Lizenz.`
      }
    }
  },
  en: {
    title: "World Master!",
    subtitle: "Learn all about our 7 continents and 5 oceans",
    learnBtn: "Learn",
    quizBtn: "Start Quiz",
    continentQuizBtn: "Learn Continents",
    continentQuizTitle: "Which continent is this?",
    backBtn: "Back",
    startQuiz: "Let's go!",
    nextQuestion: "Next Question",
    finishQuiz: "See Results",
    scoreTitle: "Great Job!",
    scoreMessage: (score, total) => {
      if (score === total) return `Wow! You answered all ${total} questions correctly! Perfect! 🌟`;
      if (score >= total * 0.8) return `Super! You answered ${score} out of ${total} questions correctly! Almost perfect! 🎉`;
      if (score >= total * 0.5) return `Good job! You answered ${score} out of ${total} questions correctly. Keep it up! 👍`;
      return `You answered ${score} out of ${total} questions correctly. Practice makes perfect! 💪`;
    },
    playAgain: "Play Again",
    prevFact: "Previous",
    nextFact: "Next",
    finishFacts: "Finish",
    continents: [
      {
        id: 'na',
        name: 'North America',
        emoji: '🐻',
        color: 'bg-yellow-400',
        hexColor: '#facc15',
        mapX: 20,
        mapY: 30,
        facts: [
          "Includes countries like the USA, Canada, and Mexico.",
          "Famous for the giant Grand Canyon.",
          "Bears, wolves, and bald eagles live here.",
          "It has all climate zones, from freezing cold to tropical hot!"
        ],
        animals: ["Bison", "Grizzly Bear", "Raccoon"]
      },
      {
        id: 'sa',
        name: 'South America',
        emoji: '🦥',
        color: 'bg-green-400',
        hexColor: '#4ade80',
        mapX: 28,
        mapY: 70,
        facts: [
          "Home to the Amazon Rainforest, the 'lungs of the Earth'.",
          "The Amazon River has the most water of any river.",
          "Sloths, toucans, and jaguars live here.",
          "The Andes are the longest mountain range in the world."
        ],
        animals: ["Jaguar", "Sloth", "Parrot"]
      },
      {
        id: 'europe',
        name: 'Europe',
        emoji: '🏰',
        color: 'bg-purple-400',
        hexColor: '#c084fc',
        mapX: 52,
        mapY: 25,
        facts: [
          "Has many different countries in a small area.",
          "Famous for old castles, the Eiffel Tower, and the Colosseum.",
          "The second smallest continent on Earth."
        ],
        animals: ["Fox", "Moose", "Brown Bear"]
      },
      {
        id: 'africa',
        name: 'Africa',
        emoji: '🦁',
        color: 'bg-orange-400',
        hexColor: '#fb923c',
        mapX: 52,
        mapY: 55,
        facts: [
          "The hottest continent.",
          "Home to the Sahara, the largest hot desert.",
          "The Nile flows here, one of the longest rivers.",
          "Home to lions, elephants, and giraffes!"
        ],
        animals: ["Elephant", "Giraffe", "Lion"]
      },
      {
        id: 'asia',
        name: 'Asia',
        emoji: '🐼',
        color: 'bg-red-400',
        hexColor: '#f87171',
        mapX: 75,
        mapY: 30,
        facts: [
          "The largest continent on Earth.",
          "Most of the world's people live here.",
          "Home to Mount Everest, the highest mountain.",
          "Pandas, tigers, and orangutans live here!"
        ],
        animals: ["Panda", "Tiger", "Camel"]
      },
      {
        id: 'oceania',
        name: 'Oceania',
        emoji: '🦘',
        color: 'bg-pink-400',
        hexColor: '#f472b6',
        mapX: 85,
        mapY: 75,
        facts: [
          "The smallest continent on Earth.",
          "Made up of Australia and many small islands.",
          "Home to the Great Barrier Reef, the largest coral reef.",
          "Kangaroos hop and koalas sleep here!"
        ],
        animals: ["Kangaroo", "Koala", "Emu"]
      },
      {
        id: 'antarctica',
        name: 'Antarctica',
        emoji: '🐧',
        color: 'bg-blue-400',
        hexColor: '#60a5fa',
        mapX: 50,
        mapY: 90,
        facts: [
          "The coldest, windiest, and driest continent.",
          "There are no countries and no normal cities here.",
          "Almost completely covered in ice.",
          "Penguins and seals live here, but no polar bears!"
        ],
        animals: ["Penguin", "Seal", "Whale"]
      }
    ],
    oceans: [
      {
        id: 'pacific',
        name: 'Pacific Ocean',
        emoji: '🌊',
        color: 'bg-blue-600',
        mapX: 8,
        mapY: 50,
        facts: [
          "The largest and deepest ocean on Earth.",
          "Covers about one-third of the entire Earth's surface.",
          "Home to the Mariana Trench, the deepest part of the world's oceans."
        ],
        animals: ["Great White Shark", "Sea Turtle", "Dolphin"]
      },
      {
        id: 'atlantic',
        name: 'Atlantic Ocean',
        emoji: '🐋',
        color: 'bg-blue-500',
        mapX: 38,
        mapY: 32,
        facts: [
          "The second largest ocean.",
          "Separates the Americas from Europe and Africa.",
          "Known for the Gulf Stream, which brings warm water to Europe."
        ],
        animals: ["Humpback Whale", "Puffin", "Swordfish"]
      },
      {
        id: 'indian',
        name: 'Indian Ocean',
        emoji: '🐠',
        color: 'bg-teal-500',
        mapX: 68,
        mapY: 58,
        facts: [
          "The third largest ocean.",
          "Located between Africa, Asia, and Australia.",
          "The water here is often particularly warm."
        ],
        animals: ["Clownfish", "Manta Ray", "Dugong"]
      },
      {
        id: 'southern',
        name: 'Southern Ocean',
        emoji: '🧊',
        color: 'bg-cyan-600',
        mapX: 50,
        mapY: 85,
        facts: [
          "Completely circles Antarctica.",
          "Many icebergs float here.",
          "Habitat for many whales and penguins."
        ],
        animals: ["Emperor Penguin", "Blue Whale", "Leopard Seal"]
      },
      {
        id: 'arctic',
        name: 'Arctic Ocean',
        emoji: '❄️',
        color: 'bg-sky-300',
        mapX: 50,
        mapY: 10,
        facts: [
          "The smallest and shallowest ocean.",
          "Located at the North Pole and often covered in ice.",
          "Polar bears and walruses live here."
        ],
        animals: ["Polar Bear", "Walrus", "Narwhal"]
      }
    ],
    questions: [
      { q: "Which is the coldest continent?", options: ["Antarctica", "Europe", "North America", "Asia"], answer: "Antarctica" },
      { q: "On which continent do kangaroos live?", options: ["Africa", "Oceania", "South America", "Europe"], answer: "Oceania" },
      { q: "Which continent is the largest?", options: ["North America", "Africa", "Asia", "Antarctica"], answer: "Asia" },
      { q: "Where is the Sahara Desert located?", options: ["Asia", "South America", "Africa", "Oceania"], answer: "Africa" },
      { q: "On which continent is Germany located?", options: ["North America", "Europe", "Asia", "South America"], answer: "Europe" },
      { q: "Where can you find the Amazon Rainforest?", options: ["Africa", "Asia", "South America", "North America"], answer: "South America" },
      { q: "Which continent has no countries?", options: ["Antarctica", "Oceania", "Europe", "South America"], answer: "Antarctica" },
      { q: "Where do penguins live in the wild?", options: ["North America", "Europe", "Asia", "Antarctica"], answer: "Antarctica" },
      { q: "Which continent is known for the Grand Canyon?", options: ["South America", "North America", "Africa", "Asia"], answer: "North America" },
      { q: "Where is the Eiffel Tower?", options: ["Asia", "Europe", "North America", "Oceania"], answer: "Europe" },
      { q: "Which ocean is the largest?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: "Pacific Ocean" },
      { q: "Which ocean is between America and Europe?", options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Southern Ocean"], answer: "Atlantic Ocean" },
      { q: "Where do polar bears live?", options: ["Antarctica", "Arctic Ocean", "Southern Ocean", "Pacific Ocean"], answer: "Arctic Ocean" },
      { q: "Which animal lives in Africa?", options: ["Tiger", "Panda", "Giraffe", "Kangaroo"], answer: "Giraffe" },
      { q: "On which continent do jaguars live?", options: ["Africa", "Asia", "South America", "Europe"], answer: "South America" }
    ],
    legal: {
      impressum: {
        title: "Imprint",
        content: `This web app is operated by:\nDieter Balmer\nSwitzerland\nEmail: dieterbalmer@gmail.com\n\nResponsible for content according to Swiss law:\nDieter Balmer\n\nOriginally developed for the children in Klettgau – today for curious children and families everywhere.`
      },
      datenschutz: {
        title: "Privacy Policy",
        content: `Protecting your data is very important to us! Here we explain simply and clearly how we handle information.\n\nWhat data is stored?\nWe only store:\n- your scores (locally on your device)\n\nThis data is stored exclusively in the local storage of your own browser. It never leaves your computer or device.\n\nNo Cookies — No Tracking\nWe use:\n- no cookies\n- no web analytics\n- no advertising\n- no social media plugins\nWe do not track users.\n\nSuitable for children\nThis app is made for children. There are no external links, no chat, and no data sharing.\n\nLegal basis\nSwitzerland – revDSG: Data is processed transparently and minimally.\nEU – GDPR Art. 6(1)(f): Legitimate interest in child safety.\n\nResponsible party\nDieter Balmer\nSwitzerland\nEmail: dieterbalmer@gmail.com`
      },
      nutzungsbedingungen: {
        title: "Terms of Use",
        content: `1. Use\nThis web app is for educational and entertainment purposes only. Use is free and at your own risk.\n\n2. Availability\nWe do not guarantee uninterrupted use, technical flawlessness, or compatibility.\n\n3. Liability\nWe are not liable for technical problems, data loss, incorrect results, or resulting damages.\n\n4. Changes\nWe may adapt, expand, or shut down the app at any time.\n\n5. Copyright\nAll contents of this app are protected by copyright. The code is under the MIT License.`
      }
    }
  }
};
