import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsync } from 'fastify'
import sharp from 'sharp'
import { apresentarEvidencia } from '../../../functions/entidade-executora/execucao-marco/apresentar-evidencia'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const uploadEvidenciaRoute: FastifyPluginAsync = async app => {
  app.post('/api/evidencias/upload', {
    preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
    handler: async (request, reply) => {
      const parts = request.parts()

      let codProjeto: number | null = null
      let codExecucaoMarco: number | null = null
      let codEvidenciaDemandada: number | null = null
      let tipo: 'fotos' | 'documentos' | null = null
      const files: Array<{ filename: string; filepath: string }> = []

      for await (const part of parts) {
        if (part.type === 'file') {
          if (!tipo || !codProjeto || !codExecucaoMarco) {
            return reply
              .status(400)
              .send({ error: 'Informações incompletas antes do arquivo' })
          }

          const ext = path.extname(part.filename).toLowerCase()
          const fileId = randomUUID()

          // Define o nome e o caminho do arquivo
          const fileName = `${fileId}${ext}`
          const uploadDir = path.resolve(
            'uploads',
            String(codProjeto),
            String(codExecucaoMarco),
            tipo
          )
          await fs.promises.mkdir(uploadDir, { recursive: true })
          const filePath = path.join(uploadDir, fileName)

          let fileStream: Readable

          if (tipo === 'fotos' && (ext === '.jpg' || ext === '.jpeg')) {
            // Se for JPG, comprime com qualidade 80
            const compressedImageBuffer = await sharp(await part.toBuffer())
              .jpeg({ quality: 80, mozjpeg: true })
              .toBuffer()
            fileStream = Readable.from(compressedImageBuffer)
          } else if (tipo === 'fotos' && ext === '.png') {
            // Se for PNG, usa a compressão sem perdas (lossless)
            const compressedImageBuffer = await sharp(await part.toBuffer())
              .png({ quality: 90, compressionLevel: 9 })
              .toBuffer()
            fileStream = Readable.from(compressedImageBuffer)
          } else {
            // Se não for foto ou não for um formato suportado, salva o arquivo original
            fileStream = part.file as Readable
          }

          // Salva o arquivo no disco
          await pipeline(fileStream, fs.createWriteStream(filePath))

          // Salvar evidência no banco
          await apresentarEvidencia({
            codProjeto,
            codExecucaoMarco,
            codEvidenciaDemandada: codEvidenciaDemandada ?? 0,
            tipo,
            filePath: path.relative('uploads', filePath), // caminho relativo
          })

          files.push({ filename: part.filename, filepath: filePath })
        } else {
          // Campos do formulário
          const value = part.value
          switch (part.fieldname) {
            case 'codProjeto':
              codProjeto = Number(value)
              break
            case 'codExecucaoMarco':
              codExecucaoMarco = Number(value)
              break
            case 'codEvidenciaDemandada':
              codEvidenciaDemandada = Number(value)
              break
            case 'tipo':
              if (value === 'fotos' || value === 'documentos') {
                tipo = value
              }
              break
          }
        }
      }

      return reply.send({ message: 'Upload concluído', arquivos: files })
    },
  })
}
