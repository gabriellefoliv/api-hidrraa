import prisma from '../../../lib/prisma'

export async function excluirProjeto(codProjeto: number) {
  const projeto = await prisma.projeto.findUnique({
    where: { codProjeto },
  })

  if (!projeto) {
    throw new Error('Projeto não encontrado')
  }

  await prisma.execucao_marco.deleteMany({
    where: { codProjeto },
  })

  await prisma.projeto.delete({
    where: { codProjeto },
  })

  return {
    mensagem: 'Projeto excluído com sucesso!',
  }
}
