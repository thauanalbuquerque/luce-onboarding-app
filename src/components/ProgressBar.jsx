export default function ProgressBar({ current, total, label }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="progress">
      <div className="progress__meta">
        <span>{label}</span>
        <span>
          {current} de {total}
        </span>
      </div>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
