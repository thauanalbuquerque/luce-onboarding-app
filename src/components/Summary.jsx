import { useMemo, useState } from 'react'
import { buildSummary, downloadFile, slugify } from '../utils/form.js'

export default function Summary({ form, answers, generatedAt, onBack }) {
  const { json, text } = useMemo(
    () => buildSummary(form, answers, generatedAt),
    [form, answers, generatedAt],
  )
  const jsonStr = useMemo(() => JSON.stringify(json, null, 2), [json])
  const [tab, setTab] = useState('texto')
  const [toast, setToast] = useState('')

  const base = slugify(form.meta?.clinic || 'clinica')

  const flash = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const copy = async (content, label) => {
    try {
      await navigator.clipboard.writeText(content)
      flash(`${label} copiado ✓`)
    } catch {
      flash('Não foi possível copiar — selecione e copie manualmente.')
    }
  }

  return (
    <div className="card">
      <span className="step__eyebrow">Concluído</span>
      <h2 className="step__title">Resumo das respostas</h2>
      <p className="step__desc">
        Exporte o resultado para configurar o assistente. Copie ou baixe nos formatos
        abaixo.
      </p>

      <div className="tabs">
        <button
          className={`tab ${tab === 'texto' ? 'tab--active' : ''}`}
          onClick={() => setTab('texto')}
        >
          Texto / Markdown
        </button>
        <button
          className={`tab ${tab === 'json' ? 'tab--active' : ''}`}
          onClick={() => setTab('json')}
        >
          JSON
        </button>
      </div>

      <pre className="summary__preview">{tab === 'texto' ? text : jsonStr}</pre>

      <div className="summary__actions">
        {tab === 'texto' ? (
          <>
            <button className="btn btn--primary" onClick={() => copy(text, 'Texto')}>
              Copiar texto
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => downloadFile(`onboarding-${base}.md`, text, 'text/markdown')}
            >
              Baixar .md
            </button>
          </>
        ) : (
          <>
            <button className="btn btn--primary" onClick={() => copy(jsonStr, 'JSON')}>
              Copiar JSON
            </button>
            <button
              className="btn btn--ghost"
              onClick={() =>
                downloadFile(`onboarding-${base}.json`, jsonStr, 'application/json')
              }
            >
              Baixar .json
            </button>
          </>
        )}
      </div>

      <div className="nav">
        <button className="btn btn--ghost" onClick={onBack}>
          ← Voltar e revisar
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
