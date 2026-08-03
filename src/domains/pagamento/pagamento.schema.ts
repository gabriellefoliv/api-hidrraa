import z from 'zod'

export const pagamentoSchemas = {
    confirmarPagamento: {
        params: z.object({ codPagtoMarco: z.coerce.number() }),
        response: {
            200: z.object({
                message: z.string(),
                transacao: z.object({ hash: z.string() }).or(z.any()),
                alocacoes: z.array(z.object({ codAporte: z.number(), valor: z.number() })).optional()
            })
        }
    },

    listarProjetos: {
        response: {
            200: z.array(z.any())
        }
    },

    listarEvidencias: {
        params: z.object({ codProjeto: z.coerce.number() }),
        response: {
            200: z.any(),
            404: z.object({ error: z.string() })
        }
    },

    getTransacao: {
        params: z.object({ codPagtoMarco: z.coerce.number() }),
        response: {
            200: z.any()
        }
    }
}
