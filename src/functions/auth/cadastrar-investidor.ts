import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface InvestidorSignUpParams {
  nome: string
  email: string
  senha: string
  razaoSocial: string
  codCBH: number
  cnpj: number
  contato: number
}

export async function cadastrarInvestidor({
  nome,
  email,
  senha,
  codCBH,
  cnpj,
  contato,
  razaoSocial,
}: InvestidorSignUpParams) {
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
      Perfil: 'investidor',
    },
  })

  await prisma.investidor_esg.create({
    data: {
      razaoSocial,
      cnpj,
      contato,
    },
  })

  return {
    codUsuario: usuario.codUsuario,
  }
}
