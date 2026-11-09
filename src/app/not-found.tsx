import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow page">
      <h1 className="title">Not found</h1>
      <p className="lede">
        That page doesn’t exist. Fittingly, neither do a lot of famous quotes. Try <Link href="/search">searching</Link>{" "}
        or <Link href="/people">browsing by person</Link>.
      </p>
    </div>
  );
}
