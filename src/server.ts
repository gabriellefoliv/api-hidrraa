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
import { criarProjetoRoute } from './routes/entidade-executora/projeto/criar-projeto-route'
import { listarDetalhesModeloRoute } from './routes/entidade-executora/projeto/listar-detalhes-modelo-route'
import { listarTiposProjetoRoute } from './routes/entidade-executora/projeto/listar-tipo-projetos-route'
import { atualizarMicrobaciaRoute } from './routes/membro-comite/microbacia/atualizar-microbacia-route'
import { criarMicrobaciaRoute } from './routes/membro-comite/microbacia/criar-microbacia-route'
import { deletarMicrobaciaRoute } from './routes/membro-comite/microbacia/deletar-microbacia-route'
import { listarMicrobaciasRoute } from './routes/membro-comite/microbacia/listar-microbacias-route'
import { atualizarProdutorRuralRoute } from './routes/membro-comite/produtor-rural/atualizar-produtor-rural-route'
import { criarProdutorRuralRoute } from './routes/membro-comite/produtor-rural/criar-produtor-rural-route'
import { deletarProdutorRuralRoute } from './routes/membro-comite/produtor-rural/deletar-produtor-rural-route'
import { listarProdutoresRuraisRoute } from './routes/membro-comite/produtor-rural/listar-produtores-rurais-route'
import { atualizarPropriedadeRoute } from './routes/membro-comite/propriedade/atualizar-propriedade-route'
import { criarPropriedadeRoute } from './routes/membro-comite/propriedade/criar-propriedade-route'
import { deletarPropriedadeRoute } from './routes/membro-comite/propriedade/deletar-propriedade-route'
import { listarPropriedadesRoute } from './routes/membro-comite/propriedade/listar-propriedades-route'

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

// Auth
app.register(cadastrarEntidadeExecutoraRoute)
app.register(cadastrarInvestidorRoute)
app.register(cadastrarMembroComiteRoute)
app.register(loginRoute)
// Projetos
app.register(listarTiposProjetoRoute)
app.register(listarDetalhesModeloRoute)
app.register(criarProjetoRoute)
// Microbacia
app.register(criarMicrobaciaRoute)
app.register(listarMicrobaciasRoute)
app.register(atualizarMicrobaciaRoute)
app.register(deletarMicrobaciaRoute)
// Propriedade
app.register(criarPropriedadeRoute)
app.register(listarPropriedadesRoute)
app.register(atualizarPropriedadeRoute)
app.register(deletarPropriedadeRoute)
// Produtor Rural
app.register(criarProdutorRuralRoute)
app.register(listarProdutoresRuraisRoute)
app.register(atualizarProdutorRuralRoute)
app.register(deletarProdutorRuralRoute)

app.listen({ port: 3000 }).then(() => {
  console.log('💦 HTTP Server Running!')
})
