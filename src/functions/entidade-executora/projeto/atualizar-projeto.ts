import prisma from '../../../lib/prisma'

interface AtualizarProjetoParams {
  codProjeto: number
  titulo?: string
  objetivo?: string
  acoes?: string
  cronograma?: string
  orcamento?: number
  codPropriedade?: number
  codTipoProjeto?: number
  CodMicroBacia?: number
  marcos?: {
    codExecucaoMarco?: number
    codMarcoRecomendado: number
    descricao?: string
    descrDetAjustes?: string
    valorEstimado?: number
    dataConclusaoPrevista?: Date
  }[]
}

export async function atualizarProjeto(params: AtualizarProjetoParams) {
  const {
    codProjeto,
    titulo,
    objetivo,
    acoes,
    cronograma,
    orcamento,
    codPropriedade,
    codTipoProjeto,
    CodMicroBacia,
    marcos,
  } = params

  // Atualizar dados do projeto
  await prisma.projeto.update({
    where: { codProjeto },
    data: {
      ...(titulo !== undefined && { titulo }),
      ...(objetivo !== undefined && { objetivo }),
      ...(acoes !== undefined && { acoes }),
      ...(cronograma !== undefined && { cronograma }),
      ...(orcamento !== undefined && { orcamento }),
      ...(codPropriedade !== undefined && { codPropriedade }),
      ...(codTipoProjeto !== undefined && { codTipoProjeto }),
      ...(CodMicroBacia !== undefined && { CodMicroBacia }),
    },
  })

  if (marcos && marcos.length > 0) {
    for (const marco of marcos) {
      const {
        codMarcoRecomendado,
        descricao,
        descrDetAjustes,
        valorEstimado,
        dataConclusaoPrevista,
      } = marco

      await prisma.execucao_marco.upsert({
        where: {
          codProjeto_codMarcoRecomendado: {
            codProjeto,
            codMarcoRecomendado,
          },
        },
        update: {
          ...(descricao !== undefined && { descricao }),
          ...(descrDetAjustes !== undefined && { descrDetAjustes }),
          ...(valorEstimado !== undefined && { valorEstimado }),
          ...(dataConclusaoPrevista !== undefined && { dataConclusaoPrevista }),
        },
        create: {
          codProjeto,
          codMarcoRecomendado,
          descricao: descricao ?? '',
          descrDetAjustes: descrDetAjustes ?? '',
          valorEstimado: valorEstimado ?? 0,
          dataConclusaoPrevista: dataConclusaoPrevista ?? undefined,
        },
      })
    }
  }

  return { mensagem: 'Projeto atualizado com sucesso!' }
}
