import { useEffect, useMemo, useRef, useState } from 'react'
import { buildSummary } from '../utils/form.js'
import { submitOnboarding, isWebhookConfigured } from '../utils/submit.js'

// status: 'idle' | 'sending' | 'sent' | 'failed' | 'off'
export default function Success({ form, answers, generatedAt, exported, onBack }) {
  const { json } = useMemo(
    () => buildSummary(form, answers, generatedAt),
    [form, answers, generatedAt],
  )
  const [status, setStatus] = useState(isWebhookConfigured ? 'idle' : 'off')
  const sentRef = useRef(false)

  const send = async () => {
    if (!isWebhookConfigured) return
    setStatus('sending')
    try {
      await submitOnboarding({
        clinica: form.meta?.clinic,
        formVersion: form.meta?.form_version,
        generatedAt,
        payload: json,
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  // Auto-envio uma única vez ao entrar na tela.
  useEffect(() => {
    if (sentRef.current || !isWebhookConfigured) return
    sentRef.current = true
    send()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="card success">
      <div className="success__check" aria-hidden>✓</div>
      <h2 className="step__title">Onboarding concluído!</h2>
      {form.meta?.closing && <p className="step__desc">{form.meta.closing}</p>}

      {/* Status do envio automático ao backend (não bloqueia nada) */}
      {status === 'sending' && (
        <div className="notice">
          <span className="notice__icon" aria-hidden>⏳</span>
          <span>Salvando as respostas…</span>
        </div>
      )}
      {status === 'sent' && (
        <div className="notice notice--ok">
          <span className="notice__icon" aria-hidden>✓</span>
          <span>Respostas salvas automaticamente.</span>
        </div>
      )}
      {status === 'failed' && (
        <div className="notice notice--warn">
          <span className="notice__icon" aria-hidden>⚠️</span>
          <span>
            Não foi possível salvar automaticamente. Seus dados não se perderam —
            use <strong>Copiar</strong> ou <strong>Baixar</strong> no resumo.
            <button className="notice__retry" onClick={send}>
              Tentar de novo
            </button>
          </span>
        </div>
      )}

      {!exported && status !== 'sent' && (
        <div className="notice notice--warn">
          <span className="notice__icon" aria-hidden>⚠️</span>
          <span>
            Garanta um backup: volte ao resumo e <strong>copie ou baixe</strong> as
            respostas.
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
