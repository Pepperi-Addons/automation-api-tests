import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

export async function VisitFlowTests(email: string, password: string,client: Client) {
    const generalService = new GeneralService(client);

    describe('Visit Flow', () => {
        it('', async () => {
        });

    });
}
