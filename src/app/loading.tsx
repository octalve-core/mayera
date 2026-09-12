export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading Mayéra"
      className="min-h-[70vh] bg-mayera-paper px-5 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1280px] animate-pulse">
        <div className="h-3 w-32 rounded-full bg-mayera-sand" />
        <div className="mt-6 h-14 max-w-xl rounded-2xl bg-mayera-cream" />
        <div className="mt-5 h-4 max-w-2xl rounded-full bg-mayera-sand" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-80 rounded-[2rem] bg-mayera-cream" />
          ))}
        </div>
      </div>
    </main>
  );
}
