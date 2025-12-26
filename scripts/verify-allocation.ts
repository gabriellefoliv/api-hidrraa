import { PrismaClient } from '@prisma/client'
import { registrarAlocacaoBlockchain } from '../src/functions/ent-del-fin/registrar-alocacao-blockchain'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Iniciando verificação de alocação...')

    // 1. Find or Create Investor
    let investidor = await prisma.investidor_esg.findFirst()
    if (!investidor) {
        console.log('Criando investidor de teste...')
        // Need a user first
        const usuario = await prisma.usuario.create({
            data: {
                nome: 'Investidor Teste',
                email: `investidor_${Date.now()}@teste.com`,
                senha: '123',
                codCBH: 1, // Assuming CBH 1 exists, if not we might fail
                Perfil: 'INVESTIDOR',
            }
        })
        investidor = await prisma.investidor_esg.create({
            data: {
                razaoSocial: 'Investidor Teste Ltda',
                cnpj: '00000000000191',
                contato: 'Teste',
                codUsuario: usuario.codUsuario,
            }
        })
    }
    console.log(`Investidor ID: ${investidor.codInvestidor}`)

    // 2. Find or Create Aporte
    let aporte = await prisma.aporte.findFirst({
        where: { codInvestidor: investidor.codInvestidor }
    })
    if (!aporte) {
        console.log('Criando aporte de teste...')
        // Need CBH
        const cbh = await prisma.cbh.findFirst() || await prisma.cbh.create({ data: { nome: 'CBH Teste' } })

        aporte = await prisma.aporte.create({
            data: {
                dataInvestimento: new Date(),
                bc_valor: 1000.00, // 1000 reais
                validadoAGEVAP: true,
                codInvestidor: investidor.codInvestidor,
                codCBH: cbh.codCBH,
            }
        })
    }
    console.log(`Aporte ID: ${aporte.codAporte}, Valor: ${aporte.bc_valor}`)

    // 3. Find or Create Projeto
    let projeto = await prisma.projeto.findFirst()
    if (!projeto) {
        console.log('Criando projeto de teste...')
        // Need TipoProjeto
        const tipo = await prisma.tipo_projeto.findFirst() || await prisma.tipo_projeto.create({ data: { nome: 'Tipo Teste', descricao: 'Desc' } })
        projeto = await prisma.projeto.create({
            data: {
                titulo: 'Projeto Teste Rastreio',
                codTipoProjeto: tipo.codTipoProjeto,
            }
        })
    }
    console.log(`Projeto ID: ${projeto.codProjeto}`)

    // 4. Perform Allocation
    const valorAlocacao = 100.00
    console.log(`Alocando ${valorAlocacao} do Aporte ${aporte.codAporte} para Projeto ${projeto.codProjeto}...`)

    try {
        // Call Blockchain Function
        const receipt = await registrarAlocacaoBlockchain({
            codAporte: aporte.codAporte,
            codProjeto: projeto.codProjeto,
            valor: valorAlocacao,
        })
        console.log('✅ Blockchain Receipt:', receipt)

        // Save to DB
        const alocacao = await prisma.alocacao_recurso.create({
            data: {
                codAporte: aporte.codAporte,
                codProjeto: projeto.codProjeto,
                valor: valorAlocacao,
                data: new Date(receipt.timestamp),
                txHash: receipt.sequenceNumber,
            }
        })
        console.log('✅ Alocação salva no banco:', alocacao)

    } catch (error) {
        console.error('❌ Erro na alocação:', error)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
