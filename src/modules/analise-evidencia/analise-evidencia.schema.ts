import z from 'zod'

export const analiseEvidenciaSchemas = {
    validarEvidencias: {
        params: z.object({
            codExecucaoMarco: z.coerce.number(),
        }),
        response: {
            200: z.object({ message: z.string() }),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        }
    },

    listarProjetosComEvidencias: {
        response: {
            200: z.array(z.object({
                codProjeto: z.number(),
                titulo: z.string().nullable(),
            }).passthrough())
        }
    },

    listarMarcosCompletos: {
        params: z.object({
            codProjeto: z.coerce.number(),
        }),
        response: {
            200: z.array(z.object({
                codExecucaoMarco: z.number(),
                descricao: z.string().nullable(),
                bc_statusValidacaoCBH: z.string().nullable(),
                dataConclusaoEfetiva: z.coerce.date().nullable(),
                evidencia_apresentada: z.array(z.any()),
                relatorio_gerenciadora: z.array(z.any()),
            })),
            404: z.object({ error: z.string() }),
        }
    },

    listarMarcosAvaliados: {
        params: z.object({
            codProjeto: z.coerce.number(),
        }),
        response: {
            200: z.object({
                titulo: z.string().nullable(),
            }).passthrough(),
            404: z.object({ error: z.string() }),
        }
    }
}
