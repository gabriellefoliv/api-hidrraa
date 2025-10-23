import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { atualizarProjeto } from '../../../functions/ent-del-tec/projeto/atualizar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

// Schema para validar os marcos recebidos como JSON string
const marcoSchema = z.object({
  codExecucaoMarco: z.number().optional(),
  codMarcoRecomendado: z.number(),
  descricao: z.string().optional(),
  descrDetAjustes: z.string().optional(),
  valorEstimado: z.number().optional(),
  // O Zod vai validar a string, e nós converteremos para Date antes de chamar a função
  dataConclusaoPrevista: z.string().datetime().optional().nullable(),
})

// Schema para validar o array de marcos
const marcosArraySchema = z.array(marcoSchema)

export const atualizarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/projetos/:codProjeto',
    {
      preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
      schema: {
        summary: 'Atualizar projeto parcialmente',
        tags: ['Projeto'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        // ATENÇÃO: Removemos o 'body' do schema Zod.
        // Ele não funciona com multipart/form-data.
        // A validação será feita manualmente.
        response: {
          200: z.object({
            mensagem: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // 1. Obter o codProjeto ANTES de processar o formulário
      const { codProjeto } = request.params

      // Objeto para armazenar os dados de atualização
      // biome-ignore lint/suspicious/noExplicitAny: <Permitir 'any' para construção dinâmica>
      const dadosAtualizacao: { [key: string]: any } = {}
      let caminhoArquivo: string | null = null // Caminho relativo do novo arquivo
      let caminhoAbsolutoArquivo: string | null = null // Para cleanup em caso de erro

      try {
        const parts = request.parts()

        for await (const part of parts) {
          if (part.type === 'file') {
            // 2. Salvar o arquivo (se enviado)
            if (!part.filename) {
              continue
            }

            const ext = path.extname(part.filename).toLowerCase()
            const fileId = randomUUID()
            const fileName = `${fileId}${ext}`

            // 3. Salvar DIRETAMENTE no diretório final, pois já temos o codProjeto
            const uploadDir = path.resolve(
              'uploads',
              'delegataria_projetos',
              String(codProjeto)
            )
            await fs.promises.mkdir(uploadDir, { recursive: true })
            caminhoAbsolutoArquivo = path.join(uploadDir, fileName)

            // Salva o arquivo no disco
            await pipeline(
              part.file,
              fs.createWriteStream(caminhoAbsolutoArquivo)
            )

            // Guarda o caminho *relativo* para o banco
            caminhoArquivo = path.relative('uploads', caminhoAbsolutoArquivo)
            dadosAtualizacao.caminhoArquivo = caminhoArquivo
          } else {
            // 4. Processar campos de texto
            const value = part.value as string
            switch (part.fieldname) {
              case 'marcos':
                try {
                  const parsedMarcos = marcosArraySchema.parse(
                    JSON.parse(value)
                  )
                  // A função 'atualizarProjeto' espera que 'dataConclusaoPrevista' seja Date
                  dadosAtualizacao.marcos = parsedMarcos.map(marco => ({
                    ...marco,
                    dataConclusaoPrevista: marco.dataConclusaoPrevista
                      ? new Date(marco.dataConclusaoPrevista)
                      : undefined,
                  }))
                } catch (error) {
                  // Se o JSON dos marcos for inválido, retorna erro 400
                  return reply.status(400).send({
                    error:
                      'Formato inválido para o campo "marcos". Esperado um JSON array válido.',
                  })
                }
                break
              // Campos numéricos
              case 'orcamento':
              case 'codPropriedade':
              case 'codTipoProjeto':
              case 'CodMicroBacia':
                dadosAtualizacao[part.fieldname] = Number(value)
                break
              // Campos string
              case 'titulo':
              case 'objetivo':
              case 'acoes':
              case 'cronograma':
                dadosAtualizacao[part.fieldname] = value
                break
            }
          }
        }

        // 5. Chamar a função de atualização
        // A função 'atualizarProjeto' deve ser responsável por:
        // 1. Buscar o projeto antigo.
        // 2. Se 'dadosAtualizacao.caminhoArquivo' foi fornecido, DELETAR o arquivo antigo.
        // 3. Atualizar o projeto no banco com os novos 'dadosAtualizacao'.
        const resultado = await atualizarProjeto({
          codProjeto,
          ...dadosAtualizacao,
        })

        return reply.status(200).send(resultado)

        // biome-ignore lint/suspicious/noExplicitAny: <Captura de erro genérico>
      } catch (error: any) {
        // 6. Em caso de erro, deletar o arquivo que acabamos de salvar (se houver)
        if (caminhoAbsolutoArquivo) {
          await fs.promises.unlink(caminhoAbsolutoArquivo).catch(console.error)
        }

        return reply
          .status(404)
          .send({ error: error.message || 'Erro ao atualizar projeto' })
      }
    }
  )
}

// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import z from 'zod'
// import { atualizarProjeto } from '../../../functions/ent-del-tec/projeto/atualizar-projeto'
// import { Perfil, verificarPermissao } from '../../../middlewares/auth'

// const marcoSchema = z.object({
//   codExecucaoMarco: z.number().optional(),
//   codMarcoRecomendado: z.number(),
//   descricao: z.string().optional(),
//   descrDetAjustes: z.string().optional(),
//   valorEstimado: z.number().optional(),
//   dataConclusaoPrevista: z.string().datetime().optional(),
// })

// export const atualizarProjetoRoute: FastifyPluginAsyncZod = async app => {
//   app.put(
//     '/api/projetos/:codProjeto',
//     {
//       preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
//       schema: {
//         summary: 'Atualizar projeto parcialmente',
//         tags: ['Projeto'],
//         params: z.object({
//           codProjeto: z.coerce.number(),
//         }),
//         body: z.object({
//           titulo: z.string().optional(),
//           objetivo: z.string().optional(),
//           acoes: z.string().optional(),
//           cronograma: z.string().optional(),
//           orcamento: z.number().optional(),
//           caminhoArquivo: z.string().optional(),
//           codPropriedade: z.number().optional(),
//           codTipoProjeto: z.number().optional(),
//           CodMicroBacia: z.number().optional(),
//           marcos: z.array(marcoSchema).optional(),
//         }),
//         response: {
//           200: z.object({
//             mensagem: z.string(),
//           }),
//           401: z.object({
//             error: z.string(),
//           }),
//           404: z.object({
//             error: z.string(),
//           }),
//         },
//       },
//     },
//     async (request, reply) => {
//       const { codProjeto } = request.params

//       try {
//         const resultado = await atualizarProjeto({
//           codProjeto,
//           ...request.body,
//           marcos: request.body.marcos?.map(marco => ({
//             ...marco,
//             dataConclusaoPrevista: marco.dataConclusaoPrevista
//               ? new Date(marco.dataConclusaoPrevista)
//               : undefined,
//           })),
//         })

//         return reply.status(200).send(resultado)
//         // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//       } catch (error: any) {
//         return reply
//           .status(404)
//           .send({ error: error.message || 'Erro ao atualizar projeto' })
//       }
//     }
//   )
// }
