import prisma from '../../../lib/prisma'

interface SubmeterProjetoParams {
  codProjeto: number
}

export async function submeterProjeto({ codProjeto }: SubmeterProjetoParams) {
  const projeto = await prisma.projeto.findUnique({
    where: { codProjeto },
  })

  if (!projeto || projeto.dataSubmissao) {
    throw new Error('Projeto não encontrado ou já submetido.')
  }

  await prisma.projeto.update({
    where: { codProjeto },
    data: {
      dataSubmissao: new Date(),
    },
  })

  return { mensagem: 'Projeto submetido com sucesso.' }
}
