import prisma from '../../../lib/prisma'

export async function listarProjetosNaoAvaliados() {
  const projetos = await prisma.projeto.findMany({
    where: {
      dataSubmissao: {
        not: null,
      },
      avaliacao: {
        none: {},
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
    },
    orderBy: {
      titulo: 'asc',
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
  }))

  return projetosFiltrados
}
