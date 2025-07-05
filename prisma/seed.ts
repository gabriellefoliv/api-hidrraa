import prisma from '../src/lib/prisma'

async function main() {
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
          'Projeto dedicado à recuperação de áreas degradadas por meio do plantio de espécies nativas e controle de invasoras. A meta é restabelecer a biodiversidade, promover a conectividade ecológica e contribuir com a regulação climática e hídrica.',
      },
      {
        codTipoProjeto: 3,
        nome: 'Saneamento Rural',
        descricao:
          'Implantação de soluções de saneamento básico adaptadas ao meio rural, como fossas sépticas biodigestoras, filtros e sistemas de manejo de águas cinzas. O projeto visa melhorar a saúde pública e proteger os corpos hídricos da contaminação.',
      },
      {
        codTipoProjeto: 4,
        nome: 'Restauração Florestal',
        descricao:
          'Projeto dedicado à recuperação de áreas degradadas por meio do plantio de espécies nativas e controle de invasoras. A meta é restabelecer a biodiversidade, promover a conectividade ecológica e contribuir com a regulação climática e hídrica.',
      },
      {
        codTipoProjeto: 5,
        nome: 'Sistemas Agroflorestais',
        descricao:
          'Implementação de modelos produtivos que integram árvores, culturas agrícolas e, em alguns casos, animais, promovendo a regeneração ambiental aliada à produção sustentável de alimentos, madeira e outros recursos.',
      },
    ],
  })

  await prisma.marco_recomendado.createMany({
    data: [
      {
        codMarcoRecomendado: 1,
        descricao: 'Diagnóstico e Planejamento',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 2,
        descricao: 'Cercamento da Área',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 3,
        descricao: 'Revegetação do Entorno',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 4,
        descricao: 'Estruturas de Proteção',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 5,
        descricao: 'Manutenção e Monitoramento',
        codTipoProjeto: 1,
      },
      {
        codMarcoRecomendado: 6,
        descricao: 'Diagnóstico da Erosão',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 7,
        descricao: 'Construção de Barraginhas / Cordões de Contorno',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 8,
        descricao: 'Terraceamento ou Camalhões',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 9,
        descricao: 'Plantio de cobertura vegetal / adubação verde',
        codTipoProjeto: 2,
      },
      {
        codMarcoRecomendado: 10,
        descricao: 'Diagnóstico Sanitário Ambiental',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 11,
        descricao: 'Construção de Fossa Séptica com Valas de Infiltração',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 12,
        descricao: 'Implantação de Sistema de Biodigestor',
        codTipoProjeto: 3,
      },
      {
        codMarcoRecomendado: 13,
        descricao: 'Capacitação da família / moradores',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 14,
        descricao: 'Diagnóstico da Área',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 15,
        descricao: 'Preparo do Solo',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 16,
        descricao: 'Plantio de Mudas Nativas',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 17,
        descricao: 'Manutenção e Monitoramento',
        codTipoProjeto: 4,
      },
      {
        codMarcoRecomendado: 18,
        descricao: 'Planejamento e Desenho do SAF',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 19,
        descricao: 'Preparo da Área e Plantio',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 20,
        descricao: 'Implantação de Sistemas de Irrigação / Adubação Verde',
        codTipoProjeto: 5,
      },
      {
        codMarcoRecomendado: 21,
        descricao: 'Monitoramento de Desenvolvimento',
        codTipoProjeto: 5,
      },
    ],
  })

  await prisma.evidencia_demandada.createMany({
    data: [
      {
        codEvidenciaDemandada: 1,
        descricao: 'Mapa/croqui com localização das nascentes',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 1,
      },
      {
        codEvidenciaDemandada: 2,
        descricao: 'Fotos do estado atual das nascentes',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 1,
      },
      {
        codEvidenciaDemandada: 3,
        descricao: 'Plano de intervenção detalhado',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 1,
      },
      {
        codEvidenciaDemandada: 4,
        descricao: 'Fotos do processo de cercamento',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 2,
      },
      {
        codEvidenciaDemandada: 5,
        descricao: 'Fotos da cerca concluída',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 2,
      },
      {
        codEvidenciaDemandada: 6,
        descricao: 'Notas fiscais de materiais (mourões, arame, etc)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 2,
      },
      {
        codEvidenciaDemandada: 7,
        descricao: 'Fotos de preparo do solo e plantio',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 3,
      },
      {
        codEvidenciaDemandada: 8,
        descricao: 'Lista de espécies utilizadas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 3,
      },
      {
        codEvidenciaDemandada: 9,
        descricao: 'Notas fiscais de aquisição de mudas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 3,
      },
      {
        codEvidenciaDemandada: 10,
        descricao: 'Fotos da construção das estruturas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 4,
      },
      {
        codEvidenciaDemandada: 11,
        descricao: 'Fotos das estruturas concluídas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 4,
      },
      {
        codEvidenciaDemandada: 12,
        descricao: 'Notas fiscais de materiais utilizados',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 4,
      },
      {
        codEvidenciaDemandada: 13,
        descricao: 'Relatório de manutenção',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 5,
      },
      {
        codEvidenciaDemandada: 14,
        descricao: 'Fotos comparativas (antes/depois)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 5,
      },
      {
        codEvidenciaDemandada: 15,
        descricao: 'Medições de vazão (se aplicável)',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 5,
      },
      {
        codEvidenciaDemandada: 16,
        descricao: 'Mapa de áreas degradas com pontos críticos',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 6,
      },
      {
        codEvidenciaDemandada: 17,
        descricao: 'Fotos do estado atual da erosão',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 6,
      },
      {
        codEvidenciaDemandada: 18,
        descricao: 'Laudo técnico da análise do solo',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 6,
      },
      {
        codEvidenciaDemandada: 19,
        descricao: 'Fotos do processo de construção',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 7,
      },
      {
        codEvidenciaDemandada: 20,
        descricao: 'Croqui ou planta das estruturas construídas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 7,
      },
      {
        codEvidenciaDemandada: 21,
        descricao: 'Notas fiscais de materiais utilizados',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 7,
      },
      {
        codEvidenciaDemandada: 22,
        descricao: 'Imagens das etapas do terraceamento',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 8,
      },
      {
        codEvidenciaDemandada: 23,
        descricao: 'Relatório técnico com justificativa e dimensionamento',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 8,
      },
      {
        codEvidenciaDemandada: 24,
        descricao: 'Lista de espécies utilizadas no plantio',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 9,
      },
      {
        codEvidenciaDemandada: 25,
        descricao: 'Fotos do plantio e desenvolvimento inicial',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 9,
      },
      {
        codEvidenciaDemandada: 26,
        descricao: 'Notas fiscais das sementes/mudas adquiridas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 9,
      },
      {
        codEvidenciaDemandada: 27,
        descricao: 'Levantamento das condições sanitárias da área',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 10,
      },
      {
        codEvidenciaDemandada: 28,
        descricao: 'Planta baixa com localização dos sistemas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 10,
      },
      {
        codEvidenciaDemandada: 29,
        descricao: 'Fotos da escavação, instalação e finalização dos sistemas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 11,
      },
      {
        codEvidenciaDemandada: 30,
        descricao: 'Notas fiscais de materiais utilizados e serviços prestados',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 11,
      },
      {
        codEvidenciaDemandada: 31,
        descricao: 'Fotos da instalação e funcionamento do biodigestor',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 12,
      },
      {
        codEvidenciaDemandada: 32,
        descricao: 'Notas fiscais dos equipamentos',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 12,
      },
      {
        codEvidenciaDemandada: 33,
        descricao: 'Lista de presença',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 13,
      },
      {
        codEvidenciaDemandada: 34,
        descricao: 'Material didático aplicado na capacitação',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 13,
      },
      {
        codEvidenciaDemandada: 35,
        descricao: 'Relatório de atividades realizadas',
        tipoArquivo: 'pdf',
        codMarcoRecomendado: 13,
      },
    ],
  })

  await prisma.cbh.create({
    data: {
      codCBH: 1,
      nome: 'Comitê Não-Real',
    },
  })

  await prisma.microbacia.createMany({
    data: [
      {
        CodMicroBacia: 1,
        Nome: 'Microbacia A',
        CodCBH: 1,
      },
      {
        CodMicroBacia: 2,
        Nome: 'Microbacia B',
        CodCBH: 1,
      },
    ],
  })

  await prisma.produtor_rural.createMany({
    data: [
      {
        codProdutor: 1,
        nome: 'Produtor A',
        cpf: 12345678901,
        contato: 11987654321,
        codCBH: 1,
      },
      {
        codProdutor: 2,
        nome: 'Produtor B',
        cpf: 10987654321,
        contato: 11912345678,
        codCBH: 1,
      },
    ],
  })

  await prisma.propriedade.createMany({
    data: [
      {
        codPropriedade: 1,
        logradouro: 'Rua A',
        numero: 123,
        bairro: 'Bairro A',
        cidade: 'Cidade A',
        complemento: 'Casa 1',
        cep: 12345000,
        uf: 'SP',
        codProdutor: 1,
        CodMicroBacia: 1,
      },
      {
        codPropriedade: 2,
        logradouro: 'Rua B',
        numero: 456,
        bairro: 'Bairro B',
        cidade: 'Cidade B',
        complemento: 'Casa 2',
        cep: 67890000,
        uf: 'SP',
        codProdutor: 2,
        CodMicroBacia: 2,
      },
    ],
  })

  console.log('Dados pré-definidos inseridos com sucesso!')
}

main().finally(() => prisma.$disconnect())
