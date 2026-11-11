import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info",
  description: "About the project, submissions, privacy and contact.",
};

export default function InfoPage() {
  return (
    <div className="narrow page">
      <h1 className="title">Info</h1>

      <section className="stack gap-12" aria-labelledby="about">
        <h2 id="about" className="label">
          About this project
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.5 }}>
This investigation began when I started noticing, in the course of my everyday life, constant quotations of Mark Twain that I would look up then find he never said. 
          I have always been a person who kept a log of quotes I enjoyed, so I began looking up the sources to many of the quotes I had written down only to find
          that it was not, in fact, Winston Churchill who said that pithy phrase, or St. Francis of Assisi with that melodic prayer. 
        
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.5 }}>
          I am worried we are losing grasp of history with our unscrutinized quoting of legendary folk; the more research I conduct, the more I find that our belief structures are
          built on cornerstones of sand. Stay sharp. Good luck and Godspeed.
        </p>
      </section>

      <p className="muted rule-top">
        The rest of this page is under construction.
      </p>
    </div>
  );
}
