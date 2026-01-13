import z from 'zod'

export const aporteSchemas = {
    createPaymentIntent: {
        body: z.object({
            amount: z.number().min(50),
        }),
        response: {
            201: z.object({ clientSecret: z.string() }),
            400: z.object({ error: z.string() }),
        },
    },
    listarAportesRealizados: {
        params: z.object({
            codInvestidor: z.coerce.number(),
        }),
        response: {
            200: z.array(
                z.object({
                    codAporte: z.number(),
                    dataInvestimento: z.date(),
                    bc_valor: z.number(),
                    validadoAGEVAP: z.boolean(),
                    codCBH: z.number(),
                    blockchain: z.object({
                        registrado: z.boolean(),
                        data: z.string().optional(),
                        hash: z.string().optional(),
                        explorerUrl: z.string().optional(),
                    }),
                })
            ),
            409: z.object({ error: z.string() }),
        },
    },
    listarAportes: {
        response: {
            200: z.array(
                z.object({
                    codAporte: z.number(),
                    dataInvestimento: z.date(),
                    bc_valor: z.number(),
                    validadoAGEVAP: z.boolean(),
                    codInvestidor: z.number(),
                    codCBH: z.number(),
                    investidor_esg: z.object({
                        razaoSocial: z.string(),
                    }),
                })
            ),
            404: z.object({ error: z.string() }),
        },
    },
    validarAporte: {
        params: z.object({
            codAporte: z.coerce.number(),
        }),
        response: {
            200: z.object({
                codAporte: z.number(),
                validadoAGEVAP: z.boolean(),
            }),
            404: z.object({ error: z.string() }),
        },
    },
    getRastreabilidade: {
        params: z.object({
            codAporte: z.coerce.number(),
        }),
        response: {
            200: z.object({
                codAporte: z.number(),
                valorTotal: z.number(),
                dataInvestimento: z.date(),
                txHashAporte: z.string().optional(),
                explorerUrlAporte: z.string().nullable().optional(),
                alocacoes: z.array(
                    z.object({
                        codAlocacao: z.number(),
                        valorAlocado: z.number(),
                        dataAlocacao: z.date(),
                        txHashAlocacao: z.string().nullable(),
                        projeto: z.object({
                            codProjeto: z.number(),
                            titulo: z.string().nullable(),
                            pagamentos: z.array(
                                z.object({
                                    codPagtoMarco: z.number(),
                                    valorPago: z.number(),
                                    dataPagamento: z.date(),
                                    marco: z.string(),
                                    txHashPagamento: z.string().optional(),
                                })
                            ),
                        }),
                    })
                ),
            }),
            404: z.object({ error: z.string() }),
        },
    },
}
