import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosAprovados } from '../../../functions/ent-del-tec/projeto/listar-projetos-aprovados'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosAprovadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/projetos/aprovados',
      {
        preHandler: verificarPermissao([
          Perfil.ENT_DEL_TEC,
          Perfil.ENTIDADE_EXECUTORA,
          Perfil.ENT_GER,
        ]),
        schema: {
          summary: 'Listar projetos aprovados por entidade',
          tags: ['Projeto'],
          // O schema de resposta agora reflete a estrutura de dados limpa e formatada
          response: {
            200: z.array(
              z
                .object({
                  codProjeto: z.number(),
                  titulo: z.string().nullable(),
                  // ... outros campos do projeto
                  orcamento: z.number().nullable(),
                  dataSubmissao: z.coerce.date().nullable(),
                  entidadeexecutora: z.object({ nome: z.string() }).nullable(),
                  entidade_gerenciadora: z
                    .object({ nome: z.string() })
                    .nullable(),
                  tipo_projeto: z.object({
                    codTipoProjeto: z.number(),
                    nome: z.string(),
                    descricao: z.string(),
                    // A resposta final terá um array 'execucao_marcos' achatado e filtrado
                    execucao_marcos: z.array(
                      z.object({
                        codMarcoRecomendado: z.number(),
                        descricao: z.string(),
                        valorEstimado: z.number(),
                        dataConclusaoPrevista: z.coerce.date(),
                      })
                    ),
                  }),
                })
                .passthrough() // Permite outros campos não definidos no schema
            ),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { codUsuario, perfil } = request.user as {
          codUsuario: number
          perfil: string
        }
        if (!codUsuario) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        try {
          // 1. Busca os dados "crus" da sua function
          const projetos = await listarProjetosAprovados({ codUsuario, perfil })

          // --- PONTO DA CORREÇÃO ---
          // 2. Transforma os dados para o formato que o frontend precisa
          const formattedProjetos = projetos.map(proj => ({
            ...proj, // Copia todos os campos base do projeto
            tipo_projeto: {
              ...proj.tipo_projeto, // Copia os campos de tipo_projeto
              // Cria o array 'execucao_marcos' filtrando e achatando os dados
              execucao_marcos:
                proj.tipo_projeto?.marco_recomendado?.flatMap(marco =>
                  marco.execucao_marco
                    // AQUI ESTÁ O FILTRO: pega apenas marcos deste projeto
                    .filter(execucao => execucao.codProjeto === proj.codProjeto)
                    .map(m => ({
                      codMarcoRecomendado: marco.codMarcoRecomendado,
                      descricao: m.descricao ?? '',
                      valorEstimado: m.valorEstimado ?? 0,
                      dataConclusaoPrevista:
                        m.dataConclusaoPrevista ?? new Date(0),
                    }))
                ) ?? [],
            },
          }))

          // 3. Envia os dados já formatados e limpos
          return reply.status(200).send(formattedProjetos)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (error: any) {
          return reply
            .status(404)
            .send({ error: error.message || 'Erro ao buscar projetos.' })
        }
      }
    )
  }
