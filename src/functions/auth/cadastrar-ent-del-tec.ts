import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface EntidadeDelegatariaTecnicaSignUpParams {
  nome: string
  email: string
  senha: string
  codCBH: number
}

export async function cadastrarEntidadeDelegatariaTecnica({
  nome,
  email,
  senha,
  codCBH,
}: EntidadeDelegatariaTecnicaSignUpParams) {
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
      Perfil: 'ent_del_tec',
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
