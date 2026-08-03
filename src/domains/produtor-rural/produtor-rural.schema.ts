import z from 'zod'

export const produtorRuralSchemas = {
    create: {
        body: z.object({
            nome: z.string(),
            cpf: z.string(),
            contato: z.string(),
            codCBH: z.number(),
        }),
        response: {
            201: z.object({
                produtorRuralId: z.number(),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    update: {
        params: z.object({
            codProdutor: z.coerce.number(),
        }),
        body: z.object({
            nome: z.string(),
            cpf: z.string(),
            contato: z.string(),
            codCBH: z.number(),
        }),
        response: {
            200: z.object({
                produtor: z.object({
                    codProdutor: z.number(),
                    nome: z.string(),
                    cpf: z.string(),
                    contato: z.string(),
                    codCBH: z.number(),
                }),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    delete: {
        params: z.object({
            codProdutor: z.coerce.number(),
        }),
        response: {
            200: z.object({
                message: z.string(),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    list: {
        response: {
            200: z.array(
                z.object({
                    codProdutor: z.number(),
                    nome: z.string(),
                    cpf: z.string(),
                    contato: z.string(),
                    codCBH: z.number(),
                })
            ),
            409: z.object({
                error: z.string(),
            }),
        },
    },
}
