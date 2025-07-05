import prisma from '../src/lib/prisma'

async function main() {
  await prisma.criterio_aval.createMany({
    data: [
      {
        descricao: 'Critério 1',
        peso: 1.0,
      },
      {
        descricao: 'Critério 2',
        peso: 2.0,
      },
      {
        descricao: 'Critério 3',
        peso: 3.0,
      },
    ],
  })

  console.log('Critérios criados com sucesso!')
}

main().finally(() => prisma.$disconnect())
