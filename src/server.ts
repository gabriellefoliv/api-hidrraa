import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { cadastrarEntidadeExecutoraRoute } from './routes/auth/cadastrar-entidade-executora-route'
import { cadastrarInvestidorRoute } from './routes/auth/cadastrar-investidor-route'
import { cadastrarMembroComiteRoute } from './routes/auth/cadastrar-membro-comite'
import { loginRoute } from './routes/auth/login-route'
import { listarDetalhesModeloRoute } from './routes/entidade-executora/listar-detalhes-modelo-route'
import { listarTiposProjetoRoute } from './routes/entidade-executora/listar-tipo-projetos-route'

export interface JwtPayload {
  codUsuario: number
  perfil: 'entExec' | 'membroComite' | 'investidor'
  iat?: number
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'defaultSecret',
  sign: {
    expiresIn: '1d',
  },
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Projeto HIDRRAA',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(cadastrarEntidadeExecutoraRoute)
app.register(cadastrarInvestidorRoute)
app.register(cadastrarMembroComiteRoute)
app.register(loginRoute)
app.register(listarTiposProjetoRoute)
app.register(listarDetalhesModeloRoute)

app.listen({ port: 3000 }).then(() => {
  console.log('HTTP Server Running!')
})
