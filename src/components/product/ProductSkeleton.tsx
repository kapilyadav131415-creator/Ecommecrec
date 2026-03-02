export default function ProductSkeleton() {
  return (
    <div className="group relative flex flex-col animate-pulse">
      {/* Image Box Skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 mb-6"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-3 px-4 flex flex-col items-center">
        {/* Category Label */}
        <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
        {/* Title */}
        <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
        {/* Description/Rating */}
        <div className="h-2 w-1/2 bg-slate-100 rounded-full opacity-60"></div>
        {/* Price */}
        <div className="h-6 w-20 bg-slate-100 rounded-full mt-2"></div>
      </div>
    </div>
  );
}