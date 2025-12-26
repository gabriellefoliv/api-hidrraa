import { getRastreabilidadeAporte } from '../src/functions/investidor/get-rastreabilidade-aporte'
import prisma from '../src/lib/prisma'

async function main() {
    console.log('🚀 Verificando Rastreabilidade...')

    // Pegar o primeiro aporte que tiver alocação
    const alocacao = await prisma.alocacao_recurso.findFirst()

    if (!alocacao) {
        console.log('❌ Nenhuma alocação encontrada para testar.')
        return
    }

    console.log(`Testando com Aporte ID: ${alocacao.codAporte}`)

    try {
        const dados = await getRastreabilidadeAporte(alocacao.codAporte)
        console.log('✅ Dados recuperados com sucesso:')
        console.log(JSON.stringify(dados, null, 2))
    } catch (error) {
        console.error('❌ Erro:', error)
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
