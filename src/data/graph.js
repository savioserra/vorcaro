/** Grafo sementê — escopo: investigação do Banco Master (Operação Compliance Zero). */

const wiki = (file, w = 500) => {
  const parts = file.split("/");
  const name = parts.slice(2).join("/");
  const enc = encodeURIComponent(name);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${parts[0]}/${parts[1]}/${enc}/${w}px-${enc}`;
};

export const GROUPS = {
  finance: { label: "Finanças", ring: "#f59e0b", fill: "rgba(245,158,11,.15)" },
  politics: { label: "Política", ring: "#38bdf8", fill: "rgba(56,189,248,.15)" },
  church: { label: "Igreja", ring: "#a78bfa", fill: "rgba(167,139,250,.15)" },
  stf: { label: "STF", ring: "#818cf8", fill: "rgba(129,140,248,.18)" },
  family: { label: "Família (na apuração)", ring: "#fb7185", fill: "rgba(251,113,133,.15)" },
  legal: { label: "Jurídico / Estado", ring: "#94a3b8", fill: "rgba(148,163,184,.15)" },
  personal: { label: "Pessoal (na apuração)", ring: "#f472b6", fill: "rgba(244,114,182,.15)" },
  movie: { label: "Objeto (filme)", ring: "#2dd4bf", fill: "rgba(45,212,191,.15)" },
};

export const RELATIONS = {
  family: { label: "Família", color: "#fb7185" },
  personal: { label: "Pessoal", color: "#f472b6" },
  movie: { label: "Financiamento", color: "#2dd4bf" },
  church: { label: "Igreja", color: "#a78bfa" },
  politics: { label: "Política", color: "#38bdf8" },
  business: { label: "Negócios", color: "#f59e0b" },
  campaign: { label: "Logística de campanha", color: "#34d399" },
  legal: { label: "Jurídico / assessoria", color: "#94a3b8" },
  investigation: { label: "Investigação (reportado)", color: "#f87171" },
  intro: { label: "Apresentação", color: "#c084fc" },
  stf: { label: "Crise institucional", color: "#818cf8" },
};

export const PEOPLE = [
  {
    id: "daniel-vorcaro",
    since: "2016-01",
    name: "Daniel Vorcaro",
    role: "Ex-controlador do Banco Master",
    group: "finance",
    status: "Preso preventivamente (2026)",
    initials: "DV",
    photo: wiki("f/fd/Daniel_Vorcaro_-_2024_(cropped).jpg"),
    born: "6 out 1983 · Belo Horizonte",
    bio: "Acionista majoritário e presidente do Banco Master até a liquidação extrajudicial pelo BC (18/11/2025). Figura central da Operação Compliance Zero: preso em 17/11/2025 em Guarulhos, solto com cautelares em 28/11, re-preso por ordem do STF em 4/3/2026. Financiou a cinebiografia de Jair Bolsonaro, “Dark Horse”, com ao menos US$ 10 mi (R$ 61 mi+) enviados a um fundo nos EUA — repasses hoje no centro da apuração contra Flávio Bolsonaro. Em 8/9/2026, a CVM o condenou por unanimidade no caso Brazil Realty FII — multa pessoal de R$ 20 mi; o banco foi sancionado em R$ 12,5 bi, segundo Metrópoles. A PF aponta que ele sabia da operação e teria planejado a fuga um dia antes da 1ª prisão.",
    contacts: [
      { label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/daniel-vorcaro-3b150664" },
    ],
    notes: "A defesa nega a tese de fraude; não há condenação criminal transitada em julgado.",
    x: 380,
    y: 280,
  },
  {
    id: "nikolas-ferreira",
    since: "2020-01",
    name: "Nikolas Ferreira",
    role: "Deputado federal PL–MG",
    group: "politics",
    status: "No cargo · citado em vazamentos",
    initials: "NF",
    photo: wiki("d/d8/Nikolas_Ferreira_in_2023_(cropped).jpg"),
    born: "30 mai 1996 · Belo Horizonte",
    bio: "Deputado mais votado do Brasil em 2022. Entrou no caso Master via material apreendido do celular de Vorcaro: áudio de mar/2025 pedindo ajuda ao banqueiro e alegação de que ele teria bancado voos da campanha 2022. Admite os contatos e os voos; nega ter recebido dinheiro ou se encontrado com Vorcaro. Em 8–10/9/2026, divulgou suposto relatório da PF — considerado falso e criado com IA.",
    contacts: [
      { label: "E-mail (Câmara)", url: "mailto:dep.nikolasferreira@camara.leg.br", text: "dep.nikolasferreira@camara.leg.br" },
      { label: "Telefone", text: "(61) 3215-5743" },
      { label: "Instagram", url: "https://www.instagram.com/nikolasferreiradm/" },
      { label: "X", url: "https://x.com/nikolas_dm" },
      { label: "Câmara", url: "https://www.camara.leg.br/deputados/209787" },
    ],
    x: 1200,
    y: 320,
  },
  {
    id: "andre-valadao",
    since: "2024-06",
    name: "André Valadão",
    role: "Pastor · Lagoinha / Diante do Trono",
    group: "church",
    status: "Confirmou a apresentação",
    initials: "AV",
    photo: wiki("d/d5/Andre_Machado_Valadão_do_Diante_do_Trono_(cropped).jpg"),
    bio: "Confirmou publicamente que levou a queixa de Vorcaro a Nikolas Ferreira e apresentou os dois, após crítica de Nikolas a evento patrocinado pelo Master. Nega qualquer envolvimento com o banco.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/André_Valadão" }],
    x: 900,
    y: 340,
  },
  {
    id: "marcio-valadao",
    since: "2025-11",
    name: "Márcio Valadão",
    role: "Pastor fundador da Lagoinha",
    group: "church",
    status: "Amigo pessoal de Vorcaro",
    initials: "MV",
    bio: "Pastor fundador da Lagoinha e pai de André. Segundo a InfoMoney, é amigo pessoal de Vorcaro, que frequentava a igreja — porta de entrada do banqueiro na política evangélica.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Márcio_Valadão" }],
    x: 900,
    y: 140,
  },
  {
    id: "guilherme-batista",
    since: "2022-10",
    name: "Guilherme Batista",
    role: "Pastor · Lagoinha",
    group: "church",
    status: "Citado na pauta dos voos",
    initials: "GB",
    bio: "Co-liderou com Nikolas a caravana “Juventude pelo Brasil” (2022), que percorreu capitais no jato ligado a Vorcaro — origem das alegações de voos bancados.",
    x: 900,
    y: 540,
  },
  {
    id: "henrique-vorcaro",
    since: "2026-01",
    name: "Henrique Vorcaro",
    role: "Pai · fundador da Multipar",
    group: "family",
    status: "Preso (6ª fase, mai/2026)",
    initials: "HV",
    bio: "Pai de Daniel e fundador do grupo construtor Multipar. Preso em 14/5/2026 na 6ª fase da Compliance Zero; a PF aponta que ele demandava e pagava serviços de núcleos de coação e vazamento de informações.",
    contacts: [{ label: "G1 · quem é Henrique", url: "https://g1.globo.com/mg/minas-gerais/noticia/2026/05/14/quem-e-henrique-vorcaro-pai-de-daniel-vorcaro-do-banco-master.ghtml" }],
    x: 80,
    y: 220,
  },
  {
    id: "natalia-vorcaro",
    since: "2026-01",
    name: "Natalia Vorcaro Zettel",
    role: "Irmã · pastora",
    group: "family",
    status: "Alvo de buscas (2ª fase)",
    initials: "NV",
    bio: "Irmã de Daniel, pastora de filial da Lagoinha em BH. Os endereços dela figuraram entre os alvos de busca da 2ª fase (14/1/2026), junto com pai e cunhado.",
    x: 80,
    y: 420,
  },
  {
    id: "fabiano-zettel",
    since: "2026-01",
    name: "Fabiano Zettel",
    role: "Cunhado · advogado, fundo Moriah",
    group: "family",
    status: "Alvo de buscas (2ª fase)",
    initials: "FZ",
    bio: "Marido de Natalia; advogado e pastor, responsável pelo fundo Moriah. Também foi alvo de buscas na 2ª fase da operação.",
    x: 80,
    y: 560,
  },
  {
    id: "fabiola-macedo",
    since: "2026-03",
    name: "Fabíola de Almeida Macedo",
    role: "Esposa · sócia da Viking",
    group: "family",
    status: "Viking sob cerco judicial",
    initials: "FM",
    bio: "Esposa de Daniel (InfoMoney) e, segundo registros societários, sócia da Viking Participações — holding dona dos jatos que a liquidante do banco tenta bloquear judicialmente, frente patrimonial do caso.",
    contacts: [{ label: "Registro CNPJ Viking", url: "https://maiscnpj.com.br/cnpj/07875796000175-viking-participacoes-ltda" }],
    x: 80,
    y: 700,
  },
  {
    id: "martha-graeff",
    since: "2026-03",
    name: "Martha Graeff",
    role: "Influenciadora · ex-noiva",
    group: "personal",
    status: "Citada em tese de ocultação",
    initials: "MG",
    bio: "Reportagem do Estadão (com material da CPMI/Receita) aponta repasse de mais de R$ 520 mi a ela via trust nos EUA, incluindo mansão em Bay Point (Miami) comprada por US$ 86,5 mi — peça da tese de ocultação de patrimônio. A defesa dela nega receber bens ou constituir trust para Vorcaro.",
    contacts: [{ label: "O Globo · o relato dela", url: "https://oglobo.globo.com/politica/noticia/2026/04/09/martha-graeff-saiba-quem-e-a-ex-noiva-de-vorcaro-que-diz-ter-sido-arrastada-para-um-lamacal.ghtml" }],
    x: 380,
    y: 40,
  },
  {
    id: "thiago-faria",
    since: "2025-03",
    name: "Thiago Rodrigues de Faria",
    role: "Advogado · ex-assessor de Nikolas",
    group: "legal",
    status: "Citado no áudio (mar/2025)",
    initials: "TF",
    bio: "O “advogado, irmão” que Nikolas encaminhou a Vorcaro para destravar um ativo minerário. Nikolas diz que o negócio morreu após a repercussão do Master; nenhuma irregularidade foi apontada na conversa.",
    x: 1200,
    y: 560,
  },
  {
    id: "flavio-carneiro",
    since: "2024-04",
    name: "Flávio Carneiro",
    role: "Empresário · destinatário do chat",
    group: "finance",
    status: "Citado em material da PF",
    initials: "FC",
    bio: "Recebeu, em abr/2024, as mensagens em que Vorcaro afirma ter bancado “todos os voos” de Nikolas e sugere expor o deputado; Carneiro pedia que Nikolas parasse de atacar.",
    x: 700,
    y: 80,
  },
  {
    id: "michel-temer",
    since: "2024-12",
    name: "Michel Temer",
    role: "Ex-presidente · assessoria (reportado)",
    group: "legal",
    status: "Atuou na tentativa BRB",
    initials: "MT",
    photo: wiki("b/bd/Michel_Temer_(foto_oficial)_(cropped_2).jpg"),
    bio: "Sob pressão do BC na tentativa de venda do Master ao BRB (2024–25), Vorcaro recrutou Temer para atuar em favor de seus interesses, segundo reportagens compiladas pela Wikipédia.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Michel_Temer" }],
    x: 600,
    y: 280,
  },
  {
    id: "ricardo-lewandowski",
    since: "2024-12",
    name: "Ricardo Lewandowski",
    role: "Ex-presidente do STF · consultor",
    group: "legal",
    status: "Consultor no episódio BRB",
    initials: "RL",
    photo: wiki("c/c3/Ricardo_Lewandowski_2011.jpg"),
    bio: "Atuou como consultor de Vorcaro na tentativa de venda do Master ao BRB, conforme apontado em reportagens compiladas pela Wikipédia.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Ricardo_Lewandowski" }],
    x: 600,
    y: 430,
  },
  {
    id: "roberto-campos-neto",
    since: "2024-12",
    name: "Roberto Campos Neto",
    role: "Presidente do BC à época",
    group: "legal",
    status: "Reunião de emergência (dez/2024)",
    initials: "RC",
    photo: wiki("9/91/Roberto_Campos_Neto_(cropped).jpg"),
    bio: "Convocou Vorcaro a reunião de emergência em dez/2024 e exigiu aporte de capital à medida que o rombo de liquidez do Master crescia (piauí). O BC depois vetou a venda ao BRB (set/2025) e decretou a liquidação (18/11/2025).",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Roberto_Campos_Neto" }],
    x: 600,
    y: 820,
  },
  {
    id: "ciro-nogueira",
    since: "2024-08",
    name: "Ciro Nogueira",
    role: "Senador PP–PI",
    group: "politics",
    status: "Autor da “emenda Master”",
    initials: "CN",
    photo: wiki("3/3b/Senador_Ciro_Nogueira_foto_oficial_2.jpg"),
    bio: "Vorcaro compareceu ao casamento da filha dele (Angra dos Reis, 3/8/2024) — a bordo de iate, segundo a Bloomberg. Dez dias depois, o senador apresentou a proposta apelidada de “emenda Master”, conforme documentos da CPMI do INSS.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Ciro_Nogueira_Lima_Filho" }],
    x: 600,
    y: 160,
  },
  {
    id: "nelson-tanure",
    since: "2021-12",
    name: "Nelson Tanure",
    role: "Empresário · sócio de Vorcaro",
    group: "finance",
    status: "Alvo de buscas (2ª fase)",
    initials: "NT",
    bio: "Sócio de Vorcaro em takeovers (Alliar etc.). Foi localizado pela PF no Galeão durante as buscas da 2ª fase (14/1/2026); investigadores também apuraram possível vazamento sobre a operação.",
    x: 400,
    y: 860,
  },
  {
    id: "alexandre-de-moraes",
    since: "2025-11",
    name: "Alexandre de Moraes",
    role: "Ministro do STF",
    group: "stf",
    status: "Mensagens atribuídas a ele (contestado)",
    initials: "AM",
    photo: wiki("c/c4/Ministro_Alexandre_de_Moraes_como_presidente_do_TSE.jpg"),
    bio: "Segundo a PF, Vorcaro enviou ao menos 28 mensagens a um número atribuído a ele na semana da 1ª prisão; Moraes teria respondido com 4 mensagens de visualização única no próprio dia da prisão (17/11/2025). A atribuição é contestada pelo ministro. A oposição pediu a sua prisão; o episódio abriu a crise ética-institucional no STF.",
    contacts: [
      { label: "G1 · 28 mensagens", url: "https://g1.globo.com/politica/noticia/2026/09/01/pf-aponta-que-vorcaro-mandou-mensagens-a-telefone-atribuido-a-moraes-na-semana-em-que-foi-preso.ghtml" },
      { label: "Wikipédia · caso no STF", url: "https://pt.wikipedia.org/wiki/Caso_Master_no_Supremo_Tribunal_Federal" },
    ],
    x: 950,
    y: 760,
  },
  {
    id: "andre-mendonca",
    since: "2026-03",
    name: "André Mendonça",
    role: "Ministro do STF · relator do caso",
    group: "stf",
    status: "Relator · no centro da crise",
    initials: "AM2",
    photo: wiki("d/de/Ministro_André_Mendonça_em_outubro_de_2025_(3x4).jpg"),
    bio: "Relator da Compliance Zero no STF. Decretou a segunda prisão de Vorcaro (4/3/2026), autorizou suas transferências de cela e, em 8–9/9/2026, determinou a quebra de sigilo do relatório da PF sobre as mensagens com Moraes — ato que deflagrou a crise institucional. Ex-ministro da Justiça e ex-AGU no governo Bolsonaro; pastor presbiteriano.",
    contacts: [
      { label: "CNN · 10 revelações", url: "https://www.cnnbrasil.com.br/politica/caso-banco-master-veja-10-revelacoes-apos-nova-prisao-de-vorcaro/" },
      { label: "Wikipédia · caso no STF", url: "https://pt.wikipedia.org/wiki/Caso_Master_no_Supremo_Tribunal_Federal" },
    ],
    x: 1100,
    y: 760,
  },
  {
    id: "dias-toffoli",
    since: "2025-12",
    name: "Dias Toffoli",
    role: "Ministro do STF",
    group: "stf",
    status: "Sigilo ao pedido da defesa (dez/2025)",
    initials: "DT",
    bio: "Em 2/12/2025 determinou sigilo máximo sobre o pedido apresentado pela defesa de Vorcaro no STF, conforme registro da Wikipédia com fontes.",
    contacts: [{ label: "Wikipédia · Vorcaro", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" }],
    x: 1250,
    y: 620,
  },
  {
    id: "edson-fachin",
    since: "2026-09",
    name: "Edson Fachin",
    role: "Ministro do STF · presidente da Corte",
    group: "stf",
    status: "Prazo de 24h sobre sigilo (set/2026)",
    initials: "EF",
    bio: "Presidente do STF. Em 9/9/2026 deu 24 horas para que Mendonça retirasse o sigilo total imposto à operação Compliance Zero e cancelou a sessão plenária da semana em meio à crise.",
    contacts: [
      { label: "Exame · prazo de 24h", url: "https://exame.com/brasil/fachin-da-24h-para-que-mendonca-retire-sigilo-total-da-operacao-compliance-zero/" },
    ],
    x: 1400,
    y: 700,
  },
  {
    id: "gilmar-mendes",
    since: "2026-09",
    name: "Gilmar Mendes",
    role: "Ministro do STF",
    group: "stf",
    status: "Proposta de reforma regimental",
    initials: "GM",
    bio: "Propôs ao presidente Fachin (3/9) e formalizou (5/9) mudança no regimento para proibir delegados da PF — e militares — de trabalharem em gabinetes de ministros do STF, no bojo da crise do caso Master.",
    contacts: [
      { label: "G1 · proposta", url: "https://g1.globo.com/politica/blog/valdo-cruz/post/2026/09/03/gilmar-propoe-a-fachin-proibir-delegados-da-pf-como-funcionarios-de-gabinetes-de-ministros-do-stf.ghtml" },
      { label: "O Globo · regimento", url: "https://oglobo.globo.com/politica/noticia/2026/09/05/em-meio-a-crise-do-caso-master-gilmar-mendes-propoe-mudar-regimento-do-stf-para-retirar-delegados-da-pf-e-militares-de-gabinetes-do-supremo.ghtml" },
    ],
    x: 1550,
    y: 560,
  },
  {
    id: "andrei-rodrigues",
    since: "2026-09",
    name: "Andrei Rodrigues",
    role: "Diretor-geral da Polícia Federal",
    group: "legal",
    status: "Afastado por Mendonça (set/2026)",
    initials: "AR",
    bio: "Diretor-geral da PF durante a Compliance Zero. Foi afastado por Mendonça em meio à crise deflagrada pelo vazamento do relatório sobre as mensagens Moraes–Vorcaro, segundo a CNN.",
    contacts: [
      { label: "CNN · crise no STF", url: "https://www.cnnbrasil.com.br/politica/relacao-moraes-vorcaro-mendonca-afasta-andrei-tudo-sobre-a-crise-no-stf/" },
    ],
    x: 1100,
    y: 920,
  },
  {
    id: "jair-bolsonaro",
    since: "2022-10",
    name: "Jair Bolsonaro",
    role: "Ex-presidente",
    group: "politics",
    status: "Beneficiário da caravana 2022",
    initials: "JB",
    photo: wiki("8/8a/Jair_Bolsonaro_em_24_de_abril_de_2019_(1)_(cropped).jpg"),
    bio: "A caravana “Juventude pelo Brasil”, feita no jato ligado a Vorcaro, percorreu capitais do Nordeste para impulsionar a sua reeleição no 2º turno de 2022 — elo indireto entre o banqueiro e o núcleo bolsonarista que o caso expôs.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Jair_Bolsonaro" }],
    x: 1450,
    y: 120,
  },
  {
    id: "eduardo-bolsonaro",
    since: "2020-10",
    name: "Eduardo Bolsonaro",
    role: "Deputado federal",
    group: "politics",
    status: "Apoiador inicial de Nikolas",
    initials: "EB",
    photo: wiki("5/52/Eduardo_Bolsonaro_by_Gage_Skidmore.jpg"),
    bio: "Apoiou publicamente a candidatura de Nikolas a vereador de BH em 2020 (O Globo/Sonár). Parte da rede bolsonarista com a qual Vorcaro se aproximou, segundo o Estadão. Segundo a PF, orientou Vorcaro sobre como gerir os recursos do financiamento de “Dark Horse”, enviados a fundo no Texas.",
    contacts: [{ label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Eduardo_Bolsonaro" }],
    x: 1650,
    y: 200,
  },
  {
    id: "flavio-bolsonaro",
    since: "2025-01",
    name: "Flávio Bolsonaro",
    role: "Senador PL–RJ · pré-candidato",
    group: "politics",
    status: "Sob investigação (corrupção/lavagem)",
    initials: "FB",
    photo: wiki("b/b3/Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_(v._AgSen)_(3x4).jpg"),
    bio: "Filho mais velho de Jair. Segundo o Intercept (mai/2026), pediu a Vorcaro US$ 24 mi (R$ 134 mi) para financiar “Dark Horse” e cobrou parcelas atrasadas — 8 dias após uma cobrança, veio novo repasse (Coaf). Mendonça autorizou investigação contra ele por corrupção, lavagem de dinheiro e evasão de divisas; a PF apura o caso.",
    contacts: [
      { label: "G1 · 5 pontos do Dark Horse", url: "https://g1.globo.com/politica/noticia/2026/09/11/flavio-bolsonaro-e-investigado-5-pontos-que-a-pf-quer-esclarecer-sobre-o-financiamento-de-dark-horse.ghtml" },
      { label: "BBC · o que ele precisa explicar", url: "https://www.bbc.com/portuguese/articles/cy9zvqle2r0o" },
    ],
    x: 1500,
    y: 40,
  },
  {
    id: "mineiro",
    since: "2025-01",
    name: "Antônio Carlos Freixo Júnior (“Mineiro”)",
    role: "Operador financeiro · Entre Investimentos",
    group: "finance",
    status: "Delação homologada (9/9/2026)",
    initials: "MI",
    bio: "Operador de Vorcaro à frente da Entre Investimentos. Na delação homologada por Mendonça, detalhou US$ 12,333 mi em 7 transferências (jan–set/2025) para o fundo do filme “Dark Horse”, além de malas de dinheiro vivo e repasses nas Bahamas.",
    contacts: [
      { label: "G1 · o que se sabe da delação", url: "https://g1.globo.com/politica/noticia/2026/09/09/recursos-para-dark-horse-malas-para-dinheiro-vivo-e-repasses-nas-bahamas-o-que-se-sabe-da-delacao-de-empresario-ligado-a-vorcaro.ghtml" },
      { label: "Poder360 · homologação", url: "https://www.poder360.com.br/poder-justica/dark-horse-mendonca-homologa-delacao-sobre-repasses-de-vorcaro/" },
    ],
    x: 700,
    y: 620,
  },
  {
    id: "dark-horse",
    since: "2025-01",
    name: "Dark Horse (filme)",
    role: "Cinebiografia de Jair Bolsonaro",
    group: "movie",
    kind: "movie",
    status: "Objeto de investigação",
    initials: "DH",
    bio: "Cinebiografia de Jair Bolsonaro (com Jim Caviezel no elenco). Recebeu ao menos US$ 10 mi (R$ 61 mi+) de Vorcaro via fundo Havengate Development (Texas/EUA); o Coaf registra nova parcela de US$ 1,67 mi em 16/9/2025. A PF suspeita da finalidade real da operação — projeção de bilheteria de até R$ 100 mi — e investiga corrupção, lavagem e evasão de divisas.",
    contacts: [
      { label: "G1 · o que se sabe do filme", url: "https://g1.globo.com/pop-arte/cinema/noticia/2026/05/13/dark-horse-o-que-se-sabe-sobre-cinebiografia-de-bolsonaro-para-a-qual-flavio-bolsonaro-pediu-dinheiro-a-vorcaro.ghtml" },
      { label: "Intercept · planilha e recibo", url: "https://www.intercept.com.br/2026/06/09/planilha-comprovante-bancario-vorcaro-dinheiro-eua-ar-dark-horse/" },
    ],
    x: 1350,
    y: 40,
  },
];

export const LINKS = [
  {
    source: "daniel-vorcaro", target: "henrique-vorcaro", kind: "family", label: "pai · preso",
    when: "2026-01",
    why: "Henrique é pai de Daniel e fundador da Multipar. Preso em 14/5/2026 (6ª fase da Compliance Zero); a PF aponta que ele demandava e pagava serviços de núcleos de coação e vazamento. Cerca de R$ 2,2 bi chegaram a ser ocultados na conta dele em jan/2026 e foram bloqueados pela Justiça.",
    evidence: [
      { label: "G1 · quem é Henrique Vorcaro", url: "https://g1.globo.com/mg/minas-gerais/noticia/2026/05/14/quem-e-henrique-vorcaro-pai-de-daniel-vorcaro-do-banco-master.ghtml" },
      { label: "Wikipédia · fases e bloqueios", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "natalia-vorcaro", kind: "family", label: "irmã · alvo de buscas",
    when: "2026-01",
    why: "Natalia é irmã de Daniel e pastora de filial da Lagoinha. Os endereços dela foram alvo de buscas na 2ª fase da operação (14/1/2026), que atingiu pai, irmã e cunhado do banqueiro.",
    evidence: [
      { label: "Wikipédia · 2ª fase", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
      { label: "InfoMoney · família", url: "https://www.infomoney.com.br/business/quem-e-daniel-vorcaro-dono-do-banco-master-que-foi-preso-pela-pf/" },
    ],
  },
  {
    source: "natalia-vorcaro", target: "fabiano-zettel", kind: "family", label: "esposos",
    when: "2026-01",
    why: "Zettel é marido de Natalia — advogado-pastor à frente do fundo Moriah. Também foi alvo das buscas da 2ª fase da Compliance Zero, junto com a mulher e o sogro.",
    evidence: [
      { label: "InfoMoney · família", url: "https://www.infomoney.com.br/business/quem-e-daniel-vorcaro-dono-do-banco-master-que-foi-preso-pela-pf/" },
      { label: "Wikipédia · 2ª fase", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "henrique-vorcaro", target: "natalia-vorcaro", kind: "family", label: "pai e filha",
    when: "2026-01",
    why: "Pai e filha do mesmo núcleo familiar; ambos viraram alvos da operação (prisão dele na 6ª fase, buscas na casa dela na 2ª).",
    evidence: [
      { label: "G1 · prisão de Henrique", url: "https://g1.globo.com/mg/minas-gerais/noticia/2026/05/14/quem-e-henrique-vorcaro-pai-de-daniel-vorcaro-do-banco-master.ghtml" },
      { label: "Wikipédia · 2ª fase", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "fabiola-macedo", kind: "family", label: "esposa · sócia da Viking",
    when: "2026-03",
    why: "Fabíola é esposa de Daniel e, pelos registros societários, sócia da Viking Participações — holding dona dos jatos particulares que a liquidante do banco pediu em juízo para bloquear, frente patrimonial da investigação.",
    evidence: [
      { label: "Metrópoles · jatos da Viking na Justiça", url: "https://www.metropoles.com/sao-paulo/firma-jatos-vorcaro" },
      { label: "Registro CNPJ Viking", url: "https://maiscnpj.com.br/cnpj/07875796000175-viking-participacoes-ltda" },
      { label: "InfoMoney · esposa", url: "https://www.infomoney.com.br/business/quem-e-daniel-vorcaro-dono-do-banco-master-que-foi-preso-pela-pf/" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "martha-graeff", kind: "personal", label: "trust nos EUA (negado)",
    when: "2026-03",
    why: "O Estadão apontou, com material da CPMI/Receita, repasse de mais de R$ 520 mi a Graeff via trust nos EUA — incluindo mansão em Bay Point (Miami) por US$ 86,5 mi, um Rolls-Royce Cullinan e outros veículos — como parte da tese de ocultação de patrimônio. A defesa dela nega que ela tenha recebido bens ou constituído trust para Vorcaro.",
    evidence: [
      { label: "Wikipédia · repasses", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
      { label: "Metrópoles · negativa da defesa", url: "https://www.metropoles.com/brasil/martha-graeff-ex-de-vorcaro-nega-ter-ocultado-bens-do-banqueiro-nos-eua" },
      { label: "O Globo · relato dela", url: "https://oglobo.globo.com/politica/noticia/2026/04/09/martha-graeff-saiba-quem-e-a-ex-noiva-de-vorcaro-que-diz-ter-sido-arrastada-para-um-lamacal.ghtml" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "nelson-tanure", kind: "business", label: "sócios · alvo de buscas",
    when: "2021-12",
    why: "Tanure foi parceiro de Vorcaro em takeovers (Alliar e outros). Na 2ª fase (14/1/2026) foi localizado pela PF no Galeão durante as buscas; apurou-se também possível vazamento sobre a operação após o cunhado de Vorcaro ser encontrado em Guarulhos.",
    evidence: [
      { label: "Brazil Journal · sociedades", url: "https://braziljournal.com/no-master-um-outsider-comeca-a-fazer-barulho/" },
      { label: "Wikipédia · 2ª fase", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "michel-temer", kind: "legal", label: "assessoria na tentativa BRB",
    when: "2024-12",
    why: "Com o BC exigindo capital e a venda do Master ao BRB em negociação (2024–25), Vorcaro recrutou o ex-presidente Temer para atuar em favor de seus interesses. O BC vetou a operação em set/2025.",
    evidence: [{ label: "Wikipédia · investigações", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" }],
  },
  {
    source: "daniel-vorcaro", target: "ricardo-lewandowski", kind: "legal", label: "consultor no episódio BRB",
    when: "2024-12",
    why: "O ex-presidente do STF Lewandowski atuou como consultor de Vorcaro durante a tentativa de venda do Master ao BRB — parte do escudo jurídico-político montado com a aproximação dos reguladores.",
    evidence: [{ label: "Wikipédia · investigações", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" }],
  },
  {
    source: "daniel-vorcaro", target: "roberto-campos-neto", kind: "legal", label: "aperto do BC · dez/2024",
    when: "2024-12",
    why: "Em dez/2024 o presidente do BC convocou Vorcaro a reunião de emergência e exigiu aporte de capital diante do rombo de liquidez. Meses depois o BC vetou a venda ao BRB (set/2025) e decretou a liquidação extrajudicial (18/11/2025).",
    evidence: [
      { label: "piauí · Alta tensão", url: "https://piaui.uol.com.br/revista/217/alta-tensao-banco-master/" },
      { label: "Wikipédia", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "ciro-nogueira", kind: "politics", label: "“emenda Master”",
    when: "2024-08",
    why: "Vorcaro compareceu ao casamento da filha do senador em Angra dos Reis (3/8/2024) — a bordo de iate, segundo a Bloomberg. Documentos da CPMI do INSS mostram que dez dias depois Nogueira apresentou a proposta batizada de “emenda Master”. Ambos negam irregularidade; a relação é peça do tabuleiro político do caso.",
    evidence: [
      { label: "Bloomberg · dossiê do caso", url: "https://www.bloomberg.com/graphics/2026-banco-master-fraud-case/" },
      { label: "Wikipédia · CPMI", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "flavio-carneiro", kind: "investigation", label: "“banquei todos os voos”",
    when: "2024-04",
    why: "Em abr/2024, Vorcaro escreveu ao empresário Flávio Carneiro: “Esse Nikolas eu banquei todos os voos dele”, e sugeriu expor o deputado; Carneiro pedia que fizesse Nikolas parar de atacar. O diálogo saiu de material apreendido pela PF (ICL Notícias; confirmado por O Globo e EM).",
    evidence: [
      { label: "EM.com · o chat", url: "https://www.em.com.br/politica/2026/09/7492959-vorcaro-diz-ter-bancado-todos-os-voos-de-nikolas-ferreira.html" },
      { label: "G1 · áudios", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "andre-valadao", kind: "church", label: "órbita Lagoinha",
    when: "2025-11",
    why: "Os dois circulam na órbita da Lagoinha — rede que ligou Vorcaro à política evangélica. Valadão confirmou que repassou a queixa do banqueiro a Nikolas e fez a ponte entre os dois; nega qualquer envolvimento com o Master.",
    evidence: [
      { label: "O Globo · Valadão confirma", url: "https://oglobo.globo.com/politica/noticia/2026/09/04/andre-valadao-confirma-que-aproximou-nikolas-de-vorcaro-mas-nega-envolvimento-com-banco-master.ghtml" },
      { label: "G1 · vínculos com a Lagoinha", url: "https://g1.globo.com/mg/minas-gerais/noticia/2025/11/19/antes-de-virar-banqueiro-daniel-vorcaro-apresentou-programa-de-musica-gospel-de-igreja-de-bh.ghtml" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "marcio-valadao", kind: "church", label: "amizade pessoal",
    when: "2025-11",
    why: "InfoMoney: sem ser religioso, Vorcaro frequentava a Lagoinha e é amigo pessoal do pastor Márcio Valadão — relação que enraizou o banqueiro na rede política da igreja.",
    evidence: [{ label: "InfoMoney · perfil", url: "https://www.infomoney.com.br/business/quem-e-daniel-vorcaro-dono-do-banco-master-que-foi-preso-pela-pf/" }],
  },
  {
    source: "marcio-valadao", target: "andre-valadao", kind: "family", label: "pai e filho",
    when: "2024-06",
    why: "André é filho de Márcio Valadão; os dois são figuras centrais da Lagoinha e do Diante do Trono, em Belo Horizonte — a igreja no cruzamento entre Vorcaro e Nikolas.",
    evidence: [{ label: "Wikipédia · André Valadão", url: "https://pt.wikipedia.org/wiki/André_Valadão" }],
  },
  {
    source: "andre-valadao", target: "nikolas-ferreira", kind: "intro", label: "fez a apresentação",
    when: "2024-06",
    why: "Após Nikolas criticar evento patrocinado pelo Master em Londres (2024), Valadão repassou a queixa de Vorcaro e colocou o deputado em contato direto com o banqueiro — confirmação dele próprio ao O Globo (4/9/2026), negando envolvimento com o banco.",
    evidence: [{ label: "O Globo · 4 set 2026", url: "https://oglobo.globo.com/politica/noticia/2026/09/04/andre-valadao-confirma-que-aproximou-nikolas-de-vorcaro-mas-nega-envolvimento-com-banco-master.ghtml" }],
  },
  {
    source: "nikolas-ferreira", target: "daniel-vorcaro", kind: "investigation", label: "áudio mar/2025 · voos · doc. falso",
    when: "2022-10",
    why: "Material do celular de Vorcaro (vazado pelo ICL; confirmado por G1/O Globo) mostra áudio de 30/3/2025 em que Nikolas chama o banqueiro de “Dani”, diz querer “mais proximidade” e pede ajuda para liberar um ativo minerário de um ex-assessor. Em chats de abr/2024, Vorcaro afirma ter bancado “todos os voos” de Nikolas. Em 8–10/9/2026, Nikolas divulgou suposto relatório da PF dizendo não ver crime nas conversas — apontado como falso, criado com IA. Ele admite os contatos e os voos; nega encontro e recebimento de dinheiro.",
    evidence: [
      { label: "G1 · pedidos confirmados", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
      { label: "O Globo · áudios", url: "https://oglobo.globo.com/politica/noticia/2026/09/03/nikolas-pediu-ajuda-a-vorcaro-e-disse-querer-mais-proximidade-mostram-audios-obtidos-pela-pf.ghtml" },
      { label: "G1 · doc. falso é fake (10/9)", url: "https://g1.globo.com/fato-ou-fake/noticia/2026/09/10/e-fake-foto-de-relatorio-da-pf-dizendo-nao-ver-crime-em-conversas-de-nikolas-ferreira-com-vorcaro-imagem-foi-criada-com-ia.ghtml" },
      { label: "UOL Comprova · desinformação", url: "https://noticias.uol.com.br/comprova/ultimas-noticias/2026/09/08/desinformacao-falso-ia-documento-pf-nikolas-ferreira-vorcaro.ghtm" },
      { label: "O Tempo · admite voos", url: "https://www.otempo.com.br/politica/2026/9/3/nikolas-ferreira-admite-voos-bancados-por-vorcaro-mas-nega-relacao-pessoal-em-resposta-a-vazamento" },
    ],
  },
  {
    source: "nikolas-ferreira", target: "guilherme-batista", kind: "campaign", label: "co-líderes da caravana",
    when: "2022-10",
    why: "A caravana “Juventude pelo Brasil”, pelo 2º turno de 2022, foi liderada por Nikolas com o pastor da Lagoinha Guilherme Batista — o tour no centro das alegações de voos bancados por Vorcaro.",
    evidence: [
      { label: "Revista Fórum · caravana", url: "https://revistaforum.com.br/politica/vorcaro-mensagem-bancado-voos-nikolas-ferreira/" },
      { label: "G1 · áudios e caravana", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
    ],
  },
  {
    source: "guilherme-batista", target: "daniel-vorcaro", kind: "campaign", label: "jato ligado a Vorcaro",
    when: "2022-10",
    why: "A caravana percorreu nove capitais do Nordeste (20–28/10/2022) em jato ligado a Vorcaro; a coluna de Malu Gaspar (O Globo) registrou uso da aeronave também em Minas Gerais naquele mês. Nikolas diz que só depois soube de quem era o avião.",
    evidence: [
      { label: "G1 · áudios e caravana", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
      { label: "O Globo · uso do jato", url: "https://oglobo.globo.com/politica/noticia/2026/09/03/nikolas-pediu-ajuda-a-vorcaro-e-disse-querer-mais-proximidade-mostram-audios-obtidos-pela-pf.ghtml" },
    ],
  },
  {
    source: "nikolas-ferreira", target: "thiago-faria", kind: "legal", label: "“meu advogado, irmão”",
    when: "2025-03",
    why: "No áudio vazado, Nikolas apresenta Thiago como amigo próximo e advogado (“meu advogado, enfim, irmão meu”) e repassa o contato a Vorcaro. A Veja identifica Thiago Rodrigues de Faria como ex-assessor de gabinete do deputado.",
    evidence: [
      { label: "G1 · ex-assessor", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
      { label: "Veja · ativo minerário", url: "https://veja.abril.com.br/coluna/faria-lima-news/o-que-nikolas-ferreira-pediu-a-daniel-vorcaro-do-banco-master/" },
    ],
  },
  {
    source: "thiago-faria", target: "daniel-vorcaro", kind: "intro", label: "pedido de ativo minerário",
    when: "2025-03",
    why: "A apresentação buscava a ajuda de Vorcaro para liberar um ativo de minério ligado a Faria (contato repassado em 30/3/2025; encontro em Brasília sugerido para 1/4). Nikolas diz que o negócio morreu com a repercussão negativa do Master; nenhuma irregularidade foi apontada na conversa.",
    evidence: [
      { label: "Veja", url: "https://veja.abril.com.br/coluna/faria-lima-news/o-que-nikolas-ferreira-pediu-a-daniel-vorcaro-do-banco-master/" },
      { label: "UOL", url: "https://noticias.uol.com.br/politica/ultimas-noticias/2026/09/03/nikolas-ferreira-audio-daniel-vorcaro.ghtml" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "alexandre-de-moraes", kind: "investigation", label: "28 mensagens · atribuição contestada",
    when: "2025-11",
    why: "A PF aponta que Vorcaro enviou ao menos 28 mensagens a um número atribuído a Moraes na semana da 1ª prisão — incluindo “Estamos juntos sempre. Você sabe que tenho gratidão da minha vida a você” (14/11/2025). Moraes teria mandado 4 mensagens de visualização única no próprio dia da prisão. A atribuição é contestada; a oposição pediu a prisão do ministro e o episódio deflagrou crise ética no STF.",
    evidence: [
      { label: "G1 · 28 mensagens", url: "https://g1.globo.com/politica/noticia/2026/09/01/pf-aponta-que-vorcaro-mandou-mensagens-a-telefone-atribuido-a-moraes-na-semana-em-que-foi-preso.ghtml" },
      { label: "Metrópoles · 4 msgs autodestrutivas", url: "https://www.metropoles.com/colunas/andreza-matais/moraes-mandou-mensagens-vorcaro-autodestrutivas-dia-prisao" },
      { label: "Estadão · oposição pede prisão", url: "https://www.estadao.com.br/politica/oposicao-pede-prisao-de-moraes-e-cresce-pressao-por-etica-no-stf-apos-mensagens-vazadas-com-vorcaro/" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "andre-mendonca", kind: "investigation", label: "prisão decretada · relator",
    when: "2026-03",
    why: "Mendonça é o relator da Compliance Zero no STF: decretou a segunda prisão preventiva de Vorcaro (4/3/2026), autorizou suas transferências de cela e, em 8–9/9/2026, quebrou o sigilo do relatório da PF sobre as mensagens com Moraes — o estopim da crise institucional e do afastamento do diretor-geral da PF.",
    evidence: [
      { label: "CNN · 10 revelações", url: "https://www.cnnbrasil.com.br/politica/caso-banco-master-veja-10-revelacoes-apos-nova-prisao-de-vorcaro/" },
      { label: "Wikipédia · caso no STF", url: "https://pt.wikipedia.org/wiki/Caso_Master_no_Supremo_Tribunal_Federal" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "dias-toffoli", kind: "legal", label: "sigilo ao pedido da defesa",
    when: "2025-12",
    why: "Em 2/12/2025, o ministro Toffoli determinou sigilo máximo sobre o pedido apresentado pela defesa de Vorcaro no STF, conforme registro da Wikipédia com fontes jornalísticas.",
    evidence: [{ label: "Wikipédia · Vorcaro", url: "https://pt.wikipedia.org/wiki/Daniel_Vorcaro" }],
  },
  {
    source: "andre-mendonca", target: "edson-fachin", kind: "stf", label: "prazo de 24h sobre sigilo",
    when: "2026-09",
    why: "Mendonça imposto sigilo total à operação; em 9/9/2026 o presidente do STF, Fachin, deu 24 horas para que o relator retirasse a medida e cancelou a sessão plenária da semana em meio à crise deflagrada pelo caso Master.",
    evidence: [
      { label: "Exame · Fachin dá 24h", url: "https://exame.com/brasil/fachin-da-24h-para-que-mendonca-retire-sigilo-total-da-operacao-compliance-zero/" },
    ],
  },
  {
    source: "andre-mendonca", target: "alexandre-de-moraes", kind: "stf", label: "quebra de sigilo expôs mensagens",
    when: "2026-09",
    why: "A quebra de sigilo do relatório da PF, determinada pelo relator Mendonça, expôs as mensagens atribuídas a Moraes e Vorcaro e colocou os dois ministros em lados opostos da crise; a oposição pediu a prisão de Moraes e cresceu a pressão por um debate ético no STF.",
    evidence: [
      { label: "CNN · crise no STF", url: "https://www.cnnbrasil.com.br/politica/relacao-moraes-vorcaro-mendonca-afasta-andrei-tudo-sobre-a-crise-no-stf/" },
      { label: "Estadão · pressão por ética", url: "https://www.estadao.com.br/politica/oposicao-pede-prisao-de-moraes-e-cresce-pressao-por-etica-no-stf-apos-mensagens-vazadas-com-vorcaro/" },
    ],
  },
  {
    source: "gilmar-mendes", target: "edson-fachin", kind: "stf", label: "reforma regimental",
    when: "2026-09",
    why: "No bojo da crise do Master, Gilmar levou a Fachin (3/9) e formalizou depois (5/9) proposta de mudar o regimento do STF para proibir delegados da PF — e militares — de trabalharem em gabinetes de ministros da Corte.",
    evidence: [
      { label: "G1 · proposta a Fachin", url: "https://g1.globo.com/politica/blog/valdo-cruz/post/2026/09/03/gilmar-propoe-a-fachin-proibir-delegados-da-pf-como-funcionarios-de-gabinetes-de-ministros-do-stf.ghtml" },
      { label: "O Globo · regimento", url: "https://oglobo.globo.com/politica/noticia/2026/09/05/em-meio-a-crise-do-caso-master-gilmar-mendes-propoe-mudar-regimento-do-stf-para-retirar-delegados-da-pf-e-militares-de-gabinetes-do-supremo.ghtml" },
    ],
  },
  {
    source: "andre-mendonca", target: "andrei-rodrigues", kind: "investigation", label: "afastamento do diretor-geral",
    when: "2026-09",
    why: "Para conter a crise após o vazamento do relatório sobre Moraes, Mendonça afastou o diretor-geral da PF, Andrei Rodrigues (set/2026) — movimento inédito que escancarou o atrito entre o STF e a corporação durante o caso Master.",
    evidence: [
      { label: "CNN · Mendonça afasta Andrei", url: "https://www.cnnbrasil.com.br/politica/relacao-moraes-vorcaro-mendonca-afasta-andrei-tudo-sobre-a-crise-no-stf/" },
    ],
  },
  {
    source: "jair-bolsonaro", target: "nikolas-ferreira", kind: "politics", label: "reeleição 2022 · caravana",
    when: "2022-10",
    why: "Nikolas é um dos nomes bolsonaristas mais votados da Câmara e fez a caravana “Juventude pelo Brasil” pelo 2º turno de 2022 — a que usou o jato ligado a Vorcaro para percorrer regiões onde Lula venceu no 1º turno. Bolsonaro foi convidado ao casamento do deputado (2023).",
    evidence: [
      { label: "O Globo · perfil 2022", url: "https://oglobo.globo.com/politica/eleicoes-2022/noticia/2022/10/saiba-quem-e-nikolas-ferreira-o-bolsonarista-mineiro-de-26-anos-que-foi-deputado-federal-mais-votado-do-pais.ghtml" },
      { label: "G1 · áudios e caravana", url: "https://g1.globo.com/politica/noticia/2026/09/03/nikolas-ferreira-confirma-pedido-a-daniel-vorcaro-em-favor-de-ex-assessor-e-diz-que-nao-houve-irregularidade.ghtml" },
    ],
  },
  {
    source: "eduardo-bolsonaro", target: "nikolas-ferreira", kind: "politics", label: "apoiador inicial (2020)",
    when: "2020-10",
    why: "Eduardo Bolsonaro apoiou publicamente a candidatura de Nikolas a vereador de Belo Horizonte em 2020 (O Globo/Sonár) — início da trajetória de Nikolas na rede bolsonarista que o caso Master expôs.",
    evidence: [
      { label: "O Globo · Sonár (2020)", url: "https://blogs.oglobo.globo.com/sonar-a-escuta-das-redes/post/conheca-o-youtuber-que-ganhou-o-apoio-de-eduardo-bolsonaro-em-belo-horizonte.html" },
    ],
  },
  {
    source: "flavio-bolsonaro", target: "daniel-vorcaro", kind: "investigation", label: "pediu US$ 24 mi (R$ 134 mi)",
    when: "2026-05",
    why: "Segundo o Intercept Brasil (mai/2026), o senador negociou com Vorcaro o financiamento de “Dark Horse” e chegou a pedir US$ 24 milhões. Áudios e mensagens registraram a negociação e cobranças de parcelas atrasadas — 8 dias após uma cobrança, veio novo repasse, segundo o Coaf. Mendonça autorizou investigação contra Flávio por corrupção, lavagem de dinheiro e evasão de divisas.",
    evidence: [
      { label: "Intercept · planilha e recibo", url: "https://www.intercept.com.br/2026/06/09/planilha-comprovante-bancario-vorcaro-dinheiro-eua-ar-dark-horse/" },
      { label: "BBC · o que ele precisa explicar", url: "https://www.bbc.com/portuguese/articles/cy9zvqle2r0o" },
      { label: "G1 · PF investiga Flávio (11/9)", url: "https://g1.globo.com/politica/noticia/2026/09/11/flavio-bolsonaro-e-investigado-5-pontos-que-a-pf-quer-esclarecer-sobre-o-financiamento-de-dark-horse.ghtml" },
    ],
  },
  {
    source: "daniel-vorcaro", target: "dark-horse", kind: "investigation", label: "financiou ~US$ 10 mi (R$ 61 mi+)",
    when: "2025-01",
    why: "Comprovantes e diálogos do celular de Vorcaro registram envio de ao menos US$ 10 milhões ao fundo Havengate Development (Texas/EUA), sob a justificativa de patrocinar “Dark Horse”. O Coaf registra nova parcela de US$ 1,67 mi em 16/9/2025 — oito dias após Flávio cobrar pagamentos atrasados — elevando o total conhecido a cerca de R$ 65 milhões. Investigadores rejeitam a tese de “patrocínio” e apuram a finalidade real da operação.",
    evidence: [
      { label: "Poder360 · R$ 65 mi ao filme", url: "https://www.poder360.com.br/poder-justica/filme-dark-horse-recebeu-r-65-milhoes-de-daniel-vorcaro/" },
      { label: "Valor · Coaf aponta mais repasses", url: "https://valor.globo.com/politica/noticia/2026/09/01/vorcaro-repassou-ao-filme-sobre-bolsonaro-mais-do-que-o-admitido-por-flavio-indica-coaf.ghtml" },
      { label: "O Globo · suspeita sobre finalidade (11/9)", url: "https://oglobo.globo.com/politica/noticia/2026/09/11/projecao-de-renda-da-bilheteria-de-dark-horse-de-ate-r-100-milhoes-fez-pf-levantar-suspeita-sobre-finalidade-de-operacao.ghtml" },
    ],
  },
  {
    source: "flavio-bolsonaro", target: "dark-horse", kind: "movie", label: "negociou o patrocínio",
    when: "2025-01",
    why: "Flávio foi o interlocutor da produção com Vorcaro: pediu os recursos, acompanhou parcelas e defendeu publicamente o filme. A PF investiga se houve vantagem indevida envolvendo agente público (o senador, pré-candidato) e o banqueiro — investigadores rechaçam o rótulo de patrocínio.",
    evidence: [
      { label: "G1 · investigadores rechaçam “patrocínio”", url: "https://g1.globo.com/politica/blog/andreia-sadi/post/2026/08/29/dark-horse-flavio-bolsonaro-filme-vorcaro.ghtml" },
      { label: "G1 · o que se sabe do filme", url: "https://g1.globo.com/pop-arte/cinema/noticia/2026/05/13/dark-horse-o-que-se-sabe-sobre-cinebiografia-de-bolsonaro-para-a-qual-flavio-bolsonaro-pediu-dinheiro-a-vorcaro.ghtml" },
    ],
  },
  {
    source: "eduardo-bolsonaro", target: "daniel-vorcaro", kind: "investigation", label: "orientou gestão dos recursos (PF)",
    when: "2026-09",
    why: "A PF apurou que Eduardo Bolsonaro orientou Vorcaro sobre como os recursos do financiamento de “Dark Horse” deveriam ser geridos — as remessas foram feitas a um fundo de investimento sediado no Texas (EUA).",
    evidence: [
      { label: "MidiaMax · PF aponta orientação", url: "https://midiamax.com.br/brasil/2026/eduardo-bolsonaro-orientou-vorcaro-repasses-financiamento-dark-horse-diz-pf/" },
    ],
  },
  {
    source: "mineiro", target: "daniel-vorcaro", kind: "investigation", label: "operador financeiro · delator",
    when: "2025-01",
    why: "Dono da Entre Investimentos, “Mineiro” diz ter sido o responsável pelos repasses a mando de Vorcaro: US$ 12,333 milhões em 7 transferências (jan–set/2025). Na delação homologada por Mendonça (9/9/2026), descreveu também malas de dinheiro vivo e repasses nas Bahamas — pode esclarecer valores totais, origem e destino real do dinheiro.",
    evidence: [
      { label: "G1 · o que se sabe da delação", url: "https://g1.globo.com/politica/noticia/2026/09/09/recursos-para-dark-horse-malas-para-dinheiro-vivo-e-repasses-nas-bahamas-o-que-se-sabe-da-delacao-de-empresario-ligado-a-vorcaro.ghtml" },
      { label: "G1 · delator detalha pagamentos", url: "https://g1.globo.com/politica/blog/andreia-sadi/post/2026/09/09/delator-do-caso-master-detalha-pagamentos-a-fundo-de-dark-horse.ghtml" },
    ],
  },
  {
    source: "mineiro", target: "dark-horse", kind: "movie", label: "fez os repasses",
    when: "2025-01",
    why: "As transferências para o fundo do filme foram executadas pela empresa de “Mineiro” — incluída na delação como operadora dos pagamentos prometidos por Vorcaro ao projeto de Flávio Bolsonaro.",
    evidence: [
      { label: "G1 · homologação da delação", url: "https://g1.globo.com/politica/noticia/2026/09/09/mendonca-homologa-delacao-de-mineiro.ghtml" },
    ],
  },
  {
    source: "andre-mendonca", target: "mineiro", kind: "investigation", label: "homologou a delação (9/9)",
    when: "2026-09",
    why: "O relator do caso homologou em 9/9/2026 o acordo de delação premiada de “Mineiro” com a PGR — peça que detalha o esquema de repasses de Vorcaro e alimenta a frente de apuração do filme.",
    evidence: [
      { label: "Poder360 · homologação", url: "https://www.poder360.com.br/poder-justica/dark-horse-mendonca-homologa-delacao-sobre-repasses-de-vorcaro/" },
      { label: "Estadão · coluna", url: "https://www.estadao.com.br/politica/coluna-do-estadao/mendonca-homologa-delacao-de-operador-que-mandou-dinheiro-de-vorcaro-para-filme-dark-horse/" },
    ],
  },
  {
    source: "jair-bolsonaro", target: "dark-horse", kind: "movie", label: "biografado",
    when: "2025-01",
    why: "“Dark Horse” é a cinebiografia da trajetória política de Jair Bolsonaro, com Jim Caviezel no elenco — o filme que recebeu o dinheiro de Vorcaro agora apurado pela PF como possível pagamento de vantagem indevida.",
    evidence: [
      { label: "G1 · o que se sabe do filme", url: "https://g1.globo.com/pop-arte/cinema/noticia/2026/05/13/dark-horse-o-que-se-sabe-sobre-cinebiografia-de-bolsonaro-para-a-qual-flavio-bolsonaro-pediu-dinheiro-a-vorcaro.ghtml" },
    ],
  },
  {
    source: "jair-bolsonaro", target: "flavio-bolsonaro", kind: "family", label: "pai e filho",
    when: "2025-01",
    why: "Flávio é o filho mais velho de Jair Bolsonaro e senador pelo RJ; pré-candidato à Presidência em 2026 — família no centro do esquema de financiamento apurado pela PF.",
    evidence: [{ label: "Wikipédia · Flávio Bolsonaro", url: "https://pt.wikipedia.org/wiki/Flávio_Bolsonaro" }],
  },
  {
    source: "jair-bolsonaro", target: "eduardo-bolsonaro", kind: "family", label: "pai e filho",
    when: "2020-10",
    why: "Eduardo é filho de Jair Bolsonaro e deputado federal; apontado pela PF como orientador da gestão dos recursos enviados por Vorcaro para o filme sobre o pai.",
    evidence: [
      { label: "MidiaMax · PF aponta orientação", url: "https://midiamax.com.br/brasil/2026/eduardo-bolsonaro-orientou-vorcaro-repasses-financiamento-dark-horse-diz-pf/" },
    ],
  },
];

export function personToNode(p) {
  return {
    id: p.id,
    type: p.kind === "movie" ? "artifact" : "person",
    position: { x: p.x ?? 0, y: p.y ?? 0 },
    data: p,
  };
}

/** Escolhe handles nas bordas para as curvas fluírem na direção do outro nó. */
export function chooseHandles(a, b) {
  if (!a || !b) return {};
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) > Math.abs(dy) * 1.15) {
    return dx > 0
      ? { sourceHandle: "r-out", targetHandle: "l-in" }
      : { sourceHandle: "l-out", targetHandle: "r-in" };
  }
  return dy > 0
    ? { sourceHandle: "b-out", targetHandle: "t-in" }
    : { sourceHandle: "t-out", targetHandle: "b-in" };
}

export function linkToEdge(l, i, positions) {
  const meta = RELATIONS[l.kind] || RELATIONS.business;
  const isInv = l.kind === "investigation";
  return {
    id: l.id || `e-${l.source}-${l.target}-${i}`,
    source: l.source,
    target: l.target,
    ...chooseHandles(positions?.[l.source], positions?.[l.target]),
    type: "default",
    interactionWidth: 24,
    style: {
      stroke: meta.color,
      strokeWidth: isInv ? 2 : 1.4,
      strokeDasharray: isInv ? "7 5" : undefined,
    },
    labelStyle: { fill: "#e4e4e7", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" },
    labelBgStyle: { fill: "#09090b", fillOpacity: 0.94 },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    data: { kind: l.kind, label: l.label, why: l.why, evidence: l.evidence || [], custom: l.custom },
  };
}

/** Limites do eixo do tempo (YYYY-MM): pontos de encaixe = datas de fatos documentados. */
export const TIMELINE = (() => {
  const whens = LINKS.map((l) => l.when).filter(Boolean).sort();
  const sinces = PEOPLE.map((p) => p.since).filter(Boolean);
  const stops = [...new Set(whens)];
  const min = stops[0] || sinces[0] || "2020-10";
  const max = stops[stops.length - 1] || "2026-09";
  return { min, max, stops };
})();
