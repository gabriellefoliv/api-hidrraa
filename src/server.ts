import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import path from 'node:path'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifyRawBody from 'fastify-raw-body'
import { authRoutes } from './domains/auth/auth.routes'
import { pagamentoRoutes } from './domains/pagamento/pagamento.routes'
import { analiseEvidenciaRoutes } from './domains/analise-evidencia/analise-evidencia.routes'
import { microbaciaRoutes } from './domains/microbacia/microbacia.routes'
import { produtorRuralRoutes } from './domains/produtor-rural/produtor-rural.routes'
import { projetoRoutes } from './domains/projeto/projeto.routes'
import { propriedadeRoutes } from './domains/propriedade/propriedade.routes'
import { relatorioRoutes } from './domains/relatorio/relatorio.routes'
import { execucaoMarcoRoutes } from './domains/execucao-marco/execucao-marco.routes'
import { aporteRoutes } from './domains/aporte/aporte.routes'

export interface JwtPayload {
  codUsuario: number
  perfil: 'entExec' | 'membroComite' | 'investidor'
  iat?: number
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 40 * 1024 * 1024, // Limite de 40MB por arquivo
  },
})

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
})

app.register(fastifyRawBody, {
  field: 'rawBody',
  global: false,
  routes: ['/api/aportes'],
})

app.head('/health', () => {
  return 'OK'
})

app.register(authRoutes)
app.register(projetoRoutes)
app.register(analiseEvidenciaRoutes)
app.register(relatorioRoutes)
app.register(execucaoMarcoRoutes)
app.register(microbaciaRoutes)
app.register(propriedadeRoutes)
app.register(produtorRuralRoutes)
app.register(aporteRoutes)
app.register(pagamentoRoutes)


const port = 3000

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    console.log(`💦 HTTP Server Running on port ${port}!`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
