import z from 'zod'

export const projetoSchemas = {
    listarAprovados: {
        response: {
            200: z.array(
                z.object({
                    codProjeto: z.number(),
                    titulo: z.string().nullable(),
                    objetivo: z.string().nullable(),
                    acoes: z.string().nullable(),
                    cronograma: z.string().nullable(),
                    orcamento: z.number().nullable(),
                    dataSubmissao: z.coerce.date().nullable(),
                    entidadeexecutora: z.object({ nome: z.string() }).nullable().optional(),
                    entidade_gerenciadora: z.object({ nome: z.string() }).nullable().optional(),
                    tipo_projeto: z.object({
                        codTipoProjeto: z.number(),
                        nome: z.string(),
                        descricao: z.string(),
                        execucao_marcos: z.array(
                            z.object({
                                codMarcoRecomendado: z.number(),
                                descricao: z.string(),
                                valorEstimado: z.number(),
                                dataConclusaoPrevista: z.coerce.date().nullable(),
                            })
                        ),
                    }),
                }).passthrough()
            ),
            404: z.object({
                error: z.string(),
            }),
        },
    },
    create: {
        body: z.object({
            titulo: z.any(),
            objetivo: z.any(),
            acoes: z.any(),
            cronograma: z.any(),
            orcamento: z.any(),
            codPropriedade: z.any(),
            codTipoProjeto: z.any(),
            CodMicroBacia: z.any(),
            marcos: z.any(),
            file: z.any().optional(),
        }).passthrough(),
        response: {
            201: z.any()
        }
    },
    update: {
        params: z.object({ codProjeto: z.coerce.number() }),
        body: z.any(),
        response: { 201: z.any() }
    },
    delete: {
        params: z.object({ codProjeto: z.coerce.number() }),
        response: { 201: z.any() }
    },
    get: {
        params: z.object({ codProjeto: z.coerce.number() }),
        response: { 200: z.any() }
    },
    listarDetalhesModelo: {
        params: z.object({ codTipoProjeto: z.coerce.number() }),
        response: { 200: z.any() }
    },
    getSaldo: {
        params: z.object({ codProjeto: z.coerce.number() }),
        response: {
            200: z.object({
                saldoDisponivel: z.number(),
                orcamentoTotal: z.number(),
                totalGasto: z.number()
            })
        }
    }
}
