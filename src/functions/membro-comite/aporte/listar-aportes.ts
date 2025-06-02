import prisma from '../../../lib/prisma'

export async function listarAportes() {
  return await prisma.aporte.findMany()
}
