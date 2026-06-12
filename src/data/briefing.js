// Perguntas do onboarding — transcritas FIELMENTE de
// briefing-onboarding-centrocardio-luce.md (Blocos 1 a 5 / perguntas 1–21).
//
// Formato de cada campo:
//   { id, label, type, required, help?, placeholder?, options?, allowOther?,
//     text?, approveLabel?, adjustLabel? }
//   type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'confirm'

export const form = {
  meta: {
    title: 'Onboarding · Centrocardio Sobral',
    clinic: 'Centrocardio Sobral',
    intro:
      'Vamos reunir as informações para configurar o assistente virtual de ' +
      'WhatsApp da clínica. Não é nada técnico — são informações que vocês já ' +
      'têm na ponta da língua sobre a clínica, os atendimentos e como gostam de ' +
      'atender os pacientes. Leva cerca de 30 a 40 minutos.',
    closing:
      'Obrigado! Com essas respostas conseguimos configurar o assistente para ' +
      'atender do jeito da Centrocardio. Qualquer dúvida durante o ' +
      'preenchimento, é só chamar.',
    closingNote:
      'Lembrete: a lista de pacientes para reativação será solicitada em uma ' +
      'etapa posterior, separada, com o tratamento de privacidade adequado.',
  },
  blocks: [
    // ─────────────────────────── BLOCO 1 ───────────────────────────
    {
      id: 'bloco1',
      title: 'Sobre a clínica',
      description: 'Informações gerais sobre a clínica e o funcionamento.',
      fields: [
        {
          id: 'q1_nome_clinica',
          label: 'Como vocês querem que a clínica seja chamada nas mensagens?',
          help: 'Ex.: "Centrocardio", "Clínica do Dr. Maurício".',
          type: 'text',
          required: true,
        },
        {
          id: 'q2_endereco',
          label: 'Endereço completo + um ponto de referência.',
          help: 'Ex.: "ao lado de…", "em frente a…".',
          type: 'textarea',
          required: true,
        },
        {
          id: 'q3_telefones',
          label: 'Telefone(s) de contato da clínica.',
          type: 'text',
          required: true,
        },
        {
          id: 'q4_outras_especialidades',
          label: 'Além de cardiologia, atendem outras especialidades? Quais?',
          type: 'textarea',
          required: false,
        },
        {
          id: 'q5_horario_semana',
          label: 'Horário de funcionamento — Segunda a sexta',
          help: 'Ex.: das 08:00 às 18:00.',
          type: 'text',
          required: true,
        },
        {
          id: 'q5_horario_sabado',
          label: 'Horário de funcionamento — Sábado',
          help: 'Atende? De que horas a que horas? (Se não atende, escreva "não atende".)',
          type: 'text',
          required: false,
        },
        {
          id: 'q5_horario_almoco',
          label: 'Almoço — fecha?',
          help: 'Se fecha para almoço, de que horas a que horas? (Se não fecha, escreva "não fecha".)',
          type: 'text',
          required: false,
        },
        {
          id: 'q6_estacionamento',
          label: 'Tem estacionamento? Alguma orientação de como chegar?',
          type: 'textarea',
          required: false,
        },
        {
          id: 'q7_redes',
          label: 'Têm site, Instagram ou outra rede que o assistente possa indicar?',
          type: 'textarea',
          required: false,
        },
      ],
    },

    // ─────────────────────────── BLOCO 2 ───────────────────────────
    {
      id: 'bloco2',
      title: 'Consultas, exames e procedimentos',
      description: 'O que a clínica oferece e como funcionam pagamentos e preparos.',
      fields: [
        {
          id: 'q8_atendimentos',
          label: 'Liste os tipos de atendimento que oferecem (consultas, exames, procedimentos).',
          help:
            'Para cada um, informe: nome do atendimento · duração aproximada · ' +
            'o assistente pode informar o VALOR ao paciente? (Sim / Não / "só sob consulta").',
          type: 'textarea',
          required: true,
        },
        {
          id: 'q9_convenio',
          label: 'Atendem convênio ou só particular?',
          type: 'radio',
          required: true,
          options: ['Apenas particular', 'Particular e convênios'],
        },
        {
          id: 'q9_convenio_quais',
          label: 'Se atendem convênios, quais?',
          type: 'textarea',
          required: false,
        },
        {
          id: 'q10_pagamento',
          label: 'Formas de pagamento aceitas.',
          type: 'checkbox',
          required: true,
          options: ['Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Pix'],
          allowOther: true,
        },
        {
          id: 'q11_preparo',
          label: 'Algum exame ou consulta exige preparo?',
          help:
            'Ex.: jejum, suspender medicação, trazer exames antigos, chegar mais cedo. ' +
            'Descreva qual atendimento e qual o preparo.',
          type: 'textarea',
          required: false,
        },
      ],
    },

    // ─────────────────────────── BLOCO 3 ───────────────────────────
    {
      id: 'bloco3',
      title: 'Como funciona o agendamento',
      description: 'Como vocês querem que o agendamento seja conduzido.',
      fields: [
        {
          id: 'q12_modo_agendamento',
          label:
            'O assistente pode já marcar a consulta sozinho, ou deve coletar os ' +
            'dados do paciente e passar para a secretária confirmar?',
          help: 'Essa é uma escolha importante de como vocês querem trabalhar.',
          type: 'radio',
          required: true,
          options: [
            'Pode marcar a consulta sozinho',
            'Coletar os dados e passar para a secretária confirmar',
          ],
        },
        {
          id: 'q13_antecedencia',
          label: 'Qual a antecedência mínima para marcar uma consulta?',
          type: 'text',
          required: false,
        },
        {
          id: 'q14_remarcacao',
          label:
            'Política de remarcação/cancelamento: com quanto tempo de antecedência ' +
            'o paciente precisa avisar?',
          type: 'textarea',
          required: false,
        },
        {
          id: 'q15_levar_no_dia',
          label: 'O que o paciente precisa levar no dia do atendimento?',
          type: 'checkbox',
          required: false,
          options: [
            'Documento com foto',
            'Carteirinha do convênio',
            'Exames anteriores',
          ],
          allowOther: true,
        },
      ],
    },

    // ─────────────────────────── BLOCO 4 ───────────────────────────
    {
      id: 'bloco4',
      title: 'Como o assistente deve se comportar',
      description:
        'Define a "personalidade" do assistente e, principalmente, os limites de ' +
        'segurança — porque estamos falando de uma clínica.',
      fields: [
        {
          id: 'q16_tom',
          label: 'Como vocês querem que o assistente "fale" com os pacientes?',
          type: 'radio',
          required: true,
          options: [
            'Formal e respeitoso',
            'Acolhedor e próximo',
            'Direto e objetivo',
          ],
          allowOther: true,
        },
        {
          id: 'q17_nome_assistente',
          label: 'O assistente terá um nome? Qual?',
          help: 'Ou ele se apresenta como a própria clínica.',
          type: 'text',
          required: false,
        },
        {
          id: 'q18_limites',
          label: 'Limites de segurança — confirmem com a gente.',
          type: 'confirm',
          required: true,
          text:
            'O assistente NUNCA vai dar diagnóstico, interpretar sintomas, ' +
            'recomendar remédio ou dose, nem substituir o médico. Ele apenas ' +
            'atende, informa e organiza o agendamento.',
          help: 'Vocês concordam? Há mais alguma coisa que ele nunca deve fazer ou dizer?',
          approveLabel: 'Concordamos com esses limites',
          adjustLabel: 'Queremos ajustar / acrescentar algo',
        },
        {
          id: 'q19_emergencia',
          label: 'Emergências.',
          type: 'confirm',
          required: true,
          text:
            'Se um paciente escrever que está passando mal (dor no peito, falta de ' +
            'ar, etc.), nossa sugestão é orientar o paciente a procurar o ' +
            'pronto-socorro mais próximo ou ligar 192 (SAMU) imediatamente, sem ' +
            'esperar resposta da clínica.',
          help: 'Vocês aprovam essa conduta? Querem ajustar o texto?',
          approveLabel: 'Aprovamos essa conduta',
          adjustLabel: 'Queremos ajustar o texto',
        },
        {
          id: 'q20_perguntas_frequentes',
          label:
            'Quais são as perguntas que os pacientes mais fazem e que vocês ' +
            'gostariam que o assistente já soubesse responder sozinho?',
          help: 'Liste as que vierem à cabeça — quanto mais, melhor.',
          type: 'textarea',
          required: false,
        },
      ],
    },

    // ─────────────────────────── BLOCO 5 ───────────────────────────
    {
      id: 'bloco5',
      title: 'Mensagens que a secretária costuma iniciar',
      description:
        'Momentos em que a secretária pega o WhatsApp e escreve primeiro para o ' +
        'paciente (iniciando o contato, não respondendo). Mapeamos essas situações ' +
        'para preparar os modelos de mensagem com a operadora do WhatsApp.',
      fields: [
        {
          id: 'q21_mensagens_iniciadas',
          label: 'Liste todas as situações em que a clínica inicia o contato com o paciente.',
          type: 'checkbox',
          required: true,
          options: [
            'Confirmar uma consulta marcada',
            'Lembrar da consulta na véspera',
            'Avisar sobre remarcação / mudança de horário',
            'Avisar que um resultado/exame está pronto',
            'Chamar de volta um paciente que está há tempos sem vir',
            'Pedir avaliação/feedback após o atendimento',
          ],
          allowOther: true,
        },
      ],
    },
  ],
}
