// The rest of Ellen's original quote log: her "Surprisingly Real Quotes", the two case studies,
// and the Andy Warhol quotes. All start as drafts so they can be reviewed in /admin before publishing.
// Added to live databases by db/migrations/003-add-remaining-log-quotes.sql.
import type { SeedEntry } from "./seed-data.ts";

const realQuote = "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.";
const passport = "From Case study #1: the quotes printed in the US passport. Not yet researched.";
const notebook = "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.";

const draft = (quote: string, credited: string[], findings: string): SeedEntry => ({
  quote,
  credited,
  verdict: "unverified",
  status: "draft",
  findings,
});

export const logAdditions: SeedEntry[] = [
  // ---- Surprisingly Real Quotes ----
  {
    quote:
      "Well, let it pass, he thought; April is over, April is over. There are all kinds of love in the world, but never the same love twice.",
    credited: ["F. Scott Fitzgerald"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "F. Scott Fitzgerald",
    originalCitation: "“The Sensible Thing”",
    findings: realQuote,
  },
  {
    quote:
      "We may not look at our pleasure to go to heaven in feather-beds; it is not the way. For our Lord himself went thither with great pain, and by many tribulations, which is the path wherein he walked thither, and the servant may not look to be in better case than his Master.",
    credited: ["Thomas More"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "Thomas More",
    originalCitation: "The Life of Thomas More, by his son-in-law William Roper (1576)",
    findings: realQuote,
  },
  {
    quote: "Life is only a kind of sowing time, and the harvest is not here.",
    credited: ["Vincent van Gogh"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "Vincent van Gogh",
    originalCitation: "Letter to his brother, Theo van Gogh",
    findings: realQuote,
    sources: [{ kind: "evidence", label: "Van Gogh’s letter to Theo (WebExhibits)", url: "https://www.webexhibits.org/vangogh/letter/12/265.htm" }],
  },
  {
    quote: "Imagination is more important than knowledge.",
    credited: ["Albert Einstein"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "Albert Einstein",
    findings: realQuote,
    sources: [{ kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2013/01/01/einstein-imagination/" }],
  },
  {
    quote:
      "Since it is so likely that [children] will meet cruel enemies, let them at least have heard of brave knights and heroic courage.",
    credited: ["C.S. Lewis"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "C.S. Lewis",
    findings: realQuote,
    sources: [
      {
        kind: "evidence",
        label: "C.S. Lewis on violence in fairy tales (Edge of Legible)",
        url: "https://edgeoflegible.wordpress.com/2014/03/18/c-s-lewis-on-violence-in-fairy-tales/",
      },
    ],
  },
  {
    quote:
      "Many forms of Government have been tried, and will be tried in this world of sin and woe. No one pretends that democracy is perfect or all-wise. Indeed it has been said that democracy is the worst form of Government except for all those other forms that have been tried from time to time.",
    credited: ["Winston Churchill"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "Winston Churchill",
    findings: realQuote,
  },
  {
    quote: "The way to make people trust-worthy is to trust them.",
    credited: ["Ernest Hemingway"],
    verdict: "accurate",
    status: "draft",
    actualAuthor: "Ernest Hemingway",
    originalCitation: "Ernest Hemingway, Selected Letters",
    findings: realQuote,
    sources: [
      {
        kind: "evidence",
        label: "Ernest Hemingway: Selected Letters (Internet Archive)",
        url: "https://archive.org/stream/in.ernet.dli.2015.182139/2015.182139.Ernest-Hemingway-Selected-Letters_djvu.txt",
      },
    ],
  },

  // ---- Andy Warhol (the fourth, "Art is what you can get away with", is already in the log) ----
  draft("Young people inspire and exhaust me.", ["Andy Warhol"], ""),
  draft("People should fall in love with their eyes closed.", ["Andy Warhol"], ""),
  draft("If you look at a thing long enough it loses all its meaning.", ["Andy Warhol"], ""),

  // ---- Case study #1: the US passport ----
  draft(
    "We have a great dream. It started way back in 1776, and God grant that America will be true to her dream.",
    ["Martin Luther King Jr."],
    passport,
  ),
  draft(
    "Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe, in order to assure the survival and success of liberty.",
    ["John F. Kennedy"],
    passport,
  ),
  draft("This is a new nation, based on a mighty continent, of boundless possibilities.", ["Theodore Roosevelt"], passport),
  draft("Let us raise a standard to which the wise and honest can repair…", ["George Washington"], passport),
  draft(
    "The principle of free governments adheres to the American soil. It is bedded in it, immovable as its mountains.",
    ["Daniel Webster"],
    passport,
  ),
  draft(
    "Whatever America hopes to bring to pass in the world must first come to pass in the heart of America.",
    ["Dwight D. Eisenhower"],
    passport,
  ),
  draft(
    "For this is what America is all about. It is the uncrossed desert and the unclimbed ridge. It is the star that is not reached and the harvest sleeping in the unplowed ground. Is our world gone? We say “Farewell.” Is a new world coming? We welcome it—and we will bend it to the hopes of man.",
    ["Lyndon B. Johnson"],
    passport,
  ),
  draft(
    "Every generation has the obligation to free men’s minds for a look at new worlds… to look out from a higher plateau than the last generation.",
    ["Ellison S. Onizuka"],
    passport,
  ),
  draft(
    "May God continue the unity of our Country as this Railroad unites the two great Oceans of the world.",
    ["The Golden Spike"],
    `${passport} Inscribed on the Golden Spike, Promontory, Utah, 1869.`,
  ),
  draft(
    "The cause of freedom is not the cause of a race or a sect, a party or a class—it is the cause of humankind, the very birthright of humanity.",
    ["Anna Julia Cooper"],
    passport,
  ),

  // ---- Case study #2: the travel notebook ----
  draft("Adventure is worthwhile.", ["Amelia Earhart"], notebook),
  draft(
    "Do not go where the path may lead; go instead where there is no path and leave a trail.",
    ["Ralph Waldo Emerson"],
    notebook,
  ),
  draft("I travel a lot. I hate having my life disrupted by routine.", ["Caskie Stinnett"], notebook),
  draft("I have been a wanderer among distant fields. I have sailed down mighty rivers.", ["Percy Bysshe Shelley"], notebook),
  draft("A journey of a thousand miles begins with a single step.", ["Confucius"], notebook),
  draft("My favorite thing is to go where I have never gone.", ["Diane Arbus"], notebook),
  draft(
    "I’m shakin’ the dust of this crummy little town off my feet and I’m gonna see the world.",
    ["George Bailey (It’s a Wonderful Life)"],
    `${notebook} Credited to the character George Bailey, from It’s a Wonderful Life (1946).`,
  ),
  draft("I’m more interested in what I discover than what I invent.", ["Paul Simon"], notebook),
  draft("It is not down in any map; true places never are.", ["Herman Melville"], notebook),
  draft(
    "The only way of catching a train I have ever discovered is to miss the train before.",
    ["G.K. Chesterton"],
    notebook,
  ),
  draft("Life is either a daring adventure or nothing.", ["Helen Keller"], notebook),
  draft("One’s destination is never a place, but rather a new way of looking at things.", ["Henry Miller"], notebook),
  draft(
    "I never travel without my diary. One should always have something sensational to read in the train.",
    ["Oscar Wilde"],
    notebook,
  ),
  draft("O lands! O all so dear to me—what you are, I become part of that, whatever it is.", ["Walt Whitman"], notebook),
  draft("Much have I traveled in the realms of gold, And many goodly states and kingdoms seen…", ["John Keats"], notebook),
  draft("Stop worrying about the potholes in the road and enjoy the journey.", ["Babs Hoffman"], notebook),
  draft(
    "The world is all gates, all opportunities, strings of tension waiting to be struck.",
    ["Ralph Waldo Emerson"],
    notebook,
  ),
  draft("Only those who will risk going too far can possibly find out how far one can go.", ["T.S. Eliot"], notebook),
  draft(
    "When you travel, remember that a foreign country is not designed to make you comfortable. It is designed to make its own people comfortable.",
    ["Clifton Fadiman"],
    notebook,
  ),
  draft(
    "Tip the world over on its side, and everything loose will land in Los Angeles.",
    ["Frank Lloyd Wright"],
    notebook,
  ),
  draft("I sought trains; I found passengers.", ["Paul Theroux"], notebook),
  draft(
    "The voyage of discovery lies not in finding new landscapes, but in having new eyes.",
    ["Marcel Proust"],
    notebook,
  ),
  draft("It’s where we go, and what we do when we get there, that tells us who we are.", ["Joyce Carol Oates"], notebook),
  draft(
    "If you wish to travel far and fast, travel light. Take off all your envies, jealousies, unforgiveness, selfishness and fears.",
    ["Glenn Clark"],
    notebook,
  ),
  draft("A good traveller has no fixed plans and is not intent on arriving.", ["Lao-Tzu"], notebook),
  draft("Make voyages! Attempt them… there’s nothing else.", ["Tennessee Williams"], notebook),
  draft(
    "Not I—not anyone else, can travel that road for you, You must travel it for yourself.",
    ["Walt Whitman"],
    notebook,
  ),
  draft("I love to sail on forbidden seas, and land on barbarous coasts.", ["Herman Melville"], notebook),
  draft("Travel not only stirs the blood… It also gives strength to the spirit.", ["Florence Prag Kahn"], notebook),
  draft(
    "If you actually look like your passport photo, you weren’t well enough to travel.",
    ["Sir Vivian Fuchs"],
    notebook,
  ),
  draft("The most important trip you may take in life is meeting people halfway.", ["Henry Boye"], notebook),
  draft("When you come to a fork in the road, take it.", ["Yogi Berra"], notebook),
];
