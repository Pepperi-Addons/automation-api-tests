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

    describe('API Creation of UDCs', () => {
        /********************  RL Data Prep  ********************/

        // it('Creating UDC of Primiteve Types Fields with API', async () => {
        //     // Collection:  ====>   PrimitivesAuto   <====        //
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: 'PrimitivesAuto',
        //         fieldsOfCollection: [
        //             { classType: "Primitive", fieldName: "string_field", fieldType: "String", mandatory: false, indexed: false, fieldDescription: "field of name" },
        //             { classType: "Primitive", fieldName: "boolean_field", fieldType: "Bool", mandatory: false, indexed: false, fieldDescription: "field of exist" },
        //             { classType: "Primitive", fieldName: "integer_field", fieldType: "Integer", mandatory: false, indexed: false, fieldDescription: "field of amount" },
        //             { classType: "Primitive", fieldName: "double_field", fieldType: "Double", mandatory: false, indexed: false, fieldDescription: "field of price" },
        //             { classType: "Primitive", fieldName: "datetime_field", fieldType: "DateTime", mandatory: false, indexed: false, fieldDescription: "field of day" }
        //         ],
        //         descriptionOfCollection: 'Created with Automation'
        //     })
        //     // console.info(`bodyOfCollection: ${JSON.stringify(bodyOfCollection, null, 2)}`);
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
        // });

        // it('Creating UDC of Arrays of Primiteve Types Fields with API', async () => {
        //     // Collection:  ====>   ArraysPrimitivesAuto   <====        //
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: 'ArraysPrimitivesAuto',
        //         fieldsOfCollection: [
        //             { classType: "Array", fieldName: "numbers", fieldType: "String", mandatory: false, fieldDescription: "list of products" },
        //             { classType: "Array", fieldName: "names", fieldType: "Integer", mandatory: false, fieldDescription: "in stock quantity" },
        //             { classType: "Array", fieldName: "reals", fieldType: "Double", mandatory: false, fieldDescription: "average items sold per month" }
        //         ],
        //         descriptionOfCollection: 'Created with Automation'
        //     })
        //     // console.info(`bodyOfCollection: ${JSON.stringify(bodyOfCollection, null, 2)}`);
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
        // });

        // it('Adding Values to Collection: ArraysPrimitivesAuto', async () => {
        //     // Collection:  ====>   ArraysPrimitivesAuto   <====        //
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection({
        //         "numbers": [
        //             1,
        //             2,
        //             3,
        //             4
        //         ],
        //         "names": [
        //             "Happy",
        //             "New",
        //             "Year",
        //             "!!!"
        //         ],
        //         "reals": [
        //             0.1,
        //             0.2,
        //             0.3,
        //             0.4
        //         ]
        //     }, 'ArraysPrimitivesAuto');
        //     console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });

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

        // it('Creating UDC of Mix: String and String Array with API', async () => {
        //     // Collection:  ====>   StringPlusStringArrayAuto   <====        //
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: 'StringPlusStringArrayAuto',
        //         fieldsOfCollection: [
        //             { classType: "Array", fieldType: "String", fieldName: "string_arr", mandatory: false, fieldDescription: "list of products" },
        //             { classType: "Primitive", fieldType: "String", fieldName: "string_field", mandatory: false, indexed: false, fieldDescription: "field of name" }
        //         ],
        //         descriptionOfCollection: 'Created with method prepareDataForUdcCreation'
        //     })
        //     // console.info(`bodyOfCollection: ${JSON.stringify(bodyOfCollection, null, 2)}`);
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
        //     expect(upsertResponse.Ok).to.be.true;
        //     expect(upsertResponse.Status).to.equal(200);
        //     expect(upsertResponse.Error).to.eql({});
        // });

        // it('Adding Values to Collection: StringPlusStringArrayAuto', async () => {
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection({
        //         "string_arr": [
        //             "Happy",
        //             "New",
        //             "Year",
        //             "!!!"
        //         ],
        //         "string_field" : "It's 2023!",
        //     }, 'StringPlusStringArrayAuto');
        //     console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });
    });
}
