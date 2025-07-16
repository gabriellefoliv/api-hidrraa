import prisma from '../../../lib/prisma'

interface ListarProjetosSubmetidosPorEntExecParams {
  codUsuario: number
}

export async function listarProjetosSubmetidosPorEntExec({
  codUsuario,
}: ListarProjetosSubmetidosPorEntExecParams) {
  const entExec = await prisma.entidadeexecutora.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!entExec) {
    throw new Error(
      'Entidade executora não encontrada para o usuário informado.'
    )
  }

  const projetos = await prisma.projeto.findMany({
    where: {
      CodEntExec: entExec.codEntExec,
      dataSubmissao: {
        not: null,
      },
    },
    include: {
      entidadeexecutora: true,
      tipo_projeto: true,
      microbacia: true,
      avaliacao: {
        select: {
          bc_aprovado: true,
        },
      },
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
        CodEntExec: projeto.CodEntExec,
        tipo_projeto: {
          codTipoProjeto: projeto.tipo_projeto.codTipoProjeto,
          nome: projeto.tipo_projeto.nome,
          descricao: projeto.tipo_projeto.descricao,
          execucao_marcos: execucaoMarcos, // só os do projeto atual
        },
        avaliacao: {
          bc_aprovado: projeto.avaliacao?.[0]?.bc_aprovado ?? null,
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
