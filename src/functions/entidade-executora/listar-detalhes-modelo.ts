import prisma from '../../lib/prisma'

interface ListarDetalhesModeloParams {
  codTipoProjeto: number
}

export async function listarDetalhesModelo({
  codTipoProjeto,
}: ListarDetalhesModeloParams) {
  return await prisma.tipo_projeto.findUnique({
    where: { codTipoProjeto },
    include: {
      marco_recomendado: {
        include: {
          evidencia_demandada: true,
        },
      },
    },
  })
}
