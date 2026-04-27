// Home page skeleton — shown instantly while server components load
// This eliminates the "blank white flash" on first open
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="min-h-[92vh] bg-coffee-950 flex items-center">
        <div className="container mx-auto px-5 lg:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-7">
            <div className="h-6 w-48 bg-coffee-800 rounded-full" />
            <div className="space-y-4">
              <div className="h-16 w-full bg-coffee-800 rounded-xl" />
              <div className="h-16 w-3/4 bg-coffee-800 rounded-xl" />
            </div>
            <div className="h-5 w-full bg-coffee-800 rounded-lg" />
            <div className="h-5 w-2/3 bg-coffee-800 rounded-lg" />
            <div className="flex gap-4 pt-2">
              <div className="h-14 w-52 bg-yellow-800/40 rounded-2xl" />
              <div className="h-14 w-36 bg-coffee-800 rounded-2xl" />
            </div>
          </div>
          <div className="hidden md:block h-[450px] bg-coffee-800 rounded-[2.5rem]" />
        </div>
      </div>

      {/* Trust bar skeleton */}
      <div className="py-8 bg-white border-b border-coffee-100">
        <div className="container mx-auto px-5 flex justify-around">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-32 bg-coffee-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="py-28 bg-white">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="h-4 w-24 bg-coffee-100 rounded-full mx-auto" />
            <div className="h-12 w-72 bg-coffee-100 rounded-xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-coffee-100 overflow-hidden">
                <div className="aspect-[4/5] bg-coffee-100" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-coffee-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-coffee-100 rounded-lg w-1/2" />
                  <div className="h-8 bg-coffee-100 rounded-lg w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
