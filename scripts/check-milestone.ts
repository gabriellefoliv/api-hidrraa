import prisma from '../src/lib/prisma';
import fs from 'fs';
import { env } from '../src/env.ts';

async function main() {
    const codExecucaoMarco = 3; // From user context

    console.log(`Checking Milestone ${codExecucaoMarco}...`);

    const milestone = await prisma.execucao_marco.findUnique({
        where: { codExecucaoMarco },
        include: {
            pagto_marco_concluido: true
        }
    });

    if (!milestone) {
        console.log("Milestone not found.");
        return;
    }

    const totalPaid = milestone.pagto_marco_concluido.reduce((acc, p) => acc + p.bc_valor, 0);

    const output = [
        `Milestone: ${milestone.descricao}`,
        `Valor Estimado (Budget): ${milestone.valorEstimado}`,
        `Total 'Paid' (Requested in DB): ${totalPaid}`,
        `Remaining Balance: ${(milestone.valorEstimado || 0) - totalPaid}`,
        `\nExisting Requests/Payments:`,
        ...milestone.pagto_marco_concluido.map(p => `- ID: ${p.codPagtoMarco}, Valor: ${p.bc_valor}, Data: ${p.bc_data}, Status (Implicit): Validated?`)
    ].join('\n');

    console.log(output);
    fs.writeFileSync('milestone_status.txt', output);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
