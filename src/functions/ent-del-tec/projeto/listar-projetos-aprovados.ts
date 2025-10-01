import prisma from '../../../lib/prisma'
import { Perfil } from '../../../middlewares/auth'

// A interface agora espera também o perfil do usuário
interface ListarProjetosAprovadosParams {
  codUsuario: number
  perfil: string
}

export async function listarProjetosAprovados({
  codUsuario,
  perfil,
}: ListarProjetosAprovadosParams) {
  // Objeto base para a cláusula WHERE do Prisma.
  // Contém as condições que são comuns a todos os perfis.
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const whereClause: any = {
    dataSubmissao: {
      not: null,
    },
    titulo: { not: null },
    objetivo: { not: null },
    acoes: { not: null },
    cronograma: { not: null },
  }

  // --- LÓGICA DE DECISÃO BASEADA NO PERFIL ---
  // Adicionamos a condição específica de cada perfil ao whereClause

  if (perfil === Perfil.ENTIDADE_EXECUTORA) {
    const ent = await prisma.entidadeexecutora.findFirst({
      where: { codUsuario },
    })
    if (!ent) {
      throw new Error(
        'Entidade executora não encontrada para o usuário fornecido.'
      )
    }
    // Filtra projetos pelo código da entidade executora
    whereClause.CodEntExec = ent.codEntExec
  } else if (perfil === Perfil.ENT_GER) {
    const ent = await prisma.entidade_gerenciadora.findFirst({
      where: { codUsuario },
    })
    if (!ent) {
      throw new Error(
        'Entidade gerenciadora não encontrada para o usuário fornecido.'
      )
    }
    // Filtra projetos pelo código da entidade gerenciadora
    whereClause.codEntGer = ent.codEntGer
  }
  // Se for ENT_DEL_TEC ou outro perfil administrativo, ele não adiciona
  // nenhum filtro de entidade, efetivamente listando todos os projetos.

  const projetos = await prisma.projeto.findMany({
    where: whereClause, // Usa a cláusula WHERE construída dinamicamente
    include: {
      tipo_projeto: {
        include: {
          marco_recomendado: {
            include: {
              execucao_marco: true,
            },
          },
        },
      },
      microbacia: true,
      entidadeexecutora: true,
      entidade_gerenciadora: true, // Incluímos para ter os dados completos
    },
    orderBy: {
      dataSubmissao: 'desc',
    },
  })

  return projetos
}

// import prisma from '../../../lib/prisma'

// interface ListarProjetosAprovadosParams {
//   codUsuario: number
// }

// export async function listarProjetosAprovados({
//   codUsuario,
// }: ListarProjetosAprovadosParams) {
//   const ent = await prisma.entidadeexecutora.findFirst({
//     where: {
//       codUsuario,
//     },
//   })

//   if (!ent) {
//     throw new Error(
//       'Entidade executora não encontrada para o usuário fornecido.'
//     )
//   }

//   const projetos = await prisma.projeto.findMany({
//     where: {
//       CodEntExec: ent.codEntExec,
//       dataSubmissao: {
//         not: null,
//       },
//       titulo: { not: null },
//       objetivo: { not: null },
//       acoes: { not: null },
//       cronograma: { not: null },
//     },
//     include: {
//       tipo_projeto: {
//         include: {
//           marco_recomendado: {
//             include: {
//               execucao_marco: true,
//             },
//           },
//         },
//       },
//       microbacia: true,
//       entidadeexecutora: true,
//     },
//     orderBy: {
//       dataSubmissao: 'desc',
//     },
//   })

//   return projetos
// }
