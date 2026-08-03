import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    buscarEntGerHandler,
    buscarInvestidorHandler,
    cadastrarEntExecHandler,
    cadastrarEntGerHandler,
    cadastrarInvestidorHandler,
    cadastrarEntDelTecHandler,
    cadastrarEntDelFinHandler,
    listarEntExecsHandler,
    listarEntGersHandler,
    loginHandler,
} from './auth.controller'
import { authSchemas } from './auth.schema'

export const authRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/login',
        {
            schema: {
                summary: 'Login de usuário',
                tags: ['Autenticação'],
                ...authSchemas.login,
            },
        },
        loginHandler
    )

    app.post(
        '/api/entExec/cadastro',
        {
            schema: {
                summary: 'Cadastro de Entidade Executora',
                tags: ['Autenticação'],
                ...authSchemas.cadastrarEntExec
            }
        },
        cadastrarEntExecHandler
    )

    app.post(
        '/api/entGer/cadastro',
        {
            schema: {
                summary: 'Cadastro de Entidade Gerenciadora',
                tags: ['Autenticação'],
                ...authSchemas.cadastrarEntGer
            }
        },
        cadastrarEntGerHandler
    )

    app.post(
        '/api/entDelTec/cadastro',
        {
            schema: {
                summary: 'Cadastro de Entidade Delegatária Técnica',
                tags: ['Autenticação'],
                ...authSchemas.cadastrarEntDelTec
            }
        },
        cadastrarEntDelTecHandler
    )

    app.post(
        '/api/entDelFin/cadastro',
        {
            schema: {
                summary: 'Cadastro de Entidade Delegatária Financeira',
                tags: ['Autenticação'],
                ...authSchemas.cadastrarEntDelFin
            }
        },
        cadastrarEntDelFinHandler
    )

    app.post(
        '/api/investidor/cadastro',
        {
            schema: {
                summary: 'Cadastro de Investidor',
                tags: ['Autenticação'],
                ...authSchemas.cadastrarInvestidor
            }
        },
        cadastrarInvestidorHandler
    )

    app.get(
        '/api/entExec',
        {
            preHandler: verificarPermissao([Perfil.ENT_GER, Perfil.ENT_DEL_TEC, Perfil.ENT_DEL_FIN, Perfil.INVESTIDOR]),
            schema: {
                summary: 'Listar Entidades Executoras',
                tags: ['Autenticação'],
                ...authSchemas.listarEntExecs
            }
        },
        listarEntExecsHandler
    )

    app.get(
        '/api/entGer',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Listar Entidades Gerenciadoras',
                tags: ['Autenticação'],
                ...authSchemas.listarEntGers
            }
        },
        listarEntGersHandler
    )

    app.get(
        '/api/entGer/:codUsuario',
        {
            preHandler: verificarPermissao([Perfil.ENT_GER, Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA]),
            schema: {
                summary: 'Buscar Entidade Gerenciadora por Usuário',
                tags: ['Autenticação'],
                ...authSchemas.buscarEntGer
            }
        },
        buscarEntGerHandler
    )

    app.get(
        '/api/investidor/:codUsuario',
        {
            preHandler: verificarPermissao([Perfil.INVESTIDOR, Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA]),
            schema: {
                summary: 'Buscar Investidor por Usuário',
                tags: ['Autenticação'],
                ...authSchemas.buscarInvestidor
            }
        },
        buscarInvestidorHandler
    )
}
