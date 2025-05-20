import prisma from '../../../lib/prisma'

export async function listarTiposProjeto() {
  return await prisma.tipo_projeto.findMany({
    include: {
      marco_recomendado: {
        include: {
          evidencia_demandada: true,
        },
      },
    },
  })
}
