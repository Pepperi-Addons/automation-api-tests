import GeneralService, { TesterFunctions } from '../services/general.service';
import { FieldsService } from '../services/fields.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function ImportExportATDTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new FieldsService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //Prerequisites Test Data
    const transactionsTypeArr = [] as any;
    const activitiesTypeArr = [] as any;

    const transactionsArr = await generalService.getTypes('transactions');
    transactionsArr.forEach((element) => {
        transactionsTypeArr.push(element.ExternalID);
        transactionsTypeArr[element.ExternalID] = element.TypeID;
    });

    const activitiesArr = await generalService.getTypes('activities');
    activitiesArr.forEach((element) => {
        activitiesTypeArr.push(element.ExternalID);
        activitiesTypeArr[element.ExternalID] = element.TypeID;
    });

    //#region Tests
    describe('Fields Tests Suites', () => {
        //Test Data
        it(`Test Data: Transaction - Name: ${transactionsTypeArr[0]}, TypeID:${
            transactionsTypeArr[transactionsTypeArr[0]]
        }`, async () => {
            expect(transactionsTypeArr[transactionsTypeArr[0]]).to.be.a('number').that.is.above(0);
        });
        it(`Test Data: Activity - Name: ${activitiesTypeArr[0]}, TypeID:${
            activitiesTypeArr[activitiesTypeArr[0]]
        }`, async () => {
            expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
                it('Get Transaction With The Type Sales Order', async () => {
                    return expect(transactionsTypeArr).to.have.property('Sales Order');
                });

                it('Get Sales Order Fields', async () => {
                    const transactionTypes = await generalService.getTypes('transactions');
                    const salesOrderTypeID = transactionTypes[0].TypeID;
                    return expect(service.getFields('transactions', salesOrderTypeID))
                        .eventually.to.be.an('array')
                        .with.length.above(5);
                });

                it('Get An Activity TypeID', async () => {
                    return expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').and.is.above(0);
                });
            });
        });
    });
}
