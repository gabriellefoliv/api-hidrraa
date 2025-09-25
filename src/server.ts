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

import path from 'node:path'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { buscarInvestidorPorCodUsuarioRoute } from './routes/auth/buscar-investidor-por-codUsuario-route'
import { cadastrarEntidadeDelegatariaTecnicaRoute } from './routes/auth/cadastrar-ent-del-tec'
import { cadastrarEntidadeExecutoraRoute } from './routes/auth/cadastrar-entidade-executora-route'
import { cadastrarEntidadeGerenciadoraRoute } from './routes/auth/cadastrar-entidade-gerenciadora-route'
import { cadastrarInvestidorRoute } from './routes/auth/cadastrar-investidor-route'
import { listarEntExecsRoute } from './routes/auth/listar-entExecs-route'
import { listarEntGersRoute } from './routes/auth/listar-entGers-route'
import { loginRoute } from './routes/auth/login-route'
import { listarEvidenciasSubmetidasRoute } from './routes/ent-del-tec/analise-evidencia/listar-evidencias-submetidas-route'
import { listarProjetosComEvidenciasRoute } from './routes/ent-del-tec/analise-evidencia/listar-projetos-com-evidencias-route'
import { validarEvidenciasRoute } from './routes/ent-del-tec/analise-evidencia/validar-evidencias-route'
import { listarAportesRoute } from './routes/ent-del-tec/aporte/listar-aportes-route'
import { validarAporteRoute } from './routes/ent-del-tec/aporte/validar-aporte-route'
import { atualizarMicrobaciaRoute } from './routes/ent-del-tec/microbacia/atualizar-microbacia-route'
import { criarMicrobaciaRoute } from './routes/ent-del-tec/microbacia/criar-microbacia-route'
import { deletarMicrobaciaRoute } from './routes/ent-del-tec/microbacia/deletar-microbacia-route'
import { listarMicrobaciasRoute } from './routes/ent-del-tec/microbacia/listar-microbacias-route'
import { atualizarProdutorRuralRoute } from './routes/ent-del-tec/produtor-rural/atualizar-produtor-rural-route'
import { criarProdutorRuralRoute } from './routes/ent-del-tec/produtor-rural/criar-produtor-rural-route'
import { deletarProdutorRuralRoute } from './routes/ent-del-tec/produtor-rural/deletar-produtor-rural-route'
import { listarProdutoresRuraisRoute } from './routes/ent-del-tec/produtor-rural/listar-produtores-rurais-route'
import { atualizarProjetoRoute } from './routes/ent-del-tec/projeto/atualizar-projeto-route'
import { buscarProjetoRoute } from './routes/ent-del-tec/projeto/buscar-projeto-route'
import { criarProjetoRoute } from './routes/ent-del-tec/projeto/criar-projeto-route'
import { delegarEntExecEntGerRoute } from './routes/ent-del-tec/projeto/delegar-entExec-entGer-route'
import { excluirProjetoRoute } from './routes/ent-del-tec/projeto/excluir-projeto-route'
import { listarDetalhesModeloRoute } from './routes/ent-del-tec/projeto/listar-detalhes-modelo-route'
import { listarProjetosAprovadosRoute } from './routes/ent-del-tec/projeto/listar-projetos-aprovados-route'
import { listarProjetosSalvosRoute } from './routes/ent-del-tec/projeto/listar-projetos-salvos-por-ent-exec-route'
import { listarProjetosSubmetidosPorEntExecRoute } from './routes/ent-del-tec/projeto/listar-projetos-submetidos-por-ent-exec'
import { listarTiposProjetoRoute } from './routes/ent-del-tec/projeto/listar-tipo-projetos-route'
import { submeterProjetoRoute } from './routes/ent-del-tec/projeto/submeter-projeto-route'
import { atualizarPropriedadeRoute } from './routes/ent-del-tec/propriedade/atualizar-propriedade-route'
import { criarPropriedadeRoute } from './routes/ent-del-tec/propriedade/criar-propriedade-route'
import { deletarPropriedadeRoute } from './routes/ent-del-tec/propriedade/deletar-propriedade-route'
import { listarPropriedadesRoute } from './routes/ent-del-tec/propriedade/listar-propriedades-route'
import { buscarProjetoExecutavelRoute } from './routes/entidade-executora/execucao-marco/buscar-projeto-executavel-route'
import { buscarSaldoDisponivelRoute } from './routes/entidade-executora/execucao-marco/buscar-saldo-disponivel-route'
import { excluirEvidenciaRoute } from './routes/entidade-executora/execucao-marco/excluir-evidencia-route'
import { listarEvidenciasAvaliadasRoute } from './routes/entidade-executora/execucao-marco/listar-evidencias-avaliadas-route'
import { listarEvidenciasRoute } from './routes/entidade-executora/execucao-marco/listar-evidencias-por-marco-route'
import { solicitarFinanciamentoRoute } from './routes/entidade-executora/execucao-marco/solicitar-financiamento-route'
import { submeterEvidenciasRoute } from './routes/entidade-executora/execucao-marco/submeter-evidencias'
import { uploadEvidenciaRoute } from './routes/entidade-executora/execucao-marco/upload-evidencia-route'
import { listarAportesRealizadosRoute } from './routes/investidor/listar-aportes-realizados-route'
import {
  criarPaymentIntentRoute,
  realizarAporteRoute,
} from './routes/investidor/realizar-aporte-route'

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

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 40 * 1024 * 1024, // Limite de 40MB por arquivo
  },
})

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
})

// Auth
app.register(cadastrarEntidadeExecutoraRoute)
app.register(cadastrarInvestidorRoute)
app.register(cadastrarEntidadeDelegatariaTecnicaRoute)
app.register(cadastrarEntidadeGerenciadoraRoute)
app.register(loginRoute)
// Projetos
app.register(listarTiposProjetoRoute)
app.register(listarDetalhesModeloRoute)
app.register(criarProjetoRoute)
app.register(submeterProjetoRoute)
app.register(atualizarProjetoRoute)
app.register(listarProjetosSubmetidosPorEntExecRoute)
app.register(listarProjetosSalvosRoute)
app.register(buscarProjetoRoute)
app.register(excluirProjetoRoute)
app.register(delegarEntExecEntGerRoute)
// Evidências
app.register(listarProjetosAprovadosRoute)
app.register(uploadEvidenciaRoute)
app.register(listarEvidenciasRoute)
// TODO : Usar rota de buscarProjeto no futuro, ao invés disso
app.register(buscarProjetoExecutavelRoute)
app.register(submeterEvidenciasRoute)
app.register(excluirEvidenciaRoute)
app.register(validarEvidenciasRoute)
app.register(listarEvidenciasSubmetidasRoute)
app.register(listarProjetosComEvidenciasRoute)
app.register(listarEvidenciasAvaliadasRoute)

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

app.register(listarEntExecsRoute)
app.register(listarEntGersRoute)
app.register(buscarInvestidorPorCodUsuarioRoute)

//Aportes
app.register(realizarAporteRoute)
app.register(listarAportesRealizadosRoute)
app.register(validarAporteRoute)
app.register(listarAportesRoute)
app.register(criarPaymentIntentRoute)

//Financiamento
app.register(solicitarFinanciamentoRoute)
app.register(buscarSaldoDisponivelRoute)

app.listen({ port: 3000 }).then(() => {
  console.log('💦 HTTP Server Running!')
})
