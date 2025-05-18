import prisma from '../../../lib/prisma'

export async function listarTiposProjeto() {
  const tiposProjeto = await prisma.tipo_projeto.findMany()

  return { tiposProjeto }
}
