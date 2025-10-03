import prisma from '../../lib/prisma'

export async function listarProjetosComSolicitacoes() {
  const projetos = await prisma.projeto.findMany({
    where: {
      execucao_marco: {
        some: {
          dataConclusaoEfetiva: {
            not: null,
          },
          pagto_marco_concluido: {
            some: {},
          },
        },
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
      microbacia: true,
      entidadeexecutora: true,
    },
    orderBy: {
      dataSubmissao: 'desc',
    },
  })

  // Filtrar execucao_marco para conter apenas os que pertencem ao projeto correto
  const projetosFiltrados = projetos.map(projeto => ({
    ...projeto,
    tipo_projeto: {
      ...projeto.tipo_projeto,
      marco_recomendado: projeto.tipo_projeto.marco_recomendado.map(marco => ({
        ...marco,
        execucao_marco: marco.execucao_marco.filter(
          execucao => execucao.codProjeto === projeto.codProjeto
        ),
      })),
    },
    microbacia: projeto.microbacia,
    entidadeexecutora: projeto.entidadeexecutora,
  }))

  return projetosFiltrados
}
