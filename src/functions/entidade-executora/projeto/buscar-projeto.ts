import prisma from '../../../lib/prisma'

interface BuscarProjetoParams {
  codProjeto: number
}

export async function buscarProjeto({ codProjeto }: BuscarProjetoParams) {
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
                  codMarcoRecomendado: true,
                  descricao: true,
                  valorEstimado: true,
                  dataConclusao: true,
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
        codMarcoRecomendado: marco.codMarcoRecomendado,
        descricao: exec.descricao,
        valorEstimado: exec.valorEstimado,
        dataConclusao: exec.dataConclusao,
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
