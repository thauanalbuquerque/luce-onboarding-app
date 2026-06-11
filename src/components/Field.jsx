// Renderiza um campo conforme seu tipo, de forma data-driven.
// Tipos suportados: text, textarea, radio, checkbox, confirm.

const OTHER_VALUE = '__outro__'

export default function Field({ field, value, error, onChange }) {
  const { id, label, type, required, help, options = [], allowOther } = field

  const labelEl = (
    <label className="field__label" htmlFor={id}>
      {label}
      {required && <span className="field__req">*</span>}
    </label>
  )

  if (type === 'text') {
    return (
      <div className="field">
        {labelEl}
        {help && <p className="field__help">{help}</p>}
        <input
          id={id}
          className={`input ${error ? 'input--error' : ''}`}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
        />
        {error && <p className="field__error">{error}</p>}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className="field">
        {labelEl}
        {help && <p className="field__help">{help}</p>}
        <textarea
          id={id}
          className={`textarea ${error ? 'textarea--error' : ''}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
        />
        {error && <p className="field__error">{error}</p>}
      </div>
    )
  }

  if (type === 'radio') {
    const current = value || {}
    const selected = current.choice ?? ''
    return (
      <div className="field">
        {labelEl}
        {help && <p className="field__help">{help}</p>}
        <div className="options">
          {options.map((opt) => (
            <label
              key={opt}
              className={`option ${selected === opt ? 'option--checked' : ''}`}
            >
              <input
                type="radio"
                name={id}
                checked={selected === opt}
                onChange={() => onChange({ choice: opt, other: '' })}
              />
              <span className="option__text">{opt}</span>
            </label>
          ))}
          {allowOther && (
            <label
              className={`option ${selected === OTHER_VALUE ? 'option--checked' : ''}`}
            >
              <input
                type="radio"
                name={id}
                checked={selected === OTHER_VALUE}
                onChange={() => onChange({ choice: OTHER_VALUE, other: current.other || '' })}
              />
              <span className="option__text">Outro</span>
            </label>
          )}
        </div>
        {allowOther && selected === OTHER_VALUE && (
          <input
            className="input option__other"
            type="text"
            placeholder="Qual?"
            value={current.other || ''}
            onChange={(e) => onChange({ choice: OTHER_VALUE, other: e.target.value })}
          />
        )}
        {error && <p className="field__error">{error}</p>}
      </div>
    )
  }

  if (type === 'checkbox') {
    const current = value || { choices: [], other: '' }
    const choices = current.choices || []
    const toggle = (opt) => {
      const next = choices.includes(opt)
        ? choices.filter((c) => c !== opt)
        : [...choices, opt]
      onChange({ ...current, choices: next })
    }
    const otherOn = choices.includes(OTHER_VALUE)
    return (
      <div className="field">
        {labelEl}
        {help && <p className="field__help">{help}</p>}
        <div className="options">
          {options.map((opt) => (
            <label
              key={opt}
              className={`option ${choices.includes(opt) ? 'option--checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={choices.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span className="option__text">{opt}</span>
            </label>
          ))}
          {allowOther && (
            <label className={`option ${otherOn ? 'option--checked' : ''}`}>
              <input type="checkbox" checked={otherOn} onChange={() => toggle(OTHER_VALUE)} />
              <span className="option__text">Outro</span>
            </label>
          )}
        </div>
        {allowOther && otherOn && (
          <input
            className="input option__other"
            type="text"
            placeholder="Qual?"
            value={current.other || ''}
            onChange={(e) => onChange({ ...current, other: e.target.value })}
          />
        )}
        {error && <p className="field__error">{error}</p>}
      </div>
    )
  }

  if (type === 'confirm') {
    // Bloco 4: texto fixo + "aprovam como está / querem ajustar" + ajuste opcional.
    const current = value || {}
    const selected = current.choice ?? ''
    return (
      <div className="field">
        {labelEl}
        {help && <p className="field__help">{help}</p>}
        {field.text && <div className="confirm-block">{field.text}</div>}
        <div className="options" style={{ marginTop: 'var(--sp-3)' }}>
          <label className={`option ${selected === 'aprovam' ? 'option--checked' : ''}`}>
            <input
              type="radio"
              name={id}
              checked={selected === 'aprovam'}
              onChange={() => onChange({ choice: 'aprovam', adjust: '' })}
            />
            <span className="option__text">
              {field.approveLabel || 'Aprovamos como está'}
            </span>
          </label>
          <label className={`option ${selected === 'ajustar' ? 'option--checked' : ''}`}>
            <input
              type="radio"
              name={id}
              checked={selected === 'ajustar'}
              onChange={() => onChange({ choice: 'ajustar', adjust: current.adjust || '' })}
            />
            <span className="option__text">
              {field.adjustLabel || 'Queremos ajustar'}
            </span>
          </label>
        </div>
        {selected === 'ajustar' && (
          <textarea
            className="textarea option__other"
            placeholder="Descreva o ajuste desejado"
            value={current.adjust || ''}
            onChange={(e) => onChange({ choice: 'ajustar', adjust: e.target.value })}
          />
        )}
        {error && <p className="field__error">{error}</p>}
      </div>
    )
  }

  return null
}

export { OTHER_VALUE }
