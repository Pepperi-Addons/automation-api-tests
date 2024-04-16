import GeneralService, { TesterFunctions } from '../services/general.service';

import { UDCService } from '../services/user-defined-collections.service';

export async function UDCTestserPermission(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDCTestsPermission(generalService, request, tester);
}
export async function UDCTestsPermission(generalService: GeneralService, request, tester: TesterFunctions) {
    const udcService = new UDCService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }

    describe('UDC Tests Suites', () => {
        describe('Base Collection Testing', () => {
            it(`Negative Test: call '/V1.0/user_defined_collections/schemes?page_size=-1' on a BUYER`, async () => {
                let errorMessage = '';
                try {
                    await udcService.getSchemes({ page_size: -1 });
                } catch (error) {
                    errorMessage = (error as any).message;
                }
                expect(errorMessage).to.include(
                    `"fault":{"faultstring":"Failed due to exception: You don't have permissions to call this endpoint","detail":{"errorcode":"Forbidden"}}}`,
                );
            });
            it(`Positive Test: call '/V1.0/user_defined_collections/UserDefinedCollectionsSettings' on a BUYER - See The Response Is Not Empty Nor Error`, async () => {
                const udcResponse = await generalService.fetchStatus(
                    '/user_defined_collections/UserDefinedCollectionsSettings',
                );
                expect(udcResponse.Ok).to.equal(true);
                expect(udcResponse.Status).to.equal(200);
                expect(udcResponse.Error).to.deep.equal({});
                expect(udcResponse.Body.length).to.be.above(0);
                expect(udcResponse.Body[0]).to.not.be.undefined;
            });
        });
    });
}
