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

import { buscarEntExecPorCodUsuarioRoute } from './routes/auth/buscar-entExec-por-codUsuario-route'
import { buscarInvestidorPorCodUsuarioRoute } from './routes/auth/buscar-investidor-por-codUsuario-route'
import { cadastrarEntidadeExecutoraRoute } from './routes/auth/cadastrar-entidade-executora-route'
import { cadastrarInvestidorRoute } from './routes/auth/cadastrar-investidor-route'
import { cadastrarMembroComiteRoute } from './routes/auth/cadastrar-membro-comite'
import { loginRoute } from './routes/auth/login-route'
import { atualizarProjetoRoute } from './routes/entidade-executora/projeto/atualizar-projeto-route'
import { buscarProjetoRoute } from './routes/entidade-executora/projeto/buscar-projeto-route'
import { criarProjetoRoute } from './routes/entidade-executora/projeto/criar-projeto-route'
import { excluirProjetoRoute } from './routes/entidade-executora/projeto/excluir-projeto-route'
import { listarDetalhesModeloRoute } from './routes/entidade-executora/projeto/listar-detalhes-modelo-route'
import { listarProjetosSalvosPorEntExecRoute } from './routes/entidade-executora/projeto/listar-projetos-salvos-por-ent-exec-route'
import { listarProjetosSubmetidosPorEntExecRoute } from './routes/entidade-executora/projeto/listar-projetos-submetidos-por-ent-exec'
import { listarTiposProjetoRoute } from './routes/entidade-executora/projeto/listar-tipo-projetos-route'
import { submeterProjetoRoute } from './routes/entidade-executora/projeto/submeter-projeto-route'
import { listarAportesRealizadosRoute } from './routes/investidor/listar-aportes-realizados-route'
import { realizarAporteRoute } from './routes/investidor/realizar-aporte-route'
import { listarAportesRoute } from './routes/membro-comite/aporte/listar-aportes-route'
import { validarAporteRoute } from './routes/membro-comite/aporte/validar-aporte-route'
import { avaliarProjetoRoute } from './routes/membro-comite/avaliacao/avaliar-projeto-route'
import { criarCriterioRoute } from './routes/membro-comite/avaliacao/criar-criterio-route'
import { listarCriteriosRoute } from './routes/membro-comite/avaliacao/listar-criterios-route'
import { listarProjetosAvaliadosRoute } from './routes/membro-comite/avaliacao/listar-projetos-avaliados'
import { listarProjetosNaoAvaliadosRoute } from './routes/membro-comite/avaliacao/listar-projetos-nao-avaliados-route'
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
import fastifyMultipart from '@fastify/multipart'
import { uploadEvidenciaRoute } from './routes/entidade-executora/projeto/upload-evidencia-route'
import { listarProjetosAprovadosRoute } from './routes/entidade-executora/projeto/listar-projetos-aprovados-route'
import { buscarProjetoExecutavelRoute } from './routes/entidade-executora/projeto/buscar-projeto-executavel-route'

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

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
  }
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
app.register(submeterProjetoRoute)
app.register(atualizarProjetoRoute)
app.register(listarProjetosSubmetidosPorEntExecRoute)
app.register(listarProjetosSalvosPorEntExecRoute)
app.register(buscarProjetoRoute)
app.register(excluirProjetoRoute)
// Evidências
app.register(listarProjetosAprovadosRoute)
app.register(uploadEvidenciaRoute)
// TODO : Usar rota de buscarProjeto no futuro, ao invés disso
app.register(buscarProjetoExecutavelRoute)

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

app.register(buscarEntExecPorCodUsuarioRoute)
app.register(buscarInvestidorPorCodUsuarioRoute)

//Avaliação
app.register(avaliarProjetoRoute)
app.register(criarCriterioRoute)
app.register(listarCriteriosRoute)
app.register(listarProjetosNaoAvaliadosRoute)
app.register(listarProjetosAvaliadosRoute)

//Aportes
app.register(realizarAporteRoute)
app.register(listarAportesRealizadosRoute)
app.register(validarAporteRoute)
app.register(listarAportesRoute)

app.listen({ port: 3000 }).then(() => {
  console.log('💦 HTTP Server Running!')
})
