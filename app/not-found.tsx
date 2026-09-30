import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="max-w-prose text-muted-foreground">
        That page does not exist. It may have been moved, or the link may be
        wrong.
      </p>
      <Link
        href="/projects"
        className="text-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Browse projects
      </Link>
    </div>
  );
}
