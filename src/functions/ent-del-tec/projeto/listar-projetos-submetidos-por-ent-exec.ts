import prisma from '../../../lib/prisma'

export async function listarProjetosSubmetidosPorEntExec() {
  const projetos = await prisma.projeto.findMany({
    where: {
      dataSubmissao: {
        not: null,
      },
    },
    include: {
      entidadeexecutora: true,
      entidade_gerenciadora: true,
      tipo_projeto: true,
      microbacia: true,
    },
    orderBy: {
      dataSubmissao: 'desc',
    },
  })

  const projetosFormatados = await Promise.all(
    projetos.map(async projeto => {
      const execucaoMarcos = await prisma.execucao_marco.findMany({
        where: {
          codProjeto: projeto.codProjeto,
        },
        select: {
          descricao: true,
          valorEstimado: true,
          dataConclusaoPrevista: true,
        },
      })

      return {
        codProjeto: projeto.codProjeto,
        titulo: projeto.titulo,
        objetivo: projeto.objetivo,
        acoes: projeto.acoes,
        cronograma: projeto.cronograma,
        orcamento: projeto.orcamento,
        dataSubmissao: projeto.dataSubmissao,
        codPropriedade: projeto.codPropriedade,
        CodMicroBacia: projeto.CodMicroBacia,
        entidadeexecutora: projeto.entidadeexecutora
          ? {
              codEntExec: projeto.entidadeexecutora.codEntExec,
              nome: projeto.entidadeexecutora.nome,
            }
          : null,
        entidade_gerenciadora: projeto.entidade_gerenciadora
          ? {
              codEntGer: projeto.entidade_gerenciadora.codEntGer,
              nome: projeto.entidade_gerenciadora.nome,
            }
          : null,
        tipo_projeto: {
          codTipoProjeto: projeto.tipo_projeto.codTipoProjeto,
          nome: projeto.tipo_projeto.nome,
          descricao: projeto.tipo_projeto.descricao,
          execucao_marcos: execucaoMarcos, // só os do projeto atual
        },
        microbacia: {
          codMicroBacia: projeto.microbacia?.CodMicroBacia,
          nome: projeto.microbacia?.Nome,
        },
      }
    })
  )
  return projetosFormatados
}
