import { useMemo, useState } from 'react'
import { form } from './data/briefing.js'
import ProgressBar from './components/ProgressBar.jsx'
import Field from './components/Field.jsx'
import Summary from './components/Summary.jsx'
import { validateBlock } from './utils/form.js'

// Telas: 'intro' -> blocos (0..n-1) -> 'summary'
export default function App() {
  const blocks = form.blocks
  const total = blocks.length
  const [screen, setScreen] = useState('intro') // 'intro' | 'block' | 'summary'
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [generatedAt, setGeneratedAt] = useState('')

  const block = blocks[index]

  const setAnswer = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const goNext = () => {
    const blockErrors = validateBlock(block, answers)
    if (Object.keys(blockErrors).length > 0) {
      setErrors(blockErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    if (index < total - 1) {
      setIndex(index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setGeneratedAt(new Date().toLocaleString('pt-BR'))
      setScreen('summary')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    setErrors({})
    if (screen === 'summary') {
      setScreen('block')
      setIndex(total - 1)
    } else if (index > 0) {
      setIndex(index - 1)
    } else {
      setScreen('intro')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progressCurrent = useMemo(() => index + 1, [index])

  return (
    <div className="app">
      <header className="brand">
        <span className="brand__mark">L</span>
        <div>
          <div className="brand__name">Luce</div>
          <div className="brand__tag">Onboarding da clínica</div>
        </div>
      </header>

      {screen !== 'intro' && (
        <ProgressBar
          current={screen === 'summary' ? total : progressCurrent}
          total={total}
          label={screen === 'summary' ? 'Resumo' : block.title}
        />
      )}

      <main className="app__main">
        {screen === 'intro' && (
          <Intro form={form} onStart={() => setScreen('block')} />
        )}

        {screen === 'block' && (
          <div className="card">
            <span className="step__eyebrow">
              Etapa {progressCurrent} de {total}
            </span>
            <h2 className="step__title">{block.title}</h2>
            {block.description && <p className="step__desc">{block.description}</p>}

            {block.fields.map((field) => (
              <Field
                key={field.id}
                field={field}
                value={answers[field.id]}
                error={errors[field.id]}
                onChange={(v) => setAnswer(field.id, v)}
              />
            ))}

            <div className="nav">
              <button className="btn btn--ghost" onClick={goBack}>
                ← Voltar
              </button>
              <button className="btn btn--primary" onClick={goNext}>
                {index < total - 1 ? 'Continuar' : 'Ver resumo'}
              </button>
            </div>
          </div>
        )}

        {screen === 'summary' && (
          <Summary
            form={form}
            answers={answers}
            generatedAt={generatedAt}
            onBack={goBack}
          />
        )}
      </main>
    </div>
  )
}

function Intro({ form, onStart }) {
  return (
    <div className="card">
      <span className="step__eyebrow">Bem-vindos</span>
      <h2 className="step__title">{form.meta?.title || 'Onboarding da clínica'}</h2>
      {form.meta?.intro && <p className="step__desc">{form.meta.intro}</p>}

      <div className="notice">
        <span className="notice__icon" aria-hidden>🔒</span>
        <span>
          <strong>Privacidade (LGPD):</strong> este formulário coleta apenas
          informações sobre o funcionamento da clínica. Não pedimos nenhum dado de
          paciente.
        </span>
      </div>

      <div className="nav">
        <button className="btn btn--primary" onClick={onStart}>
          Começar
        </button>
      </div>
    </div>
  )
}
