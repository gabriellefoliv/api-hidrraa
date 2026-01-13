import z from 'zod'

export const authSchemas = {
    login: {
        body: z.object({
            email: z.string().email(),
            senha: z.string(),
        }),
        response: {
            200: z.object({
                token: z.string(),
                usuario: z.object({
                    codUsuario: z.number(),
                    nome: z.string(),
                    email: z.string().email(),
                    perfil: z.string(),
                    codCBH: z.number().nullable(),
                }),
            }),
            401: z.object({
                error: z.string(),
            }),
        },
    },
    cadastrarEntExec: {
        body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.string(),
            especialidade: z.string(),
            contato: z.string(),
        }),
        response: {
            201: z.object({ codUsuario: z.number() }),
            409: z.object({ error: z.string() })
        }
    },
    cadastrarEntGer: {
        body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.string(),
            endereco: z.string(),
            contato: z.string(),
        }),
        response: {
            201: z.object({ codUsuario: z.number() }),
            409: z.object({ error: z.string() })
        }
    },
    cadastrarEntDelTec: {
        body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.string(),
            areaAtuacao: z.string(),
            contato: z.string(),
        }),
        response: {
            201: z.object({ codUsuario: z.number() }),
            409: z.object({ error: z.string() })
        }
    },
    cadastrarEntDelFin: {
        body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.string(),
            contato: z.string(),
        }),
        response: {
            201: z.object({ codUsuario: z.number() }),
            409: z.object({ error: z.string() })
        }
    },
    cadastrarInvestidor: {
        body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cpf: z.string(),
            tipoInvestidor: z.string(),
            contato: z.string(),
        }),
        response: {
            201: z.object({ codUsuario: z.number() }),
            409: z.object({ error: z.string() })
        }
    },
    listarEntExecs: {
        response: {
            200: z.array(z.object({
                codEntExec: z.number(),
                nome: z.string(),
            }).passthrough())
        }
    },
    listarEntGers: {
        response: {
            200: z.array(z.object({
                codEntGer: z.number(),
                nome: z.string(),
            }).passthrough())
        }
    },
    buscarEntGer: {
        params: z.object({ codUsuario: z.coerce.number() }),
        response: {
            200: z.object({
                codEntGer: z.number(),
                nome: z.string(),
                // ...
            }).passthrough(),
            404: z.object({ error: z.string() })
        }
    },
    buscarInvestidor: {
        params: z.object({ codUsuario: z.coerce.number() }),
        response: {
            200: z.object({
                codInvestidor: z.number(),
                nome: z.string(),
            }).passthrough(),
            404: z.object({ error: z.string() })
        }
    }
}
