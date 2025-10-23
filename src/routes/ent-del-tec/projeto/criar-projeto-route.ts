import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarProjeto } from '../../../functions/ent-del-tec/projeto/criar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

// Schema original para validar os marcos (vamos precisar dele)
const marcoSchema = z.object({
  codMarcoRecomendado: z.number(),
  descricao: z.string().optional().nullable(),
  descrDetAjustes: z.string().optional().nullable(),
  valorEstimado: z.number().optional().nullable(),
  dataConclusaoPrevista: z
    .union([z.coerce.date(), z.literal('').transform(() => null)])
    .optional()
    .nullable(),
})

export const criarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/projetos',
    {
      preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
      schema: {
        // ATENÇÃO: Removemos o schema 'body' daqui.
        // O fastify-type-provider-zod não pode validar um 'body'
        // quando a requisição é 'multipart/form-data'.
        // A validação terá que ser manual.
        summary: 'Criar novo projeto',
        tags: ['Projeto'],
        response: {
          201: z.object({
            mensagem: z.string(),
            projetoId: z.number(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // 1. Processar a requisição multipart
      const parts = request.parts()

      // Variáveis para guardar os dados do formulário
      let titulo: string | null = null
      let objetivo: string | null = null
      let acoes: string | null = null
      let cronograma: string | null = null
      let orcamento: number | null = null
      let codPropriedade: number | null = null
      let CodMicroBacia: number | null = null
      let codTipoProjeto: number | null = null
      let marcosJSON: string | null = null // Marcos virão como string JSON
      let caminhoArquivo: string | null = null // Caminho *relativo* do arquivo salvo

      for await (const part of parts) {
        if (part.type === 'file') {
          // 2. Salvar o arquivo em um diretório temporário
          if (!part.filename) {
            continue // Pula arquivos vazios
          }

          const ext = path.extname(part.filename).toLowerCase()
          const fileId = randomUUID()
          const fileName = `${fileId}${ext}`

          // Define o diretório temporário
          const uploadDir = path.resolve(
            'uploads',
            'temp_delegataria_projetos' // Pasta temporária
          )
          await fs.promises.mkdir(uploadDir, { recursive: true })
          const filePath = path.join(uploadDir, fileName)

          // Salva o arquivo no disco
          await pipeline(part.file, fs.createWriteStream(filePath))

          // Guarda o caminho *relativo* para passar para a função 'criarProjeto'
          caminhoArquivo = path.relative('uploads', filePath)
        } else {
          // Campos do formulário
          const value = part.value as string
          switch (part.fieldname) {
            case 'titulo':
              titulo = value
              break
            case 'objetivo':
              objetivo = value
              break
            case 'acoes':
              acoes = value
              break
            case 'cronograma':
              cronograma = value
              break
            case 'orcamento':
              orcamento = Number(value)
              break
            case 'codPropriedade':
              codPropriedade = Number(value)
              break
            case 'CodMicroBacia':
              CodMicroBacia = Number(value)
              break
            case 'codTipoProjeto':
              codTipoProjeto = Number(value)
              break
            case 'marcos':
              marcosJSON = value // Recebe o JSON como string
              break
          }
        }
      }

      // --- Validação Manual (substituindo o Zod do body) ---
      if (!codPropriedade || !CodMicroBacia || !codTipoProjeto || !marcosJSON) {
        // Se deu erro, e um arquivo foi salvo, remove o arquivo temporário
        if (caminhoArquivo) {
          await fs.promises
            .unlink(path.resolve('uploads', caminhoArquivo))
            .catch(console.error)
        }
        return reply.status(400).send({
          error:
            'Campos obrigatórios ausentes: codPropriedade, CodMicroBacia, codTipoProjeto, marcos',
        })
      }

      // Parse e validação dos 'marcos'
      let marcos: z.infer<typeof marcoSchema>[]
      try {
        // Usamos o 'marcoSchema' para validar o array de marcos
        const marcosArraySchema = z.array(marcoSchema)
        marcos = marcosArraySchema.parse(JSON.parse(marcosJSON))
      } catch (error) {
        if (caminhoArquivo) {
          await fs.promises
            .unlink(path.resolve('uploads', caminhoArquivo))
            .catch(console.error)
        }
        return reply.status(400).send({
          error:
            'Formato inválido para o campo "marcos". Esperado um JSON array válido.',
        })
      }

      // 3. Chamar a função 'criarProjeto' com os dados
      const resultado = await criarProjeto({
        titulo: titulo ?? '',
        objetivo: objetivo ?? '',
        acoes: acoes ?? '',
        cronograma: cronograma ?? '',
        orcamento: orcamento ?? 0,
        caminhoArquivo: caminhoArquivo ?? '', // 4. Passa o caminho temporário
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia,
        marcos: marcos.map(marco => ({
          codMarcoRecomendado: marco.codMarcoRecomendado,
          descricao: marco.descricao ?? '',
          descrDetAjustes: marco.descrDetAjustes ?? '',
          valorEstimado: marco.valorEstimado ?? 0,
          dataConclusaoPrevista: marco.dataConclusaoPrevista ?? new Date(),
        })),
      })

      // 5. A função 'criarProjeto' agora é responsável por mover o arquivo
      // de 'caminhoArquivo' (temporário) para o local final, usando o 'resultado.projetoId'.

      return reply.status(201).send(resultado)
    }
  )
}

// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import z from 'zod'
// import { criarProjeto } from '../../../functions/ent-del-tec/projeto/criar-projeto'
// import { Perfil, verificarPermissao } from '../../../middlewares/auth'

// const marcoSchema = z.object({
//   codMarcoRecomendado: z.number(),
//   descricao: z.string().optional().nullable(),
//   descrDetAjustes: z.string().optional().nullable(),
//   valorEstimado: z.number().optional().nullable(),
//   dataConclusaoPrevista: z
//     .union([z.coerce.date(), z.literal('').transform(() => null)])
//     .optional()
//     .nullable(),
// })

// export const criarProjetoRoute: FastifyPluginAsyncZod = async app => {
//   app.post(
//     '/api/projetos',
//     {
//       preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
//       schema: {
//         summary: 'Criar novo projeto',
//         tags: ['Projeto'],
//         body: z.object({
//           titulo: z.string().optional().nullable(),
//           objetivo: z.string().optional().nullable(),
//           acoes: z.string().optional().nullable(),
//           cronograma: z.string().optional().nullable(),
//           orcamento: z.number().optional().nullable(),
//           caminhoArquivo: z.string().optional().nullable(),
//           codPropriedade: z.number(),
//           CodMicroBacia: z.number(),
//           codTipoProjeto: z.number(),
//           marcos: z.array(marcoSchema),
//         }),
//         response: {
//           201: z.object({
//             mensagem: z.string(),
//             projetoId: z.number(),
//           }),
//         },
//       },
//     },
//     async (request, reply) => {
//       const {
//         titulo,
//         objetivo,
//         acoes,
//         cronograma,
//         orcamento,
//         caminhoArquivo,
//         codPropriedade,
//         codTipoProjeto,
//         CodMicroBacia,
//         marcos,
//       } = request.body

//       const resultado = await criarProjeto({
//         titulo: titulo ?? '',
//         objetivo: objetivo ?? '',
//         acoes: acoes ?? '',
//         cronograma: cronograma ?? '',
//         orcamento: orcamento ?? 0,
//         caminhoArquivo: caminhoArquivo ?? '',
//         codPropriedade,
//         codTipoProjeto,
//         CodMicroBacia,
//         marcos: marcos.map(marco => ({
//           codMarcoRecomendado: marco.codMarcoRecomendado,
//           descricao: marco.descricao ?? '',
//           descrDetAjustes: marco.descrDetAjustes ?? '',
//           valorEstimado: marco.valorEstimado ?? 0,
//           dataConclusaoPrevista: marco.dataConclusaoPrevista ?? new Date(),
//         })),
//       })

//       return reply.status(201).send(resultado)
//     }
//   )
// }
