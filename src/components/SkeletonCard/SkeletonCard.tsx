type Props = {
  className?: string;
};

export const SkeletonCard: React.FC<Props> = ({ className = '' }) => {
  return (
    <div
      data-testid="skeleton-card"
      className={`animate-pulse flex flex-col gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] h-full ${className}`}
    >
      <div className="w-full h-64 sm:h-72 md:h-48 lg:h-64 bg-slate-700/40 rounded-md" />
      <div className="flex-1">
        <div className="h-4 bg-slate-700/30 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-700/20 rounded w-1/2" />
      </div>
    </div>
  );
};
