import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function MockTest(client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';

    describe('API Creation of UDCs', () => {
        /********************  RL Data Prep  ********************/

        it('Creating UDC of Primiteve Types Fields with API', async () => {
            // Collection:  ====>   ReferenceAccount   <====        //
            const bodyOfCollection = udcService.prepareDataForUdcCreation({
                nameOfCollection: 'ReferenceAccountAuto',
                descriptionOfCollection: 'Created with Automation',
                fieldsOfCollection: [
                    {
                        classType: 'Resource',
                        fieldName: 'of_account',
                        field: {
                            Type: 'Resource',
                            Resource: 'accounts',
                            Description: '',
                            Mandatory: false,
                            Indexed: true,
                            IndexedFields: {
                                Email: { Indexed: true, Type: 'String' },
                                Name: { Indexed: true, Type: 'String' },
                                UUID: { Indexed: true, Type: 'String' },
                            },
                            Items: { Description: '', Mandatory: false, Type: 'String' },
                            OptionalValues: [],
                            AddonUUID: coreResourcesUUID,
                        },
                    },
                    {
                        classType: 'Primitive',
                        fieldName: 'best_seller_item',
                        field: {
                            Type: 'String',
                            Description: '',
                            AddonUUID: '',
                            ApplySystemFilter: false,
                            Mandatory: false,
                            Indexed: false,
                            IndexedFields: {},
                            OptionalValues: ['A', 'B', 'C', 'D', 'Hair dryer', 'Roller', 'Cart', 'Mask', 'Shirt', ''],
                        },
                    },
                    {
                        classType: 'Primitive',
                        fieldName: 'max_quantity',
                        field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                    },
                    {
                        classType: 'Primitive',
                        fieldName: 'discount_rate',
                        field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
                    },
                    {
                        classType: 'Primitive',
                        fieldName: 'offered_discount_location',
                        field: {
                            Type: 'Array',
                            Mandatory: false,
                            Indexed: false,
                            Description: '',
                            OptionalValues: ['store', 'on-line', 'rep'],
                        },
                    },
                ],
            });
            // console.info(`bodyOfCollection: ${JSON.stringify(bodyOfCollection, null, 2)}`);
            const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
        });

        it('Adding Values to Collection: ArraysNumbersNamesReals', async () => {
            // Collection:  ====>   ArraysNumbersNamesReals   <====        //
            const upsertingValues_Response = await udcService.upsertValuesToCollection(
                {
                    numbers: [123, 234, 345, 456],
                    names: ['This', 'is', '2023', '!!!'],
                    reals: [1.1, 1.2, 1.3, 1.4],
                },
                'ArraysNumbersNamesReals',
            );
            console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            expect(upsertingValues_Response.Ok).to.be.true;
            expect(upsertingValues_Response.Status).to.equal(200);
            expect(upsertingValues_Response.Error).to.eql({});
        });
    });
}
