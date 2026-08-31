/**
 * A 4px bar, no step numbers.
 *
 * "2 of 6" reads as a survey and makes six screens feel like a form; a bar
 * that grows reads as progress and takes no reading at all. The numbers are
 * still there for a screen reader, where a silent bar would say nothing.
 */
export function FormProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const clamped = Math.min(Math.max(current, 0), total);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={clamped}
      className="g-progress"
    >
      <div className="g-progress-fill" style={{ width: `${(clamped / total) * 100}%` }} />
    </div>
  );
}
