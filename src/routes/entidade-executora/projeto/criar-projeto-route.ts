import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarProjeto } from '../../../functions/entidade-executora/projeto/criar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

const marcoSchema = z.object({
  codMarcoRecomendado: z.number(),
  descricao: z.string().optional().nullable(),
  descrDetAjustes: z.string().optional().nullable(),
  valorEstimado: z.number().optional().nullable(),
  dataConclusao: z
    .union([z.coerce.date(), z.literal('').transform(() => null)])
    .optional()
    .nullable(),
})

export const criarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/projetos',
    {
      preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
      schema: {
        summary: 'Criar novo projeto',
        tags: ['Projeto'],
        body: z.object({
          titulo: z.string().optional().nullable(),
          objetivo: z.string().optional().nullable(),
          acoes: z.string().optional().nullable(),
          cronograma: z.string().optional().nullable(),
          orcamento: z.number().optional().nullable(),
          codPropriedade: z.number(),
          CodMicroBacia: z.number(),
          codTipoProjeto: z.number(),
          CodEntExec: z.number(),
          marcos: z.array(marcoSchema),
        }),
        response: {
          201: z.object({
            mensagem: z.string(),
            projetoId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        titulo,
        objetivo,
        acoes,
        cronograma,
        orcamento,
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia,
        CodEntExec,
        marcos,
      } = request.body

      const resultado = await criarProjeto({
        titulo: titulo ?? '',
        objetivo: objetivo ?? '',
        acoes: acoes ?? '',
        cronograma: cronograma ?? '',
        orcamento: orcamento ?? 0,
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia,
        CodEntExec,
        marcos: marcos.map(marco => ({
          codMarcoRecomendado: marco.codMarcoRecomendado,
          descricao: marco.descricao ?? '',
          descrDetAjustes: marco.descrDetAjustes ?? '',
          valorEstimado: marco.valorEstimado ?? 0,
          dataConclusao: marco.dataConclusao ?? new Date(),
        })),
      })

      return reply.status(201).send(resultado)
    }
  )
}
