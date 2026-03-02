export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      <div className="text-center space-y-6">

        {/* Animated Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-emerald-100 animate-ping opacity-20" />
          
          <div className="h-20 w-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          
          <span className="absolute text-2xl font-bold tracking-tight text-emerald-600">
            MY
          </span>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-800">
          MY<span className="text-emerald-600">SHOP</span>
        </h1>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">
            Preparing your shopping experience
          </p>

          {/* Animated Dots */}
          <div className="flex justify-center gap-1">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" />
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>

      </div>
    </div>
  );
}
