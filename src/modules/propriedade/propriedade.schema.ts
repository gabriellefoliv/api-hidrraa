import z from 'zod'

export const propriedadeSchemas = {
    create: {
        body: z.object({
            logradouro: z.string(),
            numero: z.number(),
            complemento: z.string(),
            cep: z.string(),
            bairro: z.string(),
            cidade: z.string(),
            uf: z.string(),
            CodMicroBacia: z.number(),
            codProdutor: z.number(),
        }),
        response: {
            201: z.object({
                propriedadeId: z.number(),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    update: {
        params: z.object({
            codPropriedade: z.coerce.number(),
        }),
        body: z.object({
            logradouro: z.string(),
            numero: z.number(),
            complemento: z.string(),
            cep: z.string(),
            bairro: z.string(),
            cidade: z.string(),
            uf: z.string(),
            codProdutor: z.number(),
            CodMicroBacia: z.number(),
        }),
        response: {
            200: z.object({
                propriedade: z.object({
                    codPropriedade: z.number(),
                    logradouro: z.string(),
                    complemento: z.string(),
                    numero: z.number(),
                    cep: z.string(),
                    bairro: z.string(),
                    cidade: z.string(),
                    uf: z.string(),
                    codProdutor: z.number(),
                    CodMicroBacia: z.number(),
                }),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    delete: {
        params: z.object({
            codPropriedade: z.coerce.number(),
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
                    codPropriedade: z.number(),
                    logradouro: z.string(),
                    numero: z.number(),
                    complemento: z.string(),
                    cep: z.string(),
                    bairro: z.string(),
                    cidade: z.string(),
                    uf: z.string(),
                    codProdutor: z.number(),
                    CodMicroBacia: z.number(),
                })
            ),
            409: z.object({
                error: z.string(),
            }),
        },
    },
}
