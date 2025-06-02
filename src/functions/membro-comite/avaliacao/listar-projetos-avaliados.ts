import prisma from '../../../lib/prisma'

export async function listarProjetosAvaliados() {
  const projetos = await prisma.projeto.findMany({
    where: {
      avaliacao: {
        some: {}, // Pelo menos uma avaliação
      },
    },
    select: {
      codProjeto: true,
      titulo: true,
      avaliacao: {
        select: {
          dataIni: true,
          dataFim: true,
          codAvaliador: true,
          bc_valorPagto: true,
          avaliacao_item: {
            select: {
              nota: true,
              criterio_aval: {
                select: {
                  peso: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      titulo: 'asc',
    },
  })

  // Calcular média ponderada de cada projeto
  const projetosComMedia = projetos.map(projeto => {
    const avaliacoes = projeto.avaliacao

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

    return {
      codProjeto: projeto.codProjeto,
      titulo: projeto.titulo,
      mediaPonderada,
    }
  })

  return projetosComMedia
}
