export default function RootLoading() {
  return (
    <main className="section-shell py-10">
      <div className="card h-72 animate-pulse" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card h-64 animate-pulse" />
        ))}
      </div>
    </main>
  );
}

