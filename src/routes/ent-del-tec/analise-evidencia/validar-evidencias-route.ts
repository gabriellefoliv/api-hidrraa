import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ValidarEvidencias } from '../../../functions/ent-del-tec/analise-evidencia/validar-evidencias'
import prisma from '../../../lib/prisma'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const validarEvidenciasRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/api/marco/:codExecucaoMarco/validar',
    {
      preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
      schema: {
        summary: 'Validar evidências de um marco (com upload opcional)',
        tags: ['Evidência'],
        params: z.object({
          codExecucaoMarco: z.coerce.number(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codExecucaoMarco } = request.params
      const parts = request.parts()

      let status: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | null = null
      let comentario: string | undefined
      let caminhoArquivo: string | undefined
      let tempFilePath: string | undefined
      let fileProcessed = false

      try {
        for await (const part of parts) {
          if (part.type === 'file') {
            if (part.fieldname !== 'relatorioValidacao' || !part.filename) {
              continue
            }
            if (fileProcessed) {
              throw new Error(
                'Apenas um arquivo de relatório de validação é permitido.'
              )
            }

            const tempDir = path.resolve('uploads', 'temp_delegataria_marcos')
            await fs.promises.mkdir(tempDir, { recursive: true })
            const ext = path.extname(part.filename).toLowerCase()
            const tempFileName = `${randomUUID()}${ext}`
            tempFilePath = path.join(tempDir, tempFileName)

            await pipeline(part.file, fs.createWriteStream(tempFilePath))
            fileProcessed = true
          } else {
            const value = part.value as string
            switch (part.fieldname) {
              case 'status':
                if (['APROVADO', 'REPROVADO', 'PENDENTE'].includes(value)) {
                  status = value as 'APROVADO' | 'REPROVADO' | 'PENDENTE'
                } else {
                  throw new Error('Status de validação inválido.')
                }
                break
              case 'comentario':
                comentario = value
                break
            }
          }
        }
        if (!status) {
          throw new Error('O campo "status" é obrigatório.')
        }

        const marco = await prisma.execucao_marco.findUnique({
          where: { codExecucaoMarco },
          select: { codProjeto: true },
        })

        if (!marco) {
          throw new Error('Marco de execução não encontrado.')
        }
        const { codProjeto } = marco

        if (tempFilePath) {
          const finalDir = path.resolve(
            'uploads',
            'delegataria_marcos',
            String(codProjeto),
            String(codExecucaoMarco)
          )
          await fs.promises.mkdir(finalDir, { recursive: true })
          const finalFileName = path.basename(tempFilePath)
          const finalFilePath = path.join(finalDir, finalFileName)

          await fs.promises.rename(tempFilePath, finalFilePath)
          caminhoArquivo = path.relative('uploads', finalFilePath)
          tempFilePath = undefined
        }

        await ValidarEvidencias({
          codExecucaoMarco,
          status,
          comentario,
          caminhoArquivo,
        })

        return reply.send({ message: 'Validação atualizada com sucesso.' })
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (err: any) {
        // Limpeza em caso de erro
        if (tempFilePath) {
          await fs.promises.unlink(tempFilePath).catch(console.error)
        }
        if (caminhoArquivo) {
          await fs.promises
            .unlink(path.resolve('uploads', caminhoArquivo))
            .catch(console.error)
        }

        const errorMessage = err.message || 'Erro desconhecido'
        const statusCode = err.message.includes('não encontrado') ? 404 : 400
        return reply.status(statusCode).send({ error: errorMessage })
      }
    }
  )
}

// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import { z } from 'zod'
// import { ValidarEvidencias } from '../../../functions/ent-del-tec/analise-evidencia/validar-evidencias'
// import { Perfil, verificarPermissao } from '../../../middlewares/auth'

// export const validarEvidenciasRoute: FastifyPluginAsyncZod = async app => {
//   app.patch(
//     '/api/marco/:codExecucaoMarco/validar',
//     {
//       preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
//       schema: {
//         summary: 'Validar evidências de um marco',
//         tags: ['Evidência'],
//         body: z.object({
//           status: z.enum(['APROVADO', 'REPROVADO', 'PENDENTE']),
//           comentario: z.string().optional(),
//         }),
//         params: z.object({
//           codExecucaoMarco: z.coerce.number(),
//         }),
//         response: {
//           200: z.object({
//             message: z.string(),
//           }),
//           404: z.object({
//             error: z.string(),
//           }),
//         },
//       },
//     },
//     async (request, reply) => {
//       const { codExecucaoMarco } = request.params
//       const { status, comentario } = request.body

//       try {
//         await ValidarEvidencias({ codExecucaoMarco, status, comentario })
//         return reply.send({ message: 'Validação atualizada com sucesso.' })
//       } catch (err) {
//         const errorMessage =
//           typeof err === 'object' && err !== null && 'message' in err
//             ? String((err as { message: unknown }).message)
//             : 'Erro desconhecido'
//         return reply.status(404).send({ error: errorMessage })
//       }
//     }
//   )
// }
