import prisma from '../../../lib/prisma'

export async function listarProjetosAvaliados() {
  const projetos = await prisma.projeto.findMany({
    where: {
      avaliacao: {
        some: {}, // Pelo menos uma avaliação
      },
      titulo: { not: null },
      objetivo: { not: null },
      acoes: { not: null },
      cronograma: { not: null },
    },
    include: {
      tipo_projeto: {
        include: {
          marco_recomendado: {
            include: {
              execucao_marco: true,
            },
          },
        },
      },
      avaliacao: {
        include: {
          avaliacao_item: {
            include: {
              criterio_aval: true,
            },
          },
        },
      },
      microbacia: true,
      entidadeexecutora: true,
    },
    orderBy: {
      dataSubmissao: 'desc',
    },
  })

  const projetosComMedia = projetos.map(projeto => {
    const avaliacoes = projeto.avaliacao

    // Calcular média ponderada
    const todasNotasEPesos = avaliacoes.flatMap(avaliacao =>
      avaliacao.avaliacao_item.map(item => ({
        nota: item.nota,
        peso: item.criterio_aval.peso,
      }))
    )

    const totalPeso = todasNotasEPesos.reduce((acc, cur) => acc + cur.peso, 0)
    const somaPonderada = todasNotasEPesos.reduce(
      (acc, cur) => acc + cur.nota * cur.peso,
      0
    )

    const mediaPonderada = totalPeso > 0 ? somaPonderada / totalPeso : null

    // Mapear marcos de execução desse projeto
    const execucaoMarcos = projeto.tipo_projeto.marco_recomendado.flatMap(
      marco =>
        marco.execucao_marco.filter(
          execucao => execucao.codProjeto === projeto.codProjeto
        )
    )

    return {
      codProjeto: projeto.codProjeto,
      titulo: projeto.titulo,
      objetivo: projeto.objetivo,
      acoes: projeto.acoes,
      cronograma: projeto.cronograma,
      orcamento: projeto.orcamento,
      codPropriedade: projeto.codPropriedade,
      CodMicroBacia: projeto.CodMicroBacia,
      mediaPonderada,
      tipo_projeto: {
        codTipoProjeto: projeto.tipo_projeto.codTipoProjeto,
        nome: projeto.tipo_projeto.nome,
        descricao: projeto.tipo_projeto.descricao,
        execucao_marcos: execucaoMarcos.map(exec => ({
          descricao: exec.descricao,
          valorEstimado: exec.valorEstimado,
          dataConclusao: exec.dataConclusao,
        })),
      },
      microbacia: {
        codMicroBacia: projeto.microbacia?.CodMicroBacia,
        nome: projeto.microbacia?.Nome,
      },
      entidadeexecutora: {
        codEntExec: projeto.entidadeexecutora?.codEntExec,
        nome: projeto.entidadeexecutora?.nome,
      },
    }
  })

  return projetosComMedia
}
