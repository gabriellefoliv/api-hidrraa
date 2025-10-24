import prisma from '../../lib/prisma'

interface ListarEvidenciasComSolicitacoesParams {
  codProjeto: number
}

export function listarEvidenciasComSolicitacoes({
  codProjeto,
}: ListarEvidenciasComSolicitacoesParams) {
  return prisma.projeto.findFirst({
    where: {
      codProjeto,
      execucao_marco: {
        some: {
          bc_statusValidacaoCBH: 'APROVADO',
          evidencia_apresentada: { some: {} },
          pagto_marco_concluido: { some: {} },
        },
      },
    },
    select: {
      titulo: true,
      objetivo: true,
      cronograma: true,
      acoes: true,
      orcamento: true,
      dataSubmissao: true,
      execucao_marco: {
        where: {
          bc_statusValidacaoCBH: 'APROVADO',
          evidencia_apresentada: { some: {} },
          pagto_marco_concluido: { some: {} },
        },
        select: {
          codExecucaoMarco: true,
          descricao: true,
          valorEstimado: true,
          bc_statusValidacaoCBH: true,
          descrDetAjustes: true,
          dataConclusaoEfetiva: true,
          evidencia_apresentada: {
            select: {
              codEvidenciaApresentada: true,
              caminhoArquivo: true,
              dataUpload: true,
              codEvidenciaDemandada: true,
            },
            orderBy: { dataUpload: 'desc' },
          },
          relatorio_gerenciadora: {
            select: {
              codRelGer: true,
              caminhoArquivo: true,
              dataUpload: true,
            },
            orderBy: { dataUpload: 'desc' },
          },
          pagto_marco_concluido: {
            select: {
              codPagtoMarco: true,
              bc_data: true,
              bc_valor: true,
              codExecucaoMarco: true,
              CodEntExec: true,
              transacoes: {
                select: {
                  codTransacao: true,
                  hash: true,
                  status: true,
                  valor: true,
                  data: true,
                },
              },
            },
          },
          pagto_servico: {
            select: {
              codPagtoServico: true,
              valor: true,
              docNF: true,
              data: true,
            },
            orderBy: { data: 'asc' },
          },
        },
        orderBy: { dataConclusaoEfetiva: 'desc' },
      },
    },
  })
}
