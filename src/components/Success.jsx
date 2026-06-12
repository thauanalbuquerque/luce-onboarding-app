export default function Success({ form, exported, onBack }) {
  return (
    <div className="card success">
      <div className="success__check" aria-hidden>✓</div>
      <h2 className="step__title">Onboarding concluído!</h2>
      {form.meta?.closing && <p className="step__desc">{form.meta.closing}</p>}

      {!exported && (
        <div className="notice notice--warn">
          <span className="notice__icon" aria-hidden>⚠️</span>
          <span>
            Você ainda não exportou as respostas. Volte ao resumo para
            <strong> copiar ou baixar</strong> antes de fechar.
          </span>
        </div>
      )}

      {form.meta?.closingNote && (
        <div className="notice">
          <span className="notice__icon" aria-hidden>🔒</span>
          <span>{form.meta.closingNote}</span>
        </div>
      )}

      <div className="nav">
        <button className="btn btn--ghost" onClick={onBack}>
          ← Voltar ao resumo
        </button>
      </div>
    </div>
  )
}
