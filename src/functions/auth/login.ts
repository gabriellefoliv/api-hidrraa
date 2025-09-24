import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface LoginParams {
  email: string
  senha: string
}

export async function loginUsuario({ email, senha }: LoginParams) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  })

  if (!usuario) {
    throw new Error('Usuário não encontrado.')
  }

  if (!usuario.senha) {
    throw new Error('Senha não cadastrada.')
  }

  const isPasswordValid = await bcrypt.compare(senha, usuario.senha)

  if (!isPasswordValid) {
    throw new Error('Senha incorreta.')
  }

  return {
    codUsuario: usuario.codUsuario,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.Perfil,
    codCBH: usuario.codCBH,
  }
}
