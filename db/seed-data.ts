// Starter content, taken from Ellen's original quote log.
// `npm run db:setup` loads this into an empty database.
// After launch, edit entries in Supabase instead; this file is only for seeding.
//
// verdicts: misattributed | paraphrased | unverified | accurate
// status:   published (shows on the site) | draft (hidden, still investigating)

export type SeedSource = { kind: "evidence" | "spreading"; label: string; url?: string };

export type SeedEntry = {
  quote: string;
  credited: string[];
  verdict: "misattributed" | "paraphrased" | "unverified" | "accurate";
  status: "published" | "draft";
  actualAuthor?: string;
  earliestKnown?: string;
  firstAttributed?: string;
  originalText?: string;
  originalCitation?: string;
  findings?: string;
  sources?: SeedSource[];
};

export const seedEntries: SeedEntry[] = [
  {
    quote: "I have never let my schooling interfere with my education.",
    credited: ["Mark Twain"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Grant Allen",
    earliestKnown: "1894",
    firstAttributed: "1907",
    findings:
      "This was the quote that began my inquiry into misattributed quotes. I noticed I was hearing more of Mark Twain’s witticisms than his actual writings, so I started looking into the quotables I heard so often, only to find that so few stood up to scrutiny.\n\nThe line actually belongs to the Canadian essayist Grant Allen, who used it in a book in 1894. It wasn’t attributed to Twain until 1907, and there’s no confirmation he ever said it. Be judicious before citing it as a Twain quote.",
  },
  {
    quote:
      "My dear Anya, I have once again lost everything. I swore to you that I would not go to the roulette table…",
    credited: ["Fyodor Dostoevsky"],
    verdict: "unverified",
    status: "published",
    findings:
      "Allegedly from a letter from Fyodor Dostoevsky to Anna Dostoevskaya dated October 29, 1871. But in the full list of his letters, there are no letters to his wife from 1871. There’s not even a letter with this date.",
    sources: [
      {
        kind: "evidence",
        label: "Index of Dostoevsky’s letters",
        url: "https://dostoevskiy-lit.ru/dostoevskiy/pisma-dostoevskogo/index.htm",
      },
    ],
  },
  {
    quote: "You don’t have a soul. You are a Soul. You have a body.",
    credited: ["C.S. Lewis"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Walter M. Miller Jr.",
    originalText: "You don’t have a soul, Doctor. You are a soul. You have a body, temporarily.",
    originalCitation: "Abbot Zerchi in A Canticle for Leibowitz, p. 242 (Bantam edition, February 1961)",
    findings:
      "Oft attributed to C.S. Lewis, this is actually from the novel A Canticle for Leibowitz by Walter Miller, spoken by Abbot Zerchi.",
  },
  {
    quote: "The reports of my death have been greatly exaggerated.",
    credited: ["Mark Twain"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "Mark Twain",
    earliestKnown: "1897",
    originalText: "The report of my death was an exaggeration.",
    originalCitation: "New York Journal, 2 June 1897",
    findings:
      "I heard this “quote” relayed by Northwestern professor Gary Morson. This one, honestly, I give a pass, because what Twain actually said is very close, and he really was the subject of a death hoax. It’s fine, but it is still being logged for posterity.\n\nNewspapers had reported him ill or dead; it seems they had confused him with his cousin, James Ross Clemens, who was seriously ill in London at the time.",
    sources: [
      {
        kind: "evidence",
        label: "OUP Academic",
        url: "https://oupacademic.tumblr.com/post/48310773463/misquotation-reports-of-my-death-have-been",
      },
      {
        kind: "evidence",
        label: "Oxford Dictionary of Quotations",
        url: "http://www.oup.com/us/catalog/general/subject/Reference/?view=usa&ci=9780199237173",
      },
    ],
  },
  {
    quote: "Beauty will save the world.",
    credited: ["Fyodor Dostoevsky"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "Fyodor Dostoevsky, in a character’s voice",
    originalText: "Is it true, prince, that you once declared that ‘beauty would save the world’?",
    originalCitation: "Ippolit, in The Idiot",
    findings:
      "From The Idiot. At Prince Myshkin’s birthday party, Ippolit says he believes Myshkin once said it. Additionally, Adelaida says in an earlier chapter: “With such beauty as that one might overthrow the world.”\n\nThis is a bit of a meta-misquote, as the quote itself is a secondhand paraphrase of another character’s beliefs. Let it be known that this is the pernicious mechanism propagating the Misattribution Crisis.",
    sources: [
      {
        kind: "evidence",
        label: "Discussion of this misquote",
        url: "https://www.online-literature.com/forums/showthread.php?32081-Does-Myshkin-ever-say-quot-Beauty-will-save-the-world-quot",
      },
    ],
  },
  {
    quote: "I apologize for such a long letter—I didn’t have time to write a short one.",
    credited: ["Mark Twain", "T.S. Eliot", "Kurt Vonnegut", "Benjamin Franklin"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Blaise Pascal",
    earliestKnown: "1657",
    originalText: "I have made this one longer only because I did not have the leisure to make it shorter.",
    originalCitation: "Lettres Provinciales, 1657 (translated from the French)",
    findings:
      "I’ve heard this quote primarily cited as Mark Twain, but when researching I found that it has numerous attributions. It was written, partially and in the same spirit, by Blaise Pascal.",
    sources: [
      { kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2012/04/28/shorter-letter/" },
    ],
  },
  {
    quote: "God helps those who help themselves.",
    credited: ["The Bible", "Benjamin Franklin"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "An ancient Greek proverb",
    findings:
      "Often misattributed to the Bible, or to Ben Franklin in Poor Richard’s Almanack. The proverb actually originated in Ancient Greece. It shows up in two of Aesop’s fables and in Greek drama: Sophocles wrote that heaven never helps the men who will not act, and Euripides has Orestes say that he who strives will find his gods strive for him equally. Ovid’s version is “divinity helps those who dare” (audentes deus ipse iuvat).\n\nI’m a big fan of “Divinity helps those who dare.”",
    sources: [
      { kind: "evidence", label: "Wikipedia", url: "https://en.wikipedia.org/wiki/God_helps_those_who_help_themselves" },
    ],
  },
  {
    quote: "Everything in moderation, even moderation.",
    credited: ["Oscar Wilde", "Socrates", "Benjamin Franklin", "Voltaire", "Mark Twain"],
    verdict: "unverified",
    status: "published",
    sources: [
      { kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2022/05/13/moderation/" },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/22688-everything-in-moderation-including-moderation",
      },
    ],
  },
  {
    quote:
      "I have come to the frightening conclusion that I am the decisive element. It is my personal approach that creates the climate.",
    credited: ["Goethe"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Haim G. Ginott",
    earliestKnown: "1972",
    originalCitation: "Preface to Teacher and Child: A Book for Parents and Teachers (1972)",
    findings:
      "Goethe did not say this. The lines come from the preface of Haim G. Ginott’s 1972 book Teacher and Child. Ginott said he wrote them as a young teacher, as a summary of the book’s philosophy, and they’ve been repeated (and occasionally garbled) ever since.",
  },
  {
    quote: "Heavy lies the crown.",
    credited: ["William Shakespeare"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "William Shakespeare",
    originalText: "Uneasy lies the head that wears a crown.",
    originalCitation: "Henry IV, Part 2. Folger Shakespeare Library edition, ed. Barbara A. Mowat and Paul Werstine, 2020",
    findings: "A common misquotation of Shakespeare’s Henry IV, Part 2, where King Henry laments that sleep is denied to a king.",
  },
  {
    quote: "The earth has music for those who listen.",
    credited: ["William Shakespeare"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Reginald Holmes",
    earliestKnown: "1955",
    originalText: "The earth has its music for those who will listen",
    originalCitation: "“The Magic of Sound,” in Fireside Fancies (1955)",
    findings:
      "Actually written by the poet Reginald Holmes. (I can’t find a PDF of the book online, so we’re gonna have to trust the infallible wall of the internet.)",
    sources: [
      {
        kind: "evidence",
        label: "Literature Stack Exchange",
        url: "https://literature.stackexchange.com/questions/19655/reference-for-author-of-the-earth-has-music-for-those-who-listen",
      },
    ],
  },
  {
    quote: "Singing is praying twice.",
    credited: ["St. Augustine"],
    verdict: "unverified",
    status: "published",
    findings: "Qui cantat, bis orat: he who sings prays twice. Not actually St. Augustine.",
  },
  {
    quote:
      "I shall pass through this world but once. Any good therefore that I can do or any kindness that I can show to any human being, let me do it now.",
    credited: ["Mahatma Gandhi", "Stephen Grellet", "William Penn"],
    verdict: "unverified",
    status: "published",
    earliestKnown: "1868",
    findings:
      "Attributed to many people. The quotation appeared in a Kansas newspaper in October 1868, where its creator was described only as an anonymous “wise man.”",
    sources: [
      { kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2023/12/01/kindness-now/" },
    ],
  },
  {
    quote: "A penny saved is a penny earned.",
    credited: ["Benjamin Franklin"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "Benjamin Franklin",
    earliestKnown: "1737",
    originalText: "A penny saved is two pence clear.",
    originalCitation: "Poor Richard’s Almanack, 1737",
  },
  {
    quote:
      "Lord, make me an instrument of your peace. Where there is hatred, let me bring love.",
    credited: ["St. Francis of Assisi"],
    verdict: "unverified",
    status: "published",
    earliestKnown: "1912",
    findings:
      "The Peace Prayer first appeared in 1912, in an issue of the French Catholic magazine La Clochette, centuries after St. Francis.",
    sources: [
      {
        kind: "evidence",
        label: "Catholic Answers: The Harm of Fake St. Francis Quotes",
        url: "https://www.catholic.com/audio/cot/804-the-harm-of-fake-st-francis-quotes",
      },
    ],
  },
  {
    quote: "The definition of insanity is doing the same thing over and over and expecting different results.",
    credited: ["Albert Einstein"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Narcotics Anonymous literature",
    earliestKnown: "1981",
    findings: "The “definition of insanity” quote first appeared in 1981, in a document published by Narcotics Anonymous.",
    sources: [
      { kind: "evidence", label: "Professor Buzzkill", url: "https://professorbuzzkill.com/2017/05/29/einstein-insanity-qnq/" },
    ],
  },
  {
    quote:
      "If you’re not a liberal when you’re 25, you have no heart. If you’re not a conservative by the time you’re 35, you have no brain.",
    credited: ["Winston Churchill"],
    verdict: "unverified",
    status: "published",
    findings:
      "Historian Paul Addison of Edinburgh University pointed out that Churchill can hardly have said this: he was a Conservative at 15 and a Liberal at 35, and his wife Clementine is generally thought to have been a lifelong Liberal.",
    sources: [
      {
        kind: "evidence",
        label: "International Churchill Society: Quotes Falsely Attributed",
        url: "https://winstonchurchill.org/resources/quotes/quotes-falsely-attributed/",
      },
    ],
  },
  {
    quote: "With integrity, nothing else counts. Without integrity, nothing else counts.",
    credited: ["Winston Churchill"],
    verdict: "unverified",
    status: "published",
    findings:
      "This one has circulated online for years, but a search of Finest Hour’s digital archive (15 million words by Churchill, plus 35 million about him, including all of his published books, articles, speeches and letters) turns up nothing.",
    sources: [
      {
        kind: "evidence",
        label: "International Churchill Society: Quotes Falsely Attributed",
        url: "https://winstonchurchill.org/resources/quotes/quotes-falsely-attributed/",
      },
    ],
  },
  {
    quote: "I saw the angel in the marble and carved until I set him free.",
    credited: ["Michelangelo"],
    verdict: "unverified",
    status: "published",
    originalText:
      "The best of artists hath no thought to show / Which the rough stone in its superfluous shell / Doth not include: to break the marble spell / Is all the hand that serves the brain can do.",
    originalCitation: "Michelangelo, Sonnet 15, “The Lover and the Sculptor” (a possible origin)",
    findings: "Widely attributed, but of uncertain provenance. A potential origin is Michelangelo’s own poetry.",
    sources: [
      { kind: "evidence", label: "Translation on Project Gutenberg", url: "https://www.gutenberg.org/cache/epub/10314/pg10314.html" },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/1161553-i-saw-the-angel-in-the-marble-and-carved-until",
      },
    ],
  },
  {
    quote: "Standing on the shoulders of giants.",
    credited: ["Isaac Newton"],
    verdict: "accurate",
    status: "published",
    actualAuthor: "Isaac Newton",
    earliestKnown: "12th century",
    findings:
      "The concept has been dated to the 12th century and, according to John of Salisbury, is attributable to Bernard of Chartres.\n\nGoodreads attributes it to The Correspondence of Isaac Newton: Volume 5, 1709–1713, but upon inspection of a PDF copy of the work, it is not there.",
    sources: [
      { kind: "evidence", label: "John of Salisbury (Wikipedia)", url: "https://en.wikipedia.org/wiki/John_of_Salisbury" },
      { kind: "evidence", label: "Bernard of Chartres (Wikipedia)", url: "https://en.wikipedia.org/wiki/Bernard_of_Chartres" },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/10286-if-i-have-seen-further-it-is-by-standing-on",
      },
    ],
  },
  {
    quote: "How lucky am I to have people that make saying goodbye so hard.",
    credited: ["A.A. Milne"],
    verdict: "unverified",
    status: "published",
    findings: "No record of this in any Winnie the Pooh book or in any of A.A. Milne’s writings.",
    sources: [
      {
        kind: "spreading",
        label: "Reddit",
        url: "https://www.reddit.com/r/QuotesPorn/comments/1uylib/how_lucky_i_am_to_have_something_that_makes/",
      },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/7547425-how-lucky-am-i-to-have-something-that-makes-saying",
      },
    ],
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    credited: ["Oscar Wilde", "Dr. Seuss"],
    verdict: "unverified",
    status: "published",
    findings:
      "It is not listed in The Wit & Wisdom of Oscar Wilde, an extensive collection compiled by quotation expert Ralph Keyes. Who actually said it? Maybe Thomas Merton, whose essay “Day of a Stranger” pushes back on all the talk about “being yourself,” reserving the right to forget about being himself, since there is very little chance of his being anybody else.",
    sources: [
      {
        kind: "evidence",
        label: "Quote Investigator, a wonderful source fighting the Misattribution Crisis",
        url: "https://quoteinvestigator.com/2014/01/20/be-yourself/",
      },
    ],
  },
  {
    quote: "Well behaved women rarely make history.",
    credited: ["Marilyn Monroe", "Eleanor Roosevelt", "Anne Boleyn"],
    verdict: "misattributed",
    status: "published",
    actualAuthor: "Laurel Thatcher Ulrich",
    originalCitation: "“Vertuous Women Found: New England Ministerial Literature, 1668–1735”",
    sources: [
      { kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2012/11/03/well-behaved-women/" },
    ],
  },
  {
    quote: "The price of anything is the amount of life you exchange for it.",
    credited: ["Henry David Thoreau"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "Henry David Thoreau",
    originalText:
      "The cost of a thing is the amount of what I will call life which is required to be exchanged for it, immediately or in the long run.",
    originalCitation: "Walden",
    findings: "Editor’s note: this misquote might pass.",
  },
  {
    quote: "L’État, c’est moi. (The state, it is I.)",
    credited: ["Louis XIV"],
    verdict: "unverified",
    status: "published",
    findings:
      "He supposedly said it before the Parlement of Paris on 13 April 1655, asserting royal authority against the Parlement’s defiance, but the attribution is only alleged.",
    sources: [{ kind: "evidence", label: "Wikipedia", url: "https://en.wikipedia.org/wiki/L%27%C3%89tat,_c%27est_moi" }],
  },
  {
    quote:
      "Men wanted for hazardous journey, small wages, bitter cold, long months of complete darkness, constant danger, safe return doubtful, honor and recognition in case of success.",
    credited: ["Ernest Shackleton"],
    verdict: "unverified",
    status: "published",
    findings:
      "There’s no evidence that an ad was ever taken out in the newspaper looking for crew to join him on his voyage to Antarctica. This quote is very likely apocryphal.",
    sources: [
      {
        kind: "evidence",
        label: "Smithsonian Magazine",
        url: "https://www.smithsonianmag.com/smart-news/ernest-shackletons-famous-job-ad-men-wanted-for-hazardous-journey-is-probably-a-myth-5552379/",
      },
      { kind: "spreading", label: "Etsy", url: "https://www.etsy.com/listing/703561280/men-wanted-for-hazardous-journey-poster" },
      { kind: "spreading", label: "Pinterest", url: "https://www.pinterest.com/pin/11118330328550272/" },
    ],
  },
  {
    quote: "Be the change you wish to see in the world.",
    credited: ["Mahatma Gandhi"],
    verdict: "unverified",
    status: "published",
    findings: "This quote first appeared 26 years after Gandhi died.",
    sources: [
      { kind: "evidence", label: "Quote Investigator", url: "https://quoteinvestigator.com/2017/10/23/be-change/" },
      {
        kind: "spreading",
        label: "Reddit",
        url: "https://www.reddit.com/r/QuotesPorn/comments/nbaxw1/be_the_change_you_wish_to_see_in_the_world/",
      },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/24499-be-the-change-that-you-wish-to-see-in-the",
      },
    ],
  },
  {
    quote: "The coldest winter I ever spent was a summer in San Francisco.",
    credited: ["Mark Twain"],
    verdict: "unverified",
    status: "published",
    findings:
      "Unfortunately, there’s no record of him saying this. I think it’s used in Ron Chernow’s book about Twain, but he could have referenced it as a misquote and I just missed it (another casualty of 2x listening speed).",
    sources: [{ kind: "evidence", label: "SF City Guides", url: "https://sfcityguides.org/tour-tale/truth-or-myth-sf-winter/" }],
  },
  {
    quote: "I have not failed. I’ve just found 10,000 ways that won’t work.",
    credited: ["Thomas Edison"],
    verdict: "paraphrased",
    status: "published",
    actualAuthor: "Thomas Edison",
    originalText: "Results! Why, man, I have gotten a lot of results! I know several thousand things that won’t work.",
  },

  // ---- Drafts: still under investigation, hidden from the site ----
  {
    quote: "Do not despair, one of the thieves was saved. Do not presume, one of the thieves was damned.",
    credited: ["St. Augustine"],
    verdict: "unverified",
    status: "draft",
    findings: "Attributed to St. Augustine on the wall of the Alice Millar Chapel at Northwestern University.",
  },
  {
    quote: "Preach the gospel always. If necessary, use words.",
    credited: ["St. Francis of Assisi"],
    verdict: "unverified",
    status: "draft",
  },
  {
    quote: "Lies, damned lies, and statistics.",
    credited: ["Benjamin Disraeli"],
    verdict: "unverified",
    status: "draft",
    findings:
      "I experienced a serendipitous moment in my Sports and Society in Spain class with a professor who was a near-PhD at Rutgers and instead became a sports marketing specialist for Spanish football for 25 years. He told us that he read the quote on the first page of his graduate textbook, which attributed it to Benjamin Disraeli.",
  },
  {
    quote: "Of all the ways to lose a person, death is the kindest.",
    credited: ["John Keats", "Ralph Waldo Emerson"],
    verdict: "unverified",
    status: "draft",
    sources: [
      {
        kind: "spreading",
        label: "Andrew Huberman’s podcast with Martha Beck (attributed to Keats)",
        url: "https://www.hubermanlab.com/episode/dr-martha-beck-accessing-your-best-self-with-mind-body-practices-belief-testing-imagination",
      },
      {
        kind: "spreading",
        label: "Goodreads",
        url: "https://www.goodreads.com/quotes/276455-of-all-the-ways-to-lose-a-person-death-is",
      },
    ],
  },
  { quote: "I disapprove of what you say, but I will defend to the death your right to say it.", credited: ["Voltaire"], verdict: "unverified", status: "draft" },
  { quote: "Let them eat cake.", credited: ["Marie Antoinette"], verdict: "unverified", status: "draft" },
  { quote: "If I had asked people what they wanted, they would have said faster horses.", credited: ["Henry Ford"], verdict: "unverified", status: "draft" },
  { quote: "Whether you believe you can or you can’t, you’re right.", credited: ["Henry Ford"], verdict: "unverified", status: "draft" },
  {
    quote: "It ain’t what you don’t know that gets you into trouble. It’s what you know for sure that just ain’t so.",
    credited: ["Mark Twain"],
    verdict: "unverified",
    status: "draft",
  },
  { quote: "Elementary, my dear Watson.", credited: ["Sherlock Holmes"], verdict: "unverified", status: "draft" },
  { quote: "An eye for an eye makes the whole world blind.", credited: ["Mahatma Gandhi"], verdict: "unverified", status: "draft" },
  { quote: "Art is what you can get away with.", credited: ["Andy Warhol"], verdict: "unverified", status: "draft" },
  { quote: "Plato is a friend, but truth is an even better friend.", credited: ["Aristotle"], verdict: "unverified", status: "draft" },
  { quote: "There is only one good, knowledge, and one evil, ignorance.", credited: ["Aristotle"], verdict: "unverified", status: "draft" },
  {
    quote:
      "No man has the right to be an amateur in the matter of physical training. It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable.",
    credited: ["Socrates"],
    verdict: "unverified",
    status: "draft",
  },
  { quote: "How strange and lovely it is to be anything at all.", credited: ["John Green"], verdict: "unverified", status: "draft", findings: "From The Fault in Our Stars? Not real." },
];
