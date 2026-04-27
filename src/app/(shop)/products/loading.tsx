export default function Loading() {
  return (
    <div className="animate-pulse py-16">
      <div className="container mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="h-4 w-24 bg-coffee-100 rounded-full" />
          <div className="h-12 w-64 bg-coffee-100 rounded-xl" />
          <div className="h-5 w-96 bg-coffee-100 rounded-lg" />
        </div>
        {/* Filter bar */}
        <div className="flex gap-3 mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-coffee-100 rounded-full" />
          ))}
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-coffee-100 overflow-hidden">
              <div className="aspect-[4/5] bg-coffee-100" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-coffee-100 rounded-lg w-3/4" />
                <div className="h-4 bg-coffee-100 rounded-lg w-1/2" />
                <div className="flex justify-between mt-4">
                  <div className="h-8 bg-coffee-100 rounded-lg w-16" />
                  <div className="h-8 bg-coffee-100 rounded-lg w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
