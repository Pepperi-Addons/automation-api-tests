import GeneralService, { TesterFunctions } from '../services/general.service';
import fetch from 'node-fetch';

// All Var API Tests
export async function VarTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Endpoints
    describe('Endpoints', () => {
        describe('Get', () => {
            it('Get Array Of Var Addons', async () => {
                const varResponse = await fetch(generalService['client'].BaseURL + '/var/addons', {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                }).then((response) => response.json());
                expect(varResponse).to.be.an('array').with.length.above(0);
                console.log(varResponse);
            });
        });
    });
}
