import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsync } from 'fastify'
import sharp from 'sharp'
import { enviarRelatorio } from '../../functions/ent-ger/enviar-relatorio'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const uploadRelatorioRoute: FastifyPluginAsync = async app => {
  app.post('/api/relatorios/upload', {
    preHandler: verificarPermissao([Perfil.ENT_GER]),
    handler: async (request, reply) => {
      const parts = request.parts()

      let codProjeto: number | null = null
      let codExecucaoMarco: number | null = null
      let codEntGer: number | null = null
      const files: Array<{ filename: string; filepath: string }> = []

      for await (const part of parts) {
        if (part.type === 'file') {
          if (!codProjeto || !codExecucaoMarco || !codEntGer) {
            return reply
              .status(400)
              .send({ error: 'Informações incompletas antes do arquivo' })
          }

          const ext = path.extname(part.filename).toLowerCase()
          const fileId = randomUUID()
          const fileName = `${fileId}${ext}`
          const uploadDir = path.resolve(
            'uploads',
            String(codProjeto),
            String(codExecucaoMarco),
            'relatorios'
          )
          await fs.promises.mkdir(uploadDir, { recursive: true })
          const filePath = path.join(uploadDir, fileName)

          // salva direto (sem compressão de imagem, já que relatório pode ser PDF/Word/etc)
          await pipeline(part.file as Readable, fs.createWriteStream(filePath))

          // salva no banco
          await enviarRelatorio({
            codProjeto,
            codExecucaoMarco,
            filePath: path.relative('uploads', filePath),
            codEntGer,
          })

          files.push({ filename: part.filename, filepath: filePath })
        } else {
          const value = part.value
          switch (part.fieldname) {
            case 'codProjeto':
              codProjeto = Number(value)
              break
            case 'codExecucaoMarco':
              codExecucaoMarco = Number(value)
              break
            case 'codEntGer':
              codEntGer = Number(value)
              break
          }
        }
      }

      return reply.send({
        message: 'Relatório enviado com sucesso',
        arquivos: files,
      })
    },
  })
}
