import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface EntGerSignUpParams {
  nome: string
  email: string
  senha: string
  codCBH: number
  cnpjcpf: string
  contato: string
}

export async function cadastrarEntidadeGerenciadora({
  nome,
  email,
  senha,
  codCBH,
  cnpjcpf,
  contato,
}: EntGerSignUpParams) {
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
      Perfil: 'entidade_gerenciadora',
    },
  })

  await prisma.entidade_gerenciadora.create({
    data: {
      nome,
      cnpjcpf,
      contato,
      codUsuario: usuario.codUsuario,
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
