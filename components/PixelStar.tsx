export default function PixelStar({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 11 11"
      shapeRendering="crispEdges"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="5" y="1" width="1" height="9" />
      <rect x="1" y="5" width="9" height="1" />
      <rect x="3" y="3" width="1" height="1" />
      <rect x="7" y="3" width="1" height="1" />
      <rect x="3" y="7" width="1" height="1" />
      <rect x="7" y="7" width="1" height="1" />
    </svg>
  );
}
