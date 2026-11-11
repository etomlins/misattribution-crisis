-- Adds the rest of the original quote log as DRAFTS, ready to review in /admin → Entries → Drafts:
-- the 7 "Surprisingly Real Quotes" (verdict: Accurate), 3 Andy Warhol quotes,
-- Case study #1 (US passport, 10 quotes) and Case study #2 (travel notebook, 32 quotes).
--
-- Safe to run more than once: a quote that's already in the database is skipped.
-- Generated from db/log-additions.ts.

do $$
declare
  e jsonb;
  c jsonb;
  s jsonb;
  new_id bigint;
  person bigint;
  pos int;
  base text;
  candidate text;
  n int;
  added int := 0;
begin
  for e in select value from jsonb_array_elements($data$[
 {
  "slug": "well-let-it-pass-he-thought-april-is",
  "quote": "Well, let it pass, he thought; April is over, April is over. There are all kinds of love in the world, but never the same love twice.",
  "verdict": "accurate",
  "actual_author": "F. Scott Fitzgerald",
  "original_citation": "“The Sensible Thing”",
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "F. Scott Fitzgerald",
    "slug": "f-scott-fitzgerald"
   }
  ],
  "sources": []
 },
 {
  "slug": "we-may-not-look-at-our-pleasure-to",
  "quote": "We may not look at our pleasure to go to heaven in feather-beds; it is not the way. For our Lord himself went thither with great pain, and by many tribulations, which is the path wherein he walked thither, and the servant may not look to be in better case than his Master.",
  "verdict": "accurate",
  "actual_author": "Thomas More",
  "original_citation": "The Life of Thomas More, by his son-in-law William Roper (1576)",
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "Thomas More",
    "slug": "thomas-more"
   }
  ],
  "sources": []
 },
 {
  "slug": "life-is-only-a-kind-of-sowing-time",
  "quote": "Life is only a kind of sowing time, and the harvest is not here.",
  "verdict": "accurate",
  "actual_author": "Vincent van Gogh",
  "original_citation": "Letter to his brother, Theo van Gogh",
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "Vincent van Gogh",
    "slug": "vincent-van-gogh"
   }
  ],
  "sources": [
   {
    "kind": "evidence",
    "label": "Van Gogh’s letter to Theo (WebExhibits)",
    "url": "https://www.webexhibits.org/vangogh/letter/12/265.htm"
   }
  ]
 },
 {
  "slug": "imagination-is-more-important-than-knowledge",
  "quote": "Imagination is more important than knowledge.",
  "verdict": "accurate",
  "actual_author": "Albert Einstein",
  "original_citation": null,
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "Albert Einstein",
    "slug": "albert-einstein"
   }
  ],
  "sources": [
   {
    "kind": "evidence",
    "label": "Quote Investigator",
    "url": "https://quoteinvestigator.com/2013/01/01/einstein-imagination/"
   }
  ]
 },
 {
  "slug": "since-it-is-so-likely-that-children-will",
  "quote": "Since it is so likely that [children] will meet cruel enemies, let them at least have heard of brave knights and heroic courage.",
  "verdict": "accurate",
  "actual_author": "C.S. Lewis",
  "original_citation": null,
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "C.S. Lewis",
    "slug": "c-s-lewis"
   }
  ],
  "sources": [
   {
    "kind": "evidence",
    "label": "C.S. Lewis on violence in fairy tales (Edge of Legible)",
    "url": "https://edgeoflegible.wordpress.com/2014/03/18/c-s-lewis-on-violence-in-fairy-tales/"
   }
  ]
 },
 {
  "slug": "many-forms-of-government-have-been-tried-and",
  "quote": "Many forms of Government have been tried, and will be tried in this world of sin and woe. No one pretends that democracy is perfect or all-wise. Indeed it has been said that democracy is the worst form of Government except for all those other forms that have been tried from time to time.",
  "verdict": "accurate",
  "actual_author": "Winston Churchill",
  "original_citation": null,
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "Winston Churchill",
    "slug": "winston-churchill"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-way-to-make-people-trust-worthy-is",
  "quote": "The way to make people trust-worthy is to trust them.",
  "verdict": "accurate",
  "actual_author": "Ernest Hemingway",
  "original_citation": "Ernest Hemingway, Selected Letters",
  "findings": "Logged under “Surprisingly Real Quotes”: a suspicious-sounding quote that turned out to be genuine.",
  "credited": [
   {
    "name": "Ernest Hemingway",
    "slug": "ernest-hemingway"
   }
  ],
  "sources": [
   {
    "kind": "evidence",
    "label": "Ernest Hemingway: Selected Letters (Internet Archive)",
    "url": "https://archive.org/stream/in.ernet.dli.2015.182139/2015.182139.Ernest-Hemingway-Selected-Letters_djvu.txt"
   }
  ]
 },
 {
  "slug": "young-people-inspire-and-exhaust-me",
  "quote": "Young people inspire and exhaust me.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "",
  "credited": [
   {
    "name": "Andy Warhol",
    "slug": "andy-warhol"
   }
  ],
  "sources": []
 },
 {
  "slug": "people-should-fall-in-love-with-their-eyes",
  "quote": "People should fall in love with their eyes closed.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "",
  "credited": [
   {
    "name": "Andy Warhol",
    "slug": "andy-warhol"
   }
  ],
  "sources": []
 },
 {
  "slug": "if-you-look-at-a-thing-long-enough",
  "quote": "If you look at a thing long enough it loses all its meaning.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "",
  "credited": [
   {
    "name": "Andy Warhol",
    "slug": "andy-warhol"
   }
  ],
  "sources": []
 },
 {
  "slug": "we-have-a-great-dream-it-started-way",
  "quote": "We have a great dream. It started way back in 1776, and God grant that America will be true to her dream.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Martin Luther King Jr.",
    "slug": "martin-luther-king-jr"
   }
  ],
  "sources": []
 },
 {
  "slug": "let-every-nation-know-whether-it-wishes-us",
  "quote": "Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe, in order to assure the survival and success of liberty.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "John F. Kennedy",
    "slug": "john-f-kennedy"
   }
  ],
  "sources": []
 },
 {
  "slug": "this-is-a-new-nation-based-on-a",
  "quote": "This is a new nation, based on a mighty continent, of boundless possibilities.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Theodore Roosevelt",
    "slug": "theodore-roosevelt"
   }
  ],
  "sources": []
 },
 {
  "slug": "let-us-raise-a-standard-to-which-the",
  "quote": "Let us raise a standard to which the wise and honest can repair…",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "George Washington",
    "slug": "george-washington"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-principle-of-free-governments-adheres-to-the",
  "quote": "The principle of free governments adheres to the American soil. It is bedded in it, immovable as its mountains.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Daniel Webster",
    "slug": "daniel-webster"
   }
  ],
  "sources": []
 },
 {
  "slug": "whatever-america-hopes-to-bring-to-pass-in",
  "quote": "Whatever America hopes to bring to pass in the world must first come to pass in the heart of America.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Dwight D. Eisenhower",
    "slug": "dwight-d-eisenhower"
   }
  ],
  "sources": []
 },
 {
  "slug": "for-this-is-what-america-is-all-about",
  "quote": "For this is what America is all about. It is the uncrossed desert and the unclimbed ridge. It is the star that is not reached and the harvest sleeping in the unplowed ground. Is our world gone? We say “Farewell.” Is a new world coming? We welcome it—and we will bend it to the hopes of man.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Lyndon B. Johnson",
    "slug": "lyndon-b-johnson"
   }
  ],
  "sources": []
 },
 {
  "slug": "every-generation-has-the-obligation-to-free-mens",
  "quote": "Every generation has the obligation to free men’s minds for a look at new worlds… to look out from a higher plateau than the last generation.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Ellison S. Onizuka",
    "slug": "ellison-s-onizuka"
   }
  ],
  "sources": []
 },
 {
  "slug": "may-god-continue-the-unity-of-our-country",
  "quote": "May God continue the unity of our Country as this Railroad unites the two great Oceans of the world.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched. Inscribed on the Golden Spike, Promontory, Utah, 1869.",
  "credited": [
   {
    "name": "The Golden Spike",
    "slug": "the-golden-spike"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-cause-of-freedom-is-not-the-cause",
  "quote": "The cause of freedom is not the cause of a race or a sect, a party or a class—it is the cause of humankind, the very birthright of humanity.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #1: the quotes printed in the US passport. Not yet researched.",
  "credited": [
   {
    "name": "Anna Julia Cooper",
    "slug": "anna-julia-cooper"
   }
  ],
  "sources": []
 },
 {
  "slug": "adventure-is-worthwhile",
  "quote": "Adventure is worthwhile.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Amelia Earhart",
    "slug": "amelia-earhart"
   }
  ],
  "sources": []
 },
 {
  "slug": "do-not-go-where-the-path-may-lead",
  "quote": "Do not go where the path may lead; go instead where there is no path and leave a trail.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Ralph Waldo Emerson",
    "slug": "ralph-waldo-emerson"
   }
  ],
  "sources": []
 },
 {
  "slug": "i-travel-a-lot-i-hate-having-my",
  "quote": "I travel a lot. I hate having my life disrupted by routine.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Caskie Stinnett",
    "slug": "caskie-stinnett"
   }
  ],
  "sources": []
 },
 {
  "slug": "i-have-been-a-wanderer-among-distant-fields",
  "quote": "I have been a wanderer among distant fields. I have sailed down mighty rivers.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Percy Bysshe Shelley",
    "slug": "percy-bysshe-shelley"
   }
  ],
  "sources": []
 },
 {
  "slug": "a-journey-of-a-thousand-miles-begins-with",
  "quote": "A journey of a thousand miles begins with a single step.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Confucius",
    "slug": "confucius"
   }
  ],
  "sources": []
 },
 {
  "slug": "my-favorite-thing-is-to-go-where-i",
  "quote": "My favorite thing is to go where I have never gone.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Diane Arbus",
    "slug": "diane-arbus"
   }
  ],
  "sources": []
 },
 {
  "slug": "im-shakin-the-dust-of-this-crummy-little",
  "quote": "I’m shakin’ the dust of this crummy little town off my feet and I’m gonna see the world.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched. Credited to the character George Bailey, from It’s a Wonderful Life (1946).",
  "credited": [
   {
    "name": "George Bailey (It’s a Wonderful Life)",
    "slug": "george-bailey-its-a-wonderful-life"
   }
  ],
  "sources": []
 },
 {
  "slug": "im-more-interested-in-what-i-discover-than",
  "quote": "I’m more interested in what I discover than what I invent.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Paul Simon",
    "slug": "paul-simon"
   }
  ],
  "sources": []
 },
 {
  "slug": "it-is-not-down-in-any-map-true",
  "quote": "It is not down in any map; true places never are.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Herman Melville",
    "slug": "herman-melville"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-only-way-of-catching-a-train-i",
  "quote": "The only way of catching a train I have ever discovered is to miss the train before.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "G.K. Chesterton",
    "slug": "g-k-chesterton"
   }
  ],
  "sources": []
 },
 {
  "slug": "life-is-either-a-daring-adventure-or-nothing",
  "quote": "Life is either a daring adventure or nothing.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Helen Keller",
    "slug": "helen-keller"
   }
  ],
  "sources": []
 },
 {
  "slug": "ones-destination-is-never-a-place-but-rather",
  "quote": "One’s destination is never a place, but rather a new way of looking at things.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Henry Miller",
    "slug": "henry-miller"
   }
  ],
  "sources": []
 },
 {
  "slug": "i-never-travel-without-my-diary-one-should",
  "quote": "I never travel without my diary. One should always have something sensational to read in the train.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Oscar Wilde",
    "slug": "oscar-wilde"
   }
  ],
  "sources": []
 },
 {
  "slug": "o-lands-o-all-so-dear-to-me",
  "quote": "O lands! O all so dear to me—what you are, I become part of that, whatever it is.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Walt Whitman",
    "slug": "walt-whitman"
   }
  ],
  "sources": []
 },
 {
  "slug": "much-have-i-traveled-in-the-realms-of",
  "quote": "Much have I traveled in the realms of gold, And many goodly states and kingdoms seen…",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "John Keats",
    "slug": "john-keats"
   }
  ],
  "sources": []
 },
 {
  "slug": "stop-worrying-about-the-potholes-in-the-road",
  "quote": "Stop worrying about the potholes in the road and enjoy the journey.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Babs Hoffman",
    "slug": "babs-hoffman"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-world-is-all-gates-all-opportunities-strings",
  "quote": "The world is all gates, all opportunities, strings of tension waiting to be struck.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Ralph Waldo Emerson",
    "slug": "ralph-waldo-emerson"
   }
  ],
  "sources": []
 },
 {
  "slug": "only-those-who-will-risk-going-too-far",
  "quote": "Only those who will risk going too far can possibly find out how far one can go.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "T.S. Eliot",
    "slug": "t-s-eliot"
   }
  ],
  "sources": []
 },
 {
  "slug": "when-you-travel-remember-that-a-foreign-country",
  "quote": "When you travel, remember that a foreign country is not designed to make you comfortable. It is designed to make its own people comfortable.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Clifton Fadiman",
    "slug": "clifton-fadiman"
   }
  ],
  "sources": []
 },
 {
  "slug": "tip-the-world-over-on-its-side-and",
  "quote": "Tip the world over on its side, and everything loose will land in Los Angeles.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Frank Lloyd Wright",
    "slug": "frank-lloyd-wright"
   }
  ],
  "sources": []
 },
 {
  "slug": "i-sought-trains-i-found-passengers",
  "quote": "I sought trains; I found passengers.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Paul Theroux",
    "slug": "paul-theroux"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-voyage-of-discovery-lies-not-in-finding",
  "quote": "The voyage of discovery lies not in finding new landscapes, but in having new eyes.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Marcel Proust",
    "slug": "marcel-proust"
   }
  ],
  "sources": []
 },
 {
  "slug": "its-where-we-go-and-what-we-do",
  "quote": "It’s where we go, and what we do when we get there, that tells us who we are.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Joyce Carol Oates",
    "slug": "joyce-carol-oates"
   }
  ],
  "sources": []
 },
 {
  "slug": "if-you-wish-to-travel-far-and-fast",
  "quote": "If you wish to travel far and fast, travel light. Take off all your envies, jealousies, unforgiveness, selfishness and fears.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Glenn Clark",
    "slug": "glenn-clark"
   }
  ],
  "sources": []
 },
 {
  "slug": "a-good-traveller-has-no-fixed-plans-and",
  "quote": "A good traveller has no fixed plans and is not intent on arriving.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Lao-Tzu",
    "slug": "lao-tzu"
   }
  ],
  "sources": []
 },
 {
  "slug": "make-voyages-attempt-them-theres-nothing-else",
  "quote": "Make voyages! Attempt them… there’s nothing else.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Tennessee Williams",
    "slug": "tennessee-williams"
   }
  ],
  "sources": []
 },
 {
  "slug": "not-i-not-anyone-else-can-travel-that",
  "quote": "Not I—not anyone else, can travel that road for you, You must travel it for yourself.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Walt Whitman",
    "slug": "walt-whitman"
   }
  ],
  "sources": []
 },
 {
  "slug": "i-love-to-sail-on-forbidden-seas-and",
  "quote": "I love to sail on forbidden seas, and land on barbarous coasts.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Herman Melville",
    "slug": "herman-melville"
   }
  ],
  "sources": []
 },
 {
  "slug": "travel-not-only-stirs-the-blood-it-also",
  "quote": "Travel not only stirs the blood… It also gives strength to the spirit.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Florence Prag Kahn",
    "slug": "florence-prag-kahn"
   }
  ],
  "sources": []
 },
 {
  "slug": "if-you-actually-look-like-your-passport-photo",
  "quote": "If you actually look like your passport photo, you weren’t well enough to travel.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Sir Vivian Fuchs",
    "slug": "sir-vivian-fuchs"
   }
  ],
  "sources": []
 },
 {
  "slug": "the-most-important-trip-you-may-take-in",
  "quote": "The most important trip you may take in life is meeting people halfway.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Henry Boye",
    "slug": "henry-boye"
   }
  ],
  "sources": []
 },
 {
  "slug": "when-you-come-to-a-fork-in-the",
  "quote": "When you come to a fork in the road, take it.",
  "verdict": "unverified",
  "actual_author": null,
  "original_citation": null,
  "findings": "From Case study #2: the quotes in a Peter Pauper Press travel notebook. Not yet researched.",
  "credited": [
   {
    "name": "Yogi Berra",
    "slug": "yogi-berra"
   }
  ],
  "sources": []
 }
]$data$::jsonb) loop
    if exists (select 1 from entries where quote = e->>'quote') then
      continue;
    end if;

    base := e->>'slug';
    candidate := base;
    n := 2;
    while exists (select 1 from entries where slug = candidate) loop
      candidate := base || '-' || n;
      n := n + 1;
    end loop;

    insert into entries (slug, quote, verdict, status, actual_author, original_citation, findings)
    values (candidate, e->>'quote', (e->>'verdict')::verdict, 'draft', e->>'actual_author', e->>'original_citation', e->>'findings')
    returning id into new_id;

    pos := 0;
    for c in select value from jsonb_array_elements(e->'credited') loop
      select id into person from people where name = c->>'name';
      if person is null then
        base := c->>'slug';
        candidate := base;
        n := 2;
        while exists (select 1 from people where slug = candidate) loop
          candidate := base || '-' || n;
          n := n + 1;
        end loop;
        insert into people (name, slug) values (c->>'name', candidate) returning id into person;
      end if;
      insert into attributions (entry_id, person_id, position) values (new_id, person, pos);
      pos := pos + 1;
    end loop;

    pos := 0;
    for s in select value from jsonb_array_elements(e->'sources') loop
      insert into sources (entry_id, kind, label, url, position)
      values (new_id, (s->>'kind')::source_kind, s->>'label', s->>'url', pos);
      pos := pos + 1;
    end loop;

    added := added + 1;
  end loop;

  raise notice 'Added % draft entries.', added;
end
$$;
