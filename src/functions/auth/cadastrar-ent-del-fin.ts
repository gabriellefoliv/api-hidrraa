import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface EntidadeDelegatariaFinanceiraSignUpParams {
  nome: string
  email: string
  senha: string
  codCBH: number
}

export async function cadastrarEntidadeDelegatariaFinanceira({
  nome,
  email,
  senha,
  codCBH,
}: EntidadeDelegatariaFinanceiraSignUpParams) {
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
      Perfil: 'ent_del_fin',
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
