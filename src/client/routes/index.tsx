import { createFileRoute } from "@tanstack/react-router";
import logo from "../assets/logo.png";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={logo}
        alt="Empty dashboard"
        className="pointer-events-none h-32 w-32 select-none opacity-30 grayscale"
      />
    </div>
  );
}
