import bcrypt from 'bcrypt'
import { authRepository } from './auth.repository'

export const authService = {
    login: async ({ email, senha }: any) => {
        const usuario = await authRepository.findUserByEmail(email)

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
    },

    cadastrarEntidadeExecutora: async (data: any) => {
        const { nome, email, senha, codCBH, cnpjcpf, contato, especialidade } = data
        const existing = await authRepository.findUserByEmail(email)
        if (existing) throw new Error('Usuário já existe no sistema.')

        const hashedPassword = await bcrypt.hash(senha, 10)

        return authRepository.createEntidadeExecutora(
            { nome, email, senha: hashedPassword, codCBH },
            { nome, cnpjcpf, contato, especialidade }
        )
    },

    cadastrarEntidadeGerenciadora: async (data: any) => {
        const { nome, email, senha, codCBH, cnpjcpf, contato } = data
        const existing = await authRepository.findUserByEmail(email)
        if (existing) throw new Error('Usuário já existe no sistema.')

        const hashedPassword = await bcrypt.hash(senha, 10)

        return authRepository.createEntidadeGerenciadora(
            { nome, email, senha: hashedPassword, codCBH },
            { nome, cnpjcpf, contato }
        )
    },

    cadastrarInvestidor: async (data: any) => {
        const { nome, email, senha, codCBH, cnpj, contato, razaoSocial } = data
        const existing = await authRepository.findUserByEmail(email)
        if (existing) throw new Error('Usuário já existe no sistema.')
        const hashedPassword = await bcrypt.hash(senha, 10)

        return authRepository.createInvestidor(
            { nome, email, senha: hashedPassword, codCBH },
            { cnpj, contato, razaoSocial }
        )
    },

    cadastrarEntDelTec: async (data: any) => {
        const { nome, email, senha, codCBH } = data
        const existing = await authRepository.findUserByEmail(email)
        if (existing) throw new Error('Usuário já existe no sistema.')
        const hashedPassword = await bcrypt.hash(senha, 10)

        return authRepository.createEntDelTec(
            { nome, email, senha: hashedPassword, codCBH }
        )
    },

    cadastrarEntDelFin: async (data: any) => {
        const { nome, email, senha, codCBH } = data
        const existing = await authRepository.findUserByEmail(email)
        if (existing) throw new Error('Usuário já existe no sistema.')
        const hashedPassword = await bcrypt.hash(senha, 10)

        return authRepository.createEntDelFin(
            { nome, email, senha: hashedPassword, codCBH }
        )
    },

    listarEntExecs: async () => {
        return authRepository.findAllEntExecs()
    },

    listarEntGers: async () => {
        return authRepository.findAllEntGers()
    },

    buscarEntGerPorCodUsuario: async (codUsuario: number) => {
        return authRepository.findEntGerByCodUsuario(codUsuario)
    },

    buscarInvestidorPorCodUsuario: async (codUsuario: number) => {
        const inv = await authRepository.findInvestidorByCodUsuario(codUsuario)
        if (!inv) return null
        return {
            ...inv,
            nome: inv.usuario.nome
        }
    }
}
