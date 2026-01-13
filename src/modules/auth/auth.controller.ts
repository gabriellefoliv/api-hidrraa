import { authService } from './auth.service'

export const loginHandler = async (request: any, reply: any) => {
    try {
        const { email, senha } = request.body
        const { codUsuario, nome, perfil, codCBH } = await authService.login({ email, senha })
        const token = request.server.jwt.sign({ codUsuario, perfil })
        return reply.status(200).send({
            token,
            usuario: { codUsuario, nome, email, perfil, codCBH },
        })
    } catch (error: any) {
        return reply.status(401).send({ error: error.message || 'Erro durante o login.' })
    }
}

export const cadastrarEntExecHandler = async (request: any, reply: any) => {
    try {
        const { codUsuario } = await authService.cadastrarEntidadeExecutora(request.body)
        return reply.status(201).send({ codUsuario })
    } catch (error: any) {
        if (error.message === 'Usuário já existe no sistema.') {
            return reply.status(409).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Erro do servidor.' })
    }
}

export const cadastrarEntGerHandler = async (request: any, reply: any) => {
    try {
        const { codUsuario } = await authService.cadastrarEntidadeGerenciadora(request.body)
        return reply.status(201).send({ codUsuario })
    } catch (error: any) {
        if (error.message === 'Usuário já existe no sistema.') {
            return reply.status(409).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Erro do servidor.' })
    }
}

export const cadastrarInvestidorHandler = async (request: any, reply: any) => {
    try {
        const { codUsuario } = await authService.cadastrarInvestidor(request.body)
        return reply.status(201).send({ codUsuario })
    } catch (error: any) {
        if (error.message === 'Usuário já existe no sistema.') {
            return reply.status(409).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Erro do servidor.' })
    }
}

export const listarEntExecsHandler = async (request: any, reply: any) => {
    const list = await authService.listarEntExecs()
    return reply.status(200).send(list)
}

export const listarEntGersHandler = async (request: any, reply: any) => {
    const list = await authService.listarEntGers()
    return reply.status(200).send(list)
}

export const buscarEntGerHandler = async (request: any, reply: any) => {
    const { codUsuario } = request.params
    const ent = await authService.buscarEntGerPorCodUsuario(codUsuario)
    if (!ent) return reply.status(404).send({ error: 'Entidade não encontrada.' })
    return reply.status(200).send(ent)
}

export const buscarInvestidorHandler = async (request: any, reply: any) => {
    const { codUsuario } = request.params
    const inv = await authService.buscarInvestidorPorCodUsuario(codUsuario)
    if (!inv) return reply.status(404).send({ error: 'Investidor não encontrado.' })
    return reply.status(200).send(inv)
}
