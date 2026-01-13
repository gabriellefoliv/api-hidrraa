import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    createProdutorHandler,
    deleteProdutorHandler,
    listProdutoresHandler,
    updateProdutorHandler,
} from './produtor-rural.controller'
import { produtorRuralSchemas } from './produtor-rural.schema'

export const produtorRuralRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/produtores',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Criar Produtor Rural',
                tags: ['Produtor Rural'],
                ...produtorRuralSchemas.create,
            },
        },
        createProdutorHandler
    )

    app.put(
        '/api/produtores/:codProdutor',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Atualizar produtor rural',
                tags: ['Produtor Rural'],
                ...produtorRuralSchemas.update,
            },
        },
        updateProdutorHandler
    )

    app.delete(
        '/api/produtores/:codProdutor',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Deletar produtor rural',
                tags: ['Produtor Rural'],
                ...produtorRuralSchemas.delete,
            },
        },
        deleteProdutorHandler
    )

    app.get(
        '/api/produtores',
        {
            preHandler: verificarPermissao([
                Perfil.ENT_DEL_TEC,
                Perfil.ENTIDADE_EXECUTORA,
            ]),
            schema: {
                summary: 'Listar Produtores Rurais',
                tags: ['Produtor Rural'],
                ...produtorRuralSchemas.list,
            },
        },
        listProdutoresHandler
    )
}
