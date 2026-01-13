import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    createMicrobaciaHandler,
    deleteMicrobaciaHandler,
    listMicrobaciasHandler,
    updateMicrobaciaHandler,
} from './microbacia.controller'
import { microbaciaSchemas } from './microbacia.schema'

export const microbaciaRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/microbacias',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Criar microbacia',
                tags: ['Microbacia'],
                ...microbaciaSchemas.create,
            },
        },
        createMicrobaciaHandler
    )

    app.put(
        '/api/microbacias/:CodMicroBacia',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Atualizar microbacia',
                tags: ['Microbacia'],
                ...microbaciaSchemas.update,
            },
        },
        updateMicrobaciaHandler
    )

    app.delete(
        '/api/microbacias/:CodMicroBacia',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Deletar microbacia',
                tags: ['Microbacia'],
                ...microbaciaSchemas.delete,
            },
        },
        deleteMicrobaciaHandler
    )

    app.get(
        '/api/microbacias',
        {
            preHandler: verificarPermissao([
                Perfil.ENT_DEL_TEC,
                Perfil.ENTIDADE_EXECUTORA,
            ]),
            schema: {
                summary: 'Listar microbacias',
                tags: ['Microbacia'],
                ...microbaciaSchemas.list,
            },
        },
        listMicrobaciasHandler
    )
}
