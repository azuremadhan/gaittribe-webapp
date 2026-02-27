export default function AdminLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="card h-28 animate-pulse" />
      ))}
      <div className="card h-80 animate-pulse md:col-span-2" />
      <div className="card h-80 animate-pulse md:col-span-2" />
    </div>
  );
}

