import prisma from '../../../lib/prisma'

export async function listarMicrobacias() {
  return await prisma.microbacia.findMany()
}
