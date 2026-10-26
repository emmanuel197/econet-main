import { OPERATOR } from "../../config/operator.js";
import { CLIENT_API_URL, CRM_API_URL } from "../../config/apiUrls.js";

// Placeholder until the homepage phase: shows the config is wired up.
export default function HomePage() {
  return (
    <section className="space-y-1 text-sm text-neutral-300">
      <p>Operator: {OPERATOR.uid} (id {OPERATOR.id}, prefix {OPERATOR.usernamePrefix})</p>
      <p>Client API: {CLIENT_API_URL}</p>
      <p>CRM API: {CRM_API_URL}</p>
    </section>
  );
}
