// Envio das respostas ao webhook do n8n (v2 — Opção C).
// O segredo do Supabase NÃO vive aqui: o front só conhece a URL pública do
// webhook e um token leve (deter spam casual). O n8n é quem fala com o Supabase.
//
// Config via variáveis de build do Vite (não hardcoded):
//   VITE_ONBOARDING_WEBHOOK_URL
//   VITE_ONBOARDING_TOKEN

export const webhookUrl = import.meta.env.VITE_ONBOARDING_WEBHOOK_URL || ''
const webhookToken = import.meta.env.VITE_ONBOARDING_TOKEN || ''

export const isWebhookConfigured = Boolean(webhookUrl)

export async function submitOnboarding({ clinica, formVersion, generatedAt, payload }) {
  if (!webhookUrl) {
    throw new Error('Webhook não configurado')
  }

  // Content-Type application/json; o n8n trata o CORS (Allowed Origins).
  // Token vai no corpo (evita header custom e preflight com Allow-Headers).
  const body = JSON.stringify({
    token: webhookToken,
    clinica: clinica || null,
    form_version: formVersion || null,
    generated_at: generatedAt || null,
    payload,
  })

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Falha no envio (HTTP ${res.status})`)
  }
  return true
}
