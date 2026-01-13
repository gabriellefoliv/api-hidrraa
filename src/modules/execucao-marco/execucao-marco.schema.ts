import z from 'zod'

export const execucaoMarcoSchemas = {
    buscarProjetoExecutavel: {
        params: z.object({
            codProjeto: z.coerce.number(),
        }),
        response: {
            200: z.object({
                codProjeto: z.number(),
                titulo: z.string().optional(),
                objetivo: z.string().optional(),
                acoes: z.string().optional(),
                cronograma: z.string().optional(),
                orcamento: z.number().optional(),
                codPropriedade: z.number().nullable(),
                dataSubmissao: z.date().nullable().optional(),
                CodMicroBacia: z.number(),
                CodEntExec: z.number(),
                tipo_projeto: z.object({
                    codTipoProjeto: z.number(),
                    nome: z.string().optional(),
                    descricao: z.string().optional(),
                    execucao_marcos: z.array(z.object({
                        codExecucaoMarco: z.number(),
                        codMarcoRecomendado: z.number(),
                        descricao: z.string().optional(),
                        valorEstimado: z.number().optional(),
                        dataConclusaoPrevista: z.coerce.date().optional(),
                        dataConclusaoEfetiva: z.coerce.date().nullable().optional(),
                        evidenciasDemandadas: z.array(z.object({
                            codEvidenciaDemandada: z.number(),
                            descricao: z.string(),
                            tipoArquivo: z.string()
                        })).optional()
                    }))
                })
            }),
            404: z.object({ error: z.string() })
        }
    },
    submeterEvidencias: {
        body: z.object({
            codExecucaoMarco: z.coerce.number(),
        }),
        response: {
            200: z.object({ mensagem: z.string() }),
            404: z.object({ error: z.string() })
        }
    },
    uploadEvidencia: {
    },
    excluirEvidencia: {
        params: z.object({
            codEvidenciaApresentada: z.coerce.number(),
        }),
        response: {
            200: z.object({ mensagem: z.string() })
        }
    },
    listarEvidenciasPorMarco: {
        params: z.object({
            codProjeto: z.coerce.number(),
            codExecucaoMarco: z.coerce.number(),
        }),
        response: {
            200: z.object({
                codExecucaoMarco: z.number(),
                descricao: z.string().nullable(),
                dataConclusaoEfetiva: z.coerce.date().nullable(),
                bc_statusValidacaoCBH: z.string().nullable(),
                evidencia_apresentada: z.array(z.object({
                    codEvidenciaApresentada: z.number(),
                    caminhoArquivo: z.string(),
                    dataUpload: z.coerce.date(),
                    codEvidenciaDemandada: z.number(),
                })),
                relatorio_gerenciadora: z.array(z.object({
                    codRelGer: z.number(),
                    caminhoArquivo: z.string(),
                    dataUpload: z.coerce.date(),
                })),
            }),
            404: z.object({ error: z.string() })
        }
    },
    solicitarFinanciamento: {
        response: {
            201: z.object({
                codPagtoMarco: z.number(),
            }),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        }
    }
}
