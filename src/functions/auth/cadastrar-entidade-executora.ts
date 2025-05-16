import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface EntExecSignUpParams {
  nome: string
  email: string
  senha: string
  codCBH: number
  cnpjcpf: number
  especialidade: string
  contato: number
}

export async function cadastrarEntidadeExecutora({
  nome,
  email,
  senha,
  codCBH,
  cnpjcpf,
  contato,
  especialidade,
}: EntExecSignUpParams) {
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
      Perfil: 'entidade_executora',
    },
  })

  await prisma.entidadeexecutora.create({
    data: {
      nome,
      cnpjcpf,
      especialidade,
      contato,
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
