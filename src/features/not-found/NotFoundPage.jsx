import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="underline">Back to home</Link>
    </section>
  );
}
