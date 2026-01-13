import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    createPropriedadeHandler,
    deletePropriedadeHandler,
    listPropriedadesHandler,
    updatePropriedadeHandler,
} from './propriedade.controller'
import { propriedadeSchemas } from './propriedade.schema'

export const propriedadeRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/propriedades',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Criar propriedade',
                tags: ['Propriedade'],
                ...propriedadeSchemas.create,
            },
        },
        createPropriedadeHandler
    )

    app.put(
        '/api/propriedades/:codPropriedade',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Atualizar propriedade',
                tags: ['Propriedade'],
                ...propriedadeSchemas.update,
            },
        },
        updatePropriedadeHandler
    )

    app.delete(
        '/api/propriedades/:codPropriedade',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Deletar propriedade',
                tags: ['Propriedade'],
                ...propriedadeSchemas.delete,
            },
        },
        deletePropriedadeHandler
    )

    app.get(
        '/api/propriedades',
        {
            preHandler: verificarPermissao([
                Perfil.ENT_DEL_TEC,
                Perfil.ENTIDADE_EXECUTORA,
            ]),
            schema: {
                summary: 'Listar propriedades',
                tags: ['Propriedade'],
                ...propriedadeSchemas.list,
            },
        },
        listPropriedadesHandler
    )
}
