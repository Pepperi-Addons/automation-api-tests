import GeneralService from '../services/general.service';
import { FieldsService } from '../services/fields.service';

// All Fields Tests
export async function FieldsTests(generalService: GeneralService, describe, expect, it) {
    const service = new FieldsService(generalService.papiClient);

    //#region Tests
    describe('Fields Tests Suites', () => {
        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
                it('Get Transaction With The Type Sales Order', async () => {
                    const transactionsArr = await service.getTypes('transactions');
                    return expect(transactionsArr[0]).to.include({ ExternalID: 'Sales Order' });
                });

                it('Get Sales Order Fields', async () => {
                    const transactionTypes = await service.getTypes('transactions');
                    const salesOrderTypeID = transactionTypes[0].TypeID;
                    return expect(service.getFields('transactions', salesOrderTypeID))
                        .eventually.to.be.an('array')
                        .with.length.above(5);
                });
            });

            describe('Upsert', () => {
                it('Upsert Fields', async () => {
                    const postFields = await service.upsertFields(
                        'transactions',
                        {
                            FieldID: 'TSATest 1234',
                            Label: '123',
                            UIType: {
                                ID: 1,
                            },
                            Format: 'Int64',
                        },
                        '268428',
                    );

                    const upsertFields = await service.upsertFields(
                        'transactions',
                        {
                            FieldID: 'TSATest 1234',
                            Label: '123',
                            UIType: {
                                ID: 1,
                            },
                            Format: 'Int64',
                        },
                        '268428',
                    );
                    return Promise.all([
                        expect(postFields['InternalID']).not.to.be.undefined,
                        expect(postFields['InternalID'] == upsertFields['InternalID']).to.be.true,
                    ]);
                });
            });

            describe('Delete', () => {
                it('Delete Fields', async () => {
                    return Promise.all([
                        expect(
                            service.upsertFields(
                                'transactions',
                                {
                                    FieldID: 'TSATest 1234',
                                    Label: '123',
                                    UIType: {
                                        ID: 1,
                                    },
                                    Format: 'Int64',
                                },
                                '268428',
                            ),
                        ).eventually.to.include({ FieldID: 'TSATest 1234' }),
                        expect(service.deleteFields('transactions', 'TSATest 1234', '268428')).eventually.to.be.true,
                    ]);
                });
            });
            //known bugs
            //cant update - create new instead
            //cant delete if created 2 with same name
            //no error messages for these cases
        });
    });
}
