import prisma from '../../../lib/prisma'

export async function listarPropriedades() {
  return await prisma.propriedade.findMany()
}
