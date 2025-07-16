import prisma from '../../../lib/prisma'

interface BuscarProjetoParams {
  codProjeto: number
}

export async function buscarProjetoExecutavel({
  codProjeto,
}: BuscarProjetoParams) {
  const projeto = await prisma.projeto.findUnique({
    where: {
      codProjeto,
    },
    include: {
      tipo_projeto: {
        include: {
          marco_recomendado: {
            include: {
              execucao_marco: {
                select: {
                  codExecucaoMarco: true,
                  codMarcoRecomendado: true,
                  descricao: true,
                  valorEstimado: true,
                  dataConclusaoPrevista: true,
                  codProjeto: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!projeto) {
    throw new Error('Projeto não encontrado.')
  }
  const execucaoMarcos = projeto.tipo_projeto.marco_recomendado.flatMap(marco =>
    marco.execucao_marco
      .filter(exec => exec.codProjeto === projeto.codProjeto)
      .map(exec => ({
        codExecucaoMarco: exec.codExecucaoMarco,
        codMarcoRecomendado: marco.codMarcoRecomendado,
        descricao: exec.descricao,
        valorEstimado: exec.valorEstimado,
        dataConclusaoPrevista: exec.dataConclusaoPrevista,
      }))
  )

  const projetoFormatado = {
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
      execucao_marcos: execucaoMarcos,
    },
  }

  return projetoFormatado
}
