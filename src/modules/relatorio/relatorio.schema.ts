import z from 'zod'

export const relatorioSchemas = {
    listarEvidenciasSubmetidas: {
        params: z.object({
            codProjeto: z.coerce.number(),
            codExecucaoMarco: z.coerce.number(),
        }),
        response: {
            200: z.array(z.object({
                codExecucaoMarco: z.number(),
                descricao: z.string(),
                bc_statusValidacaoCBH: z.string().nullable(),
                dataConclusaoEfetiva: z.coerce.date().nullable(),
                evidencia_apresentada: z.array(z.any()),
                relatorio_gerenciadora: z.array(z.any()),
            }))
        }
    }
}
