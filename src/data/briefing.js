// ⚠️ PLACEHOLDER — estrutura provisória só para o app rodar.
// As perguntas reais serão preenchidas FIELMENTE a partir de
// briefing-onboarding-centrocardio-luce.md (não inventar conteúdo).
//
// Formato de cada campo (referência):
//   { id, label, type, required, help?, placeholder?, options?, allowOther?,
//     text?, approveLabel?, adjustLabel? }
//   type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'confirm'

export const form = {
  meta: {
    title: 'Onboarding · Centrocardio Sobral',
    clinic: 'Centrocardio Sobral',
    intro:
      'Vamos configurar juntos o assistente da Luce no WhatsApp da clínica. ' +
      'São 5 etapas rápidas. (Conteúdo provisório — aguardando o briefing.)',
  },
  blocks: [
    {
      id: 'bloco1',
      title: 'Sobre a clínica',
      description: 'Aguardando perguntas do briefing.',
      fields: [
        {
          id: 'placeholder1',
          label: 'Placeholder — substituir pelas perguntas do Bloco 1',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      id: 'bloco2',
      title: 'Consultas, exames e procedimentos',
      description: 'Aguardando perguntas do briefing.',
      fields: [
        {
          id: 'placeholder2',
          label: 'Placeholder — substituir pelas perguntas do Bloco 2',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      id: 'bloco3',
      title: 'Agendamento',
      description: 'Aguardando perguntas do briefing.',
      fields: [
        {
          id: 'placeholder3',
          label: 'Placeholder — substituir pelas perguntas do Bloco 3',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      id: 'bloco4',
      title: 'Comportamento e limites do assistente',
      description: 'Aguardando perguntas do briefing.',
      fields: [
        {
          id: 'placeholder4',
          label: 'Placeholder — substituir pelas perguntas do Bloco 4',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      id: 'bloco5',
      title: 'Mensagens que a secretária inicia',
      description: 'Aguardando perguntas do briefing.',
      fields: [
        {
          id: 'placeholder5',
          label: 'Placeholder — substituir pelas perguntas do Bloco 5',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}
