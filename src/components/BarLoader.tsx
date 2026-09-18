export default function BarLoader({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "bar-loader--sm" : size === "lg" ? "bar-loader--lg" : "";

  return (
    <div
      className={`bar-loader ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <span className="bar-loader__track">
        <span className="bar-loader__indeterminate" />
      </span>
    </div>
  );
}
