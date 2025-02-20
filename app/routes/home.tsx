import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travel | Alexius Huang" },
    { name: "description", content: "Alexius's Personal Travel Blog" },
  ];
}

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>
        Coming Soon...!
      </p>
    </div>
  );
}
