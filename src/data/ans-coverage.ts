export interface CoverageCategory {
  category: string;
  description: string;
  items: string[];
}

export const mandatoryCoverage: CoverageCategory[] = [
  {
    category: "Obstetricia",
    description: "Cobertura obrigatoria para planos com segmentacao Hospitalar com Obstetricia",
    items: [
      "Parto normal (vaginal) - cobertura integral",
      "Parto cesareo (cesariana) - cobertura integral",
      "Analgesia de parto (peridural/raquidiana) - coberta como parte do procedimento de parto",
      "Pre-natal: minimo 6 consultas de pre-natal e 2 consultas de puerperio",
      "Consulta com enfermeiro obstetrico/obstetriz",
      "Ultrassonografia obstetrica (morfologica, transvaginal, convencional)",
      "Exames laboratoriais de pre-natal: hemograma, glicemia, tipagem sanguinea, sorologias (HIV, sifilis, hepatite B, toxoplasmose, rubeola), urina tipo I, urocultura",
      "Acompanhante durante o parto: direito a 1 acompanhante de livre escolha durante pre-parto, parto e pos-parto imediato",
      "Internacao para o parto e todas as despesas hospitalares decorrentes",
      "Parto prematuro: classificado como urgencia, coberto com carencia de apenas 24 horas",
    ],
  },
  {
    category: "Exames Laboratoriais",
    description: "Exames de sangue, urina e outros com cobertura obrigatoria",
    items: [
      "Hemograma completo",
      "Glicemia de jejum",
      "Hemoglobina glicada (HbA1c)",
      "Colesterol total e fracoes (HDL, LDL, triglicerideos)",
      "Ureia e creatinina",
      "TGO/TGP (transaminases hepaticas)",
      "TSH e T4 livre (funcao tireoidiana)",
      "Acido urico",
      "PSA (antigeno prostatico especifico)",
      "Urina tipo I (EAS)",
      "Coagulograma",
      "VHS, PCR",
      "Sorologias diversas (HIV, hepatites, sifilis etc.)",
    ],
  },
  {
    category: "Exames de Imagem",
    description: "Exames de diagnostico por imagem com cobertura obrigatoria",
    items: [
      "Radiografia (todas as regioes)",
      "Ultrassonografia (abdominal, pelvica, transvaginal, obstetrica, tireoide, mamas etc.)",
      "Tomografia computadorizada",
      "Ressonancia magnetica",
      "Densitometria ossea",
      "Ecocardiograma",
      "Doppler vascular",
    ],
  },
  {
    category: "Exames Preventivos",
    description: "Rastreamento e prevencao de doencas",
    items: [
      "Mamografia (rastreamento cancer de mama, a partir dos 40 anos)",
      "Papanicolau / colpocitologia oncotica (rastreamento cancer de colo do utero)",
      "Colonoscopia (rastreamento cancer colorretal)",
      "Eletrocardiograma (ECG)",
      "Teste ergometrico / ergometria",
    ],
  },
  {
    category: "Internacoes e Cirurgias",
    description: "Cobertura hospitalar obrigatoria",
    items: [
      "Internacao hospitalar sem limite de dias, incluindo UTI/CTI",
      "Todas as cirurgias listadas no Rol ANS (mais de 3.000 procedimentos)",
      "Honorarios medicos, taxas de sala, materiais e medicamentos durante a internacao - cobertura integral",
      "Proteses e orteses ligadas ao ato cirurgico (materiais implantaveis) - cobertura obrigatoria",
      "Hemodialise",
      "Quimioterapia",
      "Radioterapia",
      "Hemoterapia",
      "Cirurgia bariatrica (com DUT especifica)",
    ],
  },
  {
    category: "Urgencia e Emergencia",
    description: "Atendimento de pronto-socorro e situacoes de risco",
    items: [
      "Atendimento de pronto-socorro 24 horas",
      "Todos os procedimentos necessarios ao atendimento de urgencia/emergencia",
      "Remocao por ambulancia (terrestre ou aerea) quando necessaria transferencia",
      "Cobertura nas primeiras 12 horas mesmo em carencia",
      "Apos 24 horas da contratacao, cobertura integral para urgencia e emergencia",
    ],
  },
  {
    category: "Oncologia",
    description: "Tratamento oncologico com cobertura integral obrigatoria",
    items: [
      "Quimioterapia - sem limite de sessoes",
      "Radioterapia - sem limite de sessoes",
      "Cirurgias oncologicas (todas as indicadas)",
      "Medicamentos antineoplasicos orais para tratamento domiciliar",
      "Imunoterapia (conforme DUTs especificas)",
      "PET-CT, cintilografia, biopsias, marcadores tumorais",
      "Reconstrucao mamaria apos mastectomia (garantida por lei)",
      "Cuidados paliativos oncologicos",
    ],
  },
  {
    category: "Saude Mental",
    description: "Cobertura psiquiatrica e psicologica obrigatoria",
    items: [
      "Consultas com psiquiatra - sem limite de quantidade",
      "Sessoes com psicologo - sem limite de quantidade (desde out/2022), mediante indicacao medica",
      "Internacao psiquiatrica (integral e hospital-dia) - minimo 30 dias/ano",
      "Tratamento de dependencia quimica (internacao minimo 30 dias/ano)",
      "TEA (Transtorno do Espectro Autista): cobertura sem limite para terapias multidisciplinares (ABA, fono, TO etc.)",
    ],
  },
  {
    category: "Terapias",
    description: "Terapias com cobertura obrigatoria (sem limite de sessoes desde out/2022)",
    items: [
      "Fisioterapia - sem limite de sessoes, mediante indicacao medica",
      "Fonoaudiologia - sem limite de sessoes, mediante indicacao medica",
      "Terapia ocupacional - sem limite de sessoes, mediante indicacao medica",
      "Nutricao - minimo 18 sessoes por ano de contrato",
      "Acupuntura - coberta quando realizada por medico",
      "RPG (Reeducacao Postural Global) - coberta como modalidade de fisioterapia",
    ],
  },
  {
    category: "Transplantes",
    description: "Transplantes com cobertura obrigatoria pela ANS",
    items: [
      "Transplante de rim (renal)",
      "Transplante de cornea",
      "Transplante de medula ossea (autologo e alogenico)",
      "Despesas pre-operatorias, cirurgia, internacao e pos-operatorio inclusos",
      "Despesas com doador vivo quando aplicavel",
    ],
  },
];

export interface WaitingPeriod {
  procedure: string;
  maxDays: number;
  description: string;
}

export const waitingPeriods: WaitingPeriod[] = [
  {
    procedure: "Urgencia e emergencia",
    maxDays: 1,
    description: "24 horas apos a contratacao",
  },
  {
    procedure: "Partos a termo",
    maxDays: 300,
    description: "300 dias (10 meses). Parto prematuro e considerado urgencia (24h)",
  },
  {
    procedure: "Consultas, exames, internacoes e cirurgias",
    maxDays: 180,
    description: "180 dias (6 meses)",
  },
  {
    procedure: "Doencas e lesoes preexistentes (CPT)",
    maxDays: 730,
    description: "24 meses (Cobertura Parcial Temporaria)",
  },
];

export const coverageExclusions = [
  "Proteses e orteses NAO ligadas ao ato cirurgico (ex: oculos, coletes ortopedicos, proteses de membros)",
  "Tratamentos experimentais ou nao reconhecidos pela ANS",
  "Procedimentos esteticos sem finalidade terapeutica",
  "Transplantes de coracao, pulmao, figado e pancreas (nao estao no Rol obrigatorio)",
  "Medicamentos imunossupressores pos-alta de transplante",
  "Tratamento em clinicas de emagrecimento ou repouso",
  "Fornecimento de medicamentos de uso domiciliar (exceto antineoplasicos orais e outros listados no Rol)",
];

export function buildCoverageSummary(): string {
  const sections = mandatoryCoverage.map((cat) => {
    return `### ${cat.category}\n${cat.items.map((i) => `- ${i}`).join("\n")}`;
  });

  const waitingSection = `### Carencias Legais (prazos MAXIMOS - Lei 9.656/98)\n${waitingPeriods.map((w) => `- ${w.procedure}: ${w.description}`).join("\n")}`;

  const exclusionsSection = `### O que o plano NAO e obrigado a cobrir\n${coverageExclusions.map((e) => `- ${e}`).join("\n")}`;

  const exemptions = `### Isencoes de Carencia\n- Planos coletivos empresariais com 30+ vidas: isencao total de carencia\n- Portabilidade de carencia: quem migra de plano aproveita carencias ja cumpridas\n- Recem-nascido: cobertura automatica nos primeiros 30 dias de vida, sem carencia, se inscrito nesse prazo`;

  return [
    ...sections,
    waitingSection,
    exclusionsSection,
    exemptions,
  ].join("\n\n");
}
