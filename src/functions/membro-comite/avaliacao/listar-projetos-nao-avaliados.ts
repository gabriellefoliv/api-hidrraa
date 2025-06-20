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
    },
    select: {
      codProjeto: true,
      titulo: true,
      objetivo: true,
      acoes: true,
      cronograma: true,
      orcamento: true,
      tipo_projeto: {
        select: {
          nome: true,
          descricao: true,
          marco_recomendado: {
            include: {
              execucao_marco: {
                select: {
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
      entidadeexecutora: {
        select: {
          nome: true,
        },
      },
      microbacia: {
        select: {
          Nome: true,
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
