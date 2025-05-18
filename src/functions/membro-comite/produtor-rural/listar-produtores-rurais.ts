import prisma from '../../../lib/prisma'

export async function listarProdutoresRurais() {
  return await prisma.produtor_rural.findMany()
}
