import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface MembroComiteSignUpParams {
  nome: string
  email: string
  senha: string
  codCBH: number
}

export async function cadastrarMembroComite({
  nome,
  email,
  senha,
  codCBH,
}: MembroComiteSignUpParams) {
  const existingUser = await prisma.usuario.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Usuário já existe no sistema.')
  }

  const hashedPassword = await bcrypt.hash(senha, 10)

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      codCBH,
      Perfil: 'membro_comite',
    },
  })

  await prisma.avaliador_cbh.create({
    data: {
      codCBH,
      codAvaliador: usuario.codUsuario,
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
