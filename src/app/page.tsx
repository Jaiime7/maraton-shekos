import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between p-6 text-center">
      <div className="my-auto flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Fernando &amp; Carla
        </h1>
        <p className="text-base text-neutral-600">
          Maratón Sorpresa — 6 km en forma de corazón
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/run"
            className="flex min-h-12 items-center justify-center rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white"
          >
            Entrar a la carrera (Demo)
          </Link>
        </div>
      </div>

      <footer className="py-4">
        <Link
          href="/staff"
          className="text-sm text-neutral-500 underline underline-offset-4"
        >
          Acceso Staff
        </Link>
      </footer>
    </main>
  );
}
