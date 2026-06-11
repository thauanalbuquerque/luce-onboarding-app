import { OTHER_VALUE } from '../components/Field.jsx'

// ---- Valor "vazio" por tipo, para validação de obrigatórios ----
export function isEmpty(field, value) {
  if (value == null) return true
  switch (field.type) {
    case 'text':
    case 'textarea':
      return String(value).trim() === ''
    case 'radio':
      if (!value.choice) return true
      if (value.choice === OTHER_VALUE) return !value.other || value.other.trim() === ''
      return false
    case 'checkbox':
      return !value.choices || value.choices.length === 0
    case 'confirm':
      if (!value.choice) return true
      if (value.choice === 'ajustar') return !value.adjust || value.adjust.trim() === ''
      return false
    default:
      return false
  }
}

// ---- Valida uma etapa; retorna mapa { fieldId: mensagem } ----
export function validateBlock(block, answers) {
  const errors = {}
  for (const field of block.fields) {
    if (field.required && isEmpty(field, answers[field.id])) {
      errors[field.id] = 'Campo obrigatório'
    }
  }
  return errors
}

// ---- Representação legível de uma resposta ----
function readableValue(field, value) {
  if (value == null) return '—'
  switch (field.type) {
    case 'text':
    case 'textarea':
      return String(value).trim() || '—'
    case 'radio':
      if (!value.choice) return '—'
      return value.choice === OTHER_VALUE ? `Outro: ${value.other || ''}`.trim() : value.choice
    case 'checkbox': {
      const list = (value.choices || []).map((c) =>
        c === OTHER_VALUE ? `Outro: ${value.other || ''}`.trim() : c,
      )
      return list.length ? list.join(', ') : '—'
    }
    case 'confirm':
      if (value.choice === 'aprovam') return 'Aprovaram como está'
      if (value.choice === 'ajustar') return `Querem ajustar: ${value.adjust || ''}`.trim()
      return '—'
    default:
      return '—'
  }
}

// ---- Valor estruturado para o JSON ----
function structuredValue(field, value) {
  if (value == null) return null
  switch (field.type) {
    case 'text':
    case 'textarea':
      return String(value).trim() || null
    case 'radio':
      if (!value.choice) return null
      return value.choice === OTHER_VALUE ? { outro: value.other || '' } : value.choice
    case 'checkbox':
      return {
        selecionados: (value.choices || []).filter((c) => c !== OTHER_VALUE),
        outro: value.choices?.includes(OTHER_VALUE) ? value.other || '' : null,
      }
    case 'confirm':
      return {
        decisao: value.choice || null,
        ajuste: value.choice === 'ajustar' ? value.adjust || '' : null,
      }
    default:
      return null
  }
}

// ---- Monta JSON estruturado + texto formatado (Markdown) ----
export function buildSummary(form, answers, generatedAt) {
  const json = {
    formulario: form.meta?.title || 'Onboarding Luce',
    clinica: form.meta?.clinic || null,
    gerado_em: generatedAt,
    blocos: form.blocks.map((block) => ({
      id: block.id,
      titulo: block.title,
      respostas: block.fields.map((field) => ({
        id: field.id,
        pergunta: field.label,
        valor: structuredValue(field, answers[field.id]),
      })),
    })),
  }

  const lines = []
  lines.push(`# ${form.meta?.title || 'Onboarding Luce'}`)
  if (form.meta?.clinic) lines.push(`**Clínica:** ${form.meta.clinic}`)
  lines.push(`**Gerado em:** ${generatedAt}`)
  lines.push('')
  for (const block of form.blocks) {
    lines.push(`## ${block.title}`)
    lines.push('')
    for (const field of block.fields) {
      lines.push(`**${field.label}**`)
      lines.push(readableValue(field, answers[field.id]))
      lines.push('')
    }
  }
  const text = lines.join('\n').trim() + '\n'

  return { json, text }
}

// ---- Download de arquivo no navegador ----
export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ---- Slug seguro para nome de arquivo ----
export function slugify(str) {
  return (str || 'clinica')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
