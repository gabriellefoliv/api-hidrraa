import prisma from '../src/lib/prisma'

async function main() {
  // ----------------------------------------------------------------
  // 1. TIPOS DE PROJETO
  // ----------------------------------------------------------------
  await prisma.tipo_projeto.createMany({
    data: [
      {
        codTipoProjeto: 1,
        nome: 'Proteção de Nascentes',
        descricao:
          "Projeto para proteção e recuperação de nascentes e olhos d'água através de cercamento, revegetação do entorno e outras técnicas de conservação, visando garantir a qualidade e quantidade de água disponível.",
      },
      {
        codTipoProjeto: 2,
        nome: 'Conservação do Solo',
        descricao:
          'Projeto dedicado à implementação de práticas que evitam a erosão e o empobrecimento do solo, como a construção de terraços, barraginhas e a utilização de cobertura vegetal, melhorando a infiltração da água e reduzindo o assoreamento dos rios.',
      },
      {
        codTipoProjeto: 3,
        nome: 'Saneamento Rural',
        descricao:
          'Implantação de soluções de saneamento básico adaptadas ao meio rural, como fossas sépticas biodigestoras e bacias de evapotranspiração (BET), visando melhorar a saúde pública e proteger os corpos hídricos da contaminação.',
      },
      {
        codTipoProjeto: 4,
        nome: 'Restauração Florestal',
        descricao:
          'Projeto dedicado à recuperação de áreas degradadas por meio do plantio de espécies nativas da Mata Atlântica. A meta é restabelecer a biodiversidade, promover a conectividade ecológica e contribuir com a regulação climática e hídrica.',
      },
      {
        codTipoProjeto: 5,
        nome: 'Sistemas Agroflorestais (SAF)',
        descricao:
          'Implementação de modelos produtivos que integram árvores nativas, culturas agrícolas e, em alguns casos, animais, promovendo a regeneração ambiental aliada à produção sustentável de alimentos e outros recursos.',
      },
    ],
  })

  // ----------------------------------------------------------------
  // 2. MARCOS RECOMENDADOS (COMPLETO)
  // ----------------------------------------------------------------
  await prisma.marco_recomendado.createMany({
    data: [
      // === PROJETO 1: PROTEÇÃO DE NASCENTES ===
      {
        codMarcoRecomendado: 1,
        descricao: 'Diagnóstico e Planejamento da Área da Nascente',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 2,
        descricao: 'Cercamento da Área de Preservação Permanente (APP)',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 3,
        descricao: 'Revegetação do Entorno com Espécies Nativas',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 4,
        descricao: 'Implementação de Estruturas de Proteção Adicionais',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 5,
        descricao: 'Manutenção e Monitoramento da Nascente Recuperada',
        codTipoProjeto: 1,
      },

      // === PROJETO 2: CONSERVAÇÃO DO SOLO ===
      {
        codMarcoRecomendado: 6,
        descricao: 'Diagnóstico e Mapeamento das Áreas de Erosão',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 7,
        descricao: 'Construção de Barraginhas ou Caixas Secas',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 8,
        descricao: 'Terraceamento Agrícola em Nível',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 9,
        descricao: 'Plantio de Cobertura Vegetal e Adubação Verde',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 10,
        descricao: 'Monitoramento da Eficiência das Práticas Conservacionistas',
        codTipoProjeto: 2,
      },

      // === PROJETO 3: SANEAMENTO RURAL ===
      {
        codMarcoRecomendado: 11,
        descricao: 'Diagnóstico Sanitário Ambiental da Propriedade',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 12,
        descricao: 'Capacitação da Família sobre Uso e Manutenção do Sistema',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 13,
        descricao: 'Implantação de Fossa Séptica Biodigestora ou BET',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 14,
        descricao: 'Implantação de Círculo de Bananeiras para Águas Cinzas',
        codTipoProjeto: 3,
      },

      // === PROJETO 4: RESTAURAÇÃO FLORESTAL ===
      {
        codMarcoRecomendado: 15,
        descricao: 'Diagnóstico e Mapeamento da Área a ser Restaurada',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 16,
        descricao: 'Preparo do Solo e Controle de Competidoras',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 17,
        descricao: 'Plantio de Mudas de Espécies Nativas da Mata Atlântica',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 18,
        descricao: 'Manutenção Pós-Plantio e Monitoramento',
        codTipoProjeto: 4,
      },

      // === PROJETO 5: SISTEMAS AGROFLORESTAIS (SAF) ===
      {
        codMarcoRecomendado: 19,
        descricao: 'Capacitação do Produtor em Práticas Agroflorestais',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 20,
        descricao: 'Planejamento e Desenho do Sistema Agroflorestal (SAF)',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 21,
        descricao: 'Implantação do SAF: Preparo da Área e Plantio',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 22,
        descricao: 'Manejo e Monitoramento do Desenvolvimento do SAF',
        codTipoProjeto: 5,
      },
    ],
  })

  // ----------------------------------------------------------------
  // 3. EVIDÊNCIAS DEMANDADAS (COMPLETO)
  // ----------------------------------------------------------------
  await prisma.evidencia_demandada.createMany({
    data: [
      // === EVIDÊNCIAS PARA PROJETO 1: PROTEÇÃO DE NASCENTES ===
      {
        codEvidenciaDemandada: 1,
        descricao: 'Mapa/croqui com localização georreferenciada da nascente',
        tipoArquivo: 'pdf, kml',
        codMarcoRecomendado: 1,
      },
      {
        codEvidenciaDemandada: 2,
        descricao: 'Registro fotográfico do estado atual da nascente',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 1,
      },
      {
        codEvidenciaDemandada: 3,
        descricao: 'Fotos georreferenciadas do processo de cercamento',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 2,
      },
      {
        codEvidenciaDemandada: 4,
        descricao: 'Notas fiscais de materiais da cerca (arame, mourões)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 2,
      },
      {
        codEvidenciaDemandada: 5,
        descricao: 'Fotos do preparo do solo e do plantio das mudas',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 3,
      },
      {
        codEvidenciaDemandada: 6,
        descricao: 'Lista de espécies nativas utilizadas',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 3,
      },
      {
        codEvidenciaDemandada: 7,
        descricao:
          'Fotos das estruturas de proteção construídas (se aplicável)',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 4,
      },
      {
        codEvidenciaDemandada: 8,
        descricao:
          'Relatório de manutenção periódica (coroamento, controle de pragas)',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 5,
      },
      {
        codEvidenciaDemandada: 9,
        descricao: 'Fotos comparativas da área (antes e 6 meses depois)',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 5,
      },

      // === EVIDÊNCIAS PARA PROJETO 2: CONSERVAÇÃO DO SOLO ===
      {
        codEvidenciaDemandada: 10,
        descricao: 'Mapa de declividade da propriedade com pontos de erosão',
        tipoArquivo: 'pdf, kml',
        codMarcoRecomendado: 6,
      },
      {
        codEvidenciaDemandada: 11,
        descricao: 'Laudo de análise de solo da área',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 6,
      },
      {
        codEvidenciaDemandada: 12,
        descricao: 'Fotos do processo de locação e escavação das barraginhas',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 7,
      },
      {
        codEvidenciaDemandada: 13,
        descricao: 'Nota fiscal de serviço de máquina (se houver)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 7,
      },
      {
        codEvidenciaDemandada: 14,
        descricao: 'Fotos das etapas de construção dos terraços em nível',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 8,
      },
      {
        codEvidenciaDemandada: 15,
        descricao: 'Relatório técnico com o dimensionamento dos terraços',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 8,
      },
      {
        codEvidenciaDemandada: 16,
        descricao: 'Fotos do preparo do solo e semeadura/plantio da cobertura',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 9,
      },
      {
        codEvidenciaDemandada: 17,
        descricao: 'Notas fiscais de aquisição de sementes (mix de cobertura)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 9,
      },
      {
        codEvidenciaDemandada: 18,
        descricao: 'Relatório de monitoramento com fotos da área após chuvas',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 10,
      },

      // === EVIDÊNCIAS PARA PROJETO 3: SANEAMENTO RURAL ===
      {
        codEvidenciaDemandada: 19,
        descricao:
          'Relatório de visita com avaliação da situação sanitária atual',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 11,
      },
      {
        codEvidenciaDemandada: 20,
        descricao: 'Fotos do sistema de esgoto existente (ou da falta dele)',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 11,
      },
      {
        codEvidenciaDemandada: 21,
        descricao: 'Lista de presença assinada pelos moradores capacitados',
        tipoArquivo: 'pdf, jpeg',
        codMarcoRecomendado: 12,
      },
      {
        codEvidenciaDemandada: 22,
        descricao:
          'Cópia do material orientativo (cartilha) entregue à família',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 12,
      },
      {
        codEvidenciaDemandada: 23,
        descricao: 'Fotos de todas as etapas da construção da fossa/BET',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 13,
      },
      {
        codEvidenciaDemandada: 24,
        descricao: 'Notas fiscais de materiais (bombonas, canos, anéis)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 13,
      },
      {
        codEvidenciaDemandada: 25,
        descricao: 'Fotos da escavação e montagem do círculo de bananeiras',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 14,
      },
      {
        codEvidenciaDemandada: 26,
        descricao: 'Comprovante de aquisição das mudas de bananeira',
        tipoArquivo: 'pdf, jpeg',
        codMarcoRecomendado: 14,
      },

      // === EVIDÊNCIAS PARA PROJETO 4: RESTAURAÇÃO FLORESTAL ===
      {
        codEvidenciaDemandada: 27,
        descricao: 'Mapa da propriedade destacando a área a ser restaurada',
        tipoArquivo: 'pdf, kml',
        codMarcoRecomendado: 15,
      },
      {
        codEvidenciaDemandada: 28,
        descricao: 'Fotos panorâmicas do local antes da intervenção',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 15,
      },
      {
        codEvidenciaDemandada: 29,
        descricao: 'Fotos da roçada, coroamento ou controle de gramíneas',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 16,
      },
      {
        codEvidenciaDemandada: 30,
        descricao: 'Fotos do controle de formigas cortadeiras na área total',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 16,
      },
      {
        codEvidenciaDemandada: 31,
        descricao: 'Fotos da equipe realizando o plantio das mudas',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 17,
      },
      {
        codEvidenciaDemandada: 32,
        descricao: 'Nota fiscal de compra das mudas nativas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 17,
      },
      {
        codEvidenciaDemandada: 33,
        descricao: 'Relatório de manutenção com fotos (adubação de cobertura)',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 18,
      },
      {
        codEvidenciaDemandada: 34,
        descricao:
          'Relatório de monitoramento com taxa de sobrevivência das mudas',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 18,
      },

      // === EVIDÊNCIAS PARA PROJETO 5: SISTEMAS AGROFLORESTAIS (SAF) ===
      {
        codEvidenciaDemandada: 35,
        descricao: 'Lista de presença do curso ou dia de campo sobre SAF',
        tipoArquivo: 'pdf, jpeg',
        codMarcoRecomendado: 19,
      },
      {
        codEvidenciaDemandada: 36,
        descricao: 'Fotos da atividade de capacitação',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 19,
      },
      {
        codEvidenciaDemandada: 37,
        descricao: 'Croqui (desenho) do SAF com o arranjo das espécies',
        tipoArquivo: 'pdf, jpeg',
        codMarcoRecomendado: 20,
      },
      {
        codEvidenciaDemandada: 38,
        descricao:
          'Lista de espécies selecionadas (componentes arbóreo e agrícola)',
        tipoArquivo: 'pdf, docx',
        codMarcoRecomendado: 20,
      },
      {
        codEvidenciaDemandada: 39,
        descricao:
          'Fotos do preparo do solo e da marcação das linhas de plantio',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 21,
      },
      {
        codEvidenciaDemandada: 40,
        descricao: 'Notas fiscais de aquisição de mudas, sementes e insumos',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 21,
      },
      {
        codEvidenciaDemandada: 41,
        descricao: 'Fotos das atividades de manejo (poda, raleio)',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 22,
      },
      {
        codEvidenciaDemandada: 42,
        descricao: 'Fotos da primeira colheita de cultivos anuais no sistema',
        tipoArquivo: 'jpeg, png',
        codMarcoRecomendado: 22,
      },
    ],
  })

  await prisma.cbh.create({
    data: {
      codCBH: 1,
      nome: 'CBH Rios Dois Rios (R2R)',
    },
  })

  await prisma.microbacia.createMany({
    data: [
      { CodMicroBacia: 1, Nome: 'Microbacia do Córrego da Faca', CodCBH: 1 },
      { CodMicroBacia: 2, Nome: 'Microbacia do Rio Negro', CodCBH: 1 },
      { CodMicroBacia: 3, Nome: 'Microbacia do Córrego da Areia', CodCBH: 1 },
    ],
  })

  await prisma.produtor_rural.createMany({
    data: [
      {
        codProdutor: 1,
        nome: 'José Ferreira da Silva',
        cpf: '123.456.789-01',
        contato: '22987654321',
        codCBH: 1,
      },
      {
        codProdutor: 2,
        nome: 'Maria Antônia de Souza',
        cpf: '109.876.543-21',
        contato: '22912345678',
        codCBH: 1,
      },
    ],
  })

  await prisma.propriedade.createMany({
    data: [
      {
        codPropriedade: 1,
        logradouro: 'Córrego da Faca',
        numero: 1,
        bairro: 'Zona Rural',
        cidade: 'Bom Jardim',
        complemento: 'Próximo à ponte de madeira',
        cep: '28660-000',
        uf: 'RJ',
        codProdutor: 1,
        CodMicroBacia: 1,
      },
      {
        codPropriedade: 2,
        logradouro: 'Boa Sorte',
        numero: 5,
        bairro: 'Boa Sorte (Distrito)',
        cidade: 'Cantagalo',
        complemento: '',
        cep: '28500-000',
        uf: 'RJ',
        codProdutor: 2,
        CodMicroBacia: 2,
      },
    ],
  })

  console.log(
    'Seed completo inserido com sucesso! Todos os tipos de projeto foram detalhados.'
  )
}

main().finally(() => prisma.$disconnect())
