import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { solicitarFinanciamento } from '../../../functions/entidade-executora/execucao-marco/solicitar-financiamento'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

const servicoSchema = z.object({
  valor: z.coerce.number(),
  fileId: z.string(),
})

export const solicitarFinanciamentoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/financiamento/solicitar',
    {
      preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
      schema: {
        summary: 'Solicitar financiamento de marco com notas fiscais',
        tags: ['Financiamento'],
        response: {
          201: z.object({
            codPagtoMarco: z.number(),
          }),
          400: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const parts = request.parts()
      const { codUsuario } = request.user as { codUsuario: number }

      let codExecucaoMarco: number | null = null
      let codProjeto: number | null = null
      let valorSolicitado: number | null = null // NOVO CAMPO
      let servicosJSON: string | null = null

      type ServicoValidado = z.infer<typeof servicoSchema>
      let servicosValidados: ServicoValidado[] = []

      const tempFilePaths = new Map<string, string>()
      const allTempFilePaths: string[] = []

      try {
        for await (const part of parts) {
          if (part.type === 'file') {
            const tempDir = path.resolve('uploads', 'temp_notas_fiscais')
            await fs.promises.mkdir(tempDir, { recursive: true })

            const ext = path.extname(part.filename).toLowerCase()
            const tempFileName = `${randomUUID()}${ext}`
            const tempFilePath = path.join(tempDir, tempFileName)

            await pipeline(part.file, fs.createWriteStream(tempFilePath))

            tempFilePaths.set(part.fieldname, tempFilePath)
            allTempFilePaths.push(tempFilePath) // Para limpeza
          } else {
            const value = part.value as string
            switch (part.fieldname) {
              case 'codExecucaoMarco':
                codExecucaoMarco = Number(value)
                break
              case 'codProjeto':
                codProjeto = Number(value)
                break
              case 'valorSolicitado':
                valorSolicitado = Number(value)
                break
              case 'servicosJSON':
                servicosJSON = value
                try {
                  servicosValidados = z
                    .array(servicoSchema)
                    .parse(JSON.parse(servicosJSON))
                } catch (err) {
                  return reply
                    .status(400)
                    .send({ error: 'JSON de serviços inválido.' })
                }
                break
            }
          }
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (uploadError: any) {
        await cleanupFiles(allTempFilePaths)
        return reply
          .status(500)
          .send({ error: `Falha ao processar upload: ${uploadError.message}` })
      }

      if (
        !codExecucaoMarco ||
        !codProjeto ||
        !codUsuario ||
        !valorSolicitado ||
        !servicosValidados.length ||
        tempFilePaths.size === 0
      ) {
        await cleanupFiles(allTempFilePaths)
        return reply.status(400).send({
          error:
            'Informações incompletas. Todos os campos e pelo menos um arquivo são obrigatórios.',
        })
      }

      const finalFilePaths = new Map<string, string>()
      const servicosParaFuncao = []

      try {
        for (const servico of servicosValidados) {
          const fileId = servico.fileId
          const tempFilePath = tempFilePaths.get(fileId)

          if (!tempFilePath) {
            throw new Error(
              `Arquivo não recebido para o serviço com fileId ${fileId}`
            )
          }

          const finalDir = path.resolve(
            'uploads',
            'documentos_para_pagamentos',
            String(codProjeto),
            String(codExecucaoMarco)
          )
          await fs.promises.mkdir(finalDir, { recursive: true })

          const finalFileName = path.basename(tempFilePath)
          const finalFilePath = path.join(finalDir, finalFileName)

          await fs.promises.rename(tempFilePath, finalFilePath)

          const relativePath = path.relative('uploads', finalFilePath)
          finalFilePaths.set(fileId, relativePath)

          servicosParaFuncao.push({
            valor: servico.valor,
            docNFPath: relativePath,
          })
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (moveError: any) {
        await cleanupFiles(allTempFilePaths)
        await cleanupFiles(
          Array.from(finalFilePaths.values()).map(p =>
            path.resolve('uploads', p)
          )
        )
        return reply
          .status(500)
          .send({ error: `Falha ao mover arquivos: ${moveError.message}` })
      }

      try {
        const resultado = await solicitarFinanciamento({
          codExecucaoMarco,
          codUsuario,
          valorSolicitado, // Passa o valor total
          servicos: servicosParaFuncao,
        })
        return reply.status(201).send(resultado)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        await cleanupFiles(
          Array.from(finalFilePaths.values()).map(p =>
            path.resolve('uploads', p)
          )
        )
        return reply
          .status(400)
          .send({ error: error.message || 'Erro ao processar solicitação' })
      }
    }
  )
}

async function cleanupFiles(filePaths: string[]) {
  for (const filePath of filePaths) {
    await fs.promises.unlink(filePath).catch(console.error)
  }
}
