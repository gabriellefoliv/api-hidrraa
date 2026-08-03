import z from 'zod'

export const microbaciaSchemas = {
    create: {
        body: z.object({
            Nome: z.string(),
            CodCBH: z.number(),
        }),
        response: {
            201: z.object({
                microbaciaId: z.number(),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    update: {
        params: z.object({
            CodMicroBacia: z.coerce.number(),
        }),
        body: z.object({
            Nome: z.string(),
            CodCBH: z.number(),
        }),
        response: {
            200: z.object({
                microbacia: z.object({
                    CodMicroBacia: z.number(),
                    Nome: z.string(),
                    CodCBH: z.number(),
                }),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    },
    delete: {
        params: z.object({
            CodMicroBacia: z.coerce.number(),
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
                    CodMicroBacia: z.number(),
                    Nome: z.string(),
                    CodCBH: z.number(),
                })
            ),
            409: z.object({
                error: z.string(),
            }),
        },
    },
}
