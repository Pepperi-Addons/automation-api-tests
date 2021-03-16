import GeneralService, { TesterFunctions } from '../services/general.service';
import { ADALService, MetaDataATD, MetaDataUDT } from '../services/adal.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function ADALTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    //const fieldsService = new FieldsService(generalService.papiClient);
    const adalService = new ADALService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //ADAL 00000000-0000-0000-0000-00000000ada1
    //TESTING eb26afcd-3cf2-482e-9ab1-b53c41a6adbe
    //PNS 00000000-0000-0000-0000-000000040fa9
    const ADALAddonUUID = '00000000-0000-0000-0000-00000000ada1';
    //X-Pepperi-OwnerID
    const PepperiOwnerID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
    const PepperiSecretKey = request.body['X-Pepperi-SecretKey'];

    //#region Upgrade ADAL
    const ADALInstalledAddonVersion = await service.addons.installedAddons.addonUUID(`${ADALAddonUUID}`).get();

    //#endregion Upgrade ADAL

    describe('ADAL Tests Suites', () => {
        //Test Data
        it(`Test Data: Tested Addon: ADAL - Version: ${ADALInstalledAddonVersion}`, () => {
            expect(ADALInstalledAddonVersion.Version).to.contain('.');
        });

        describe('Endpoints', () => {
            describe('Create Schema', () => {
                it(`Post`, async () => {
                    const oren = await adalService.postSchema({ Name: `CreateSchemaWithMandatoryField ${Date()}` });
                    debugger;
                    // //debugger;
                    // if (this.logcash.createSchemaWithMandFieldName.CreationDateTime.includes(newDate().toISOString().split("T")[0]) == true
                    //     && this.logcash.createSchemaWithMandFieldName.ModificationDateTime.includes(newDate().toISOString().split("T")[0]) == true
                    //     && this.logcash.createSchemaWithMandFieldName.Name != ''
                    //     && this.logcash.createSchemaWithMandFieldName.Hidden == false
                    //     && this.logcash.createSchemaWithMandFieldName.Type == 'meta_data') {
                    //     this.logcash.createSchemaWithMandFieldNameStatus = true;
                    // }
                    // else {
                    //     this.logcash.createSchemaWithMandFieldNameStatus = false;
                    //     this.logcash.createSchemaWithMandFieldNameErrorMessage = ('One of parameters on Schema creation get with wrong value: ' + this.logcash.createSchemaWithMandFieldName)
                    // }
                });
            });
        });
    });
}

// let oren1 = await fetch(this.baseURL + '/addons/data/schemes', {
//     method: "POST",
//     headers: {
//         'Authorization': 'Bearer ' + this.globalTestService.getToken(),
//         'X-Pepperi-OwnerID': this.addonUUID,
//         'X-Pepperi-SecretKey': this.logcash.secretKey
//     },
//     body: JSON.stringify({
//         'Name': 'CreateSchemaWithMandatoryField ' + Date()
//     })
// }).then((data) => data.json())
// //debugger;
// if (this.logcash.createSchemaWithMandFieldName.CreationDateTime.includes(newDate().toISOString().split("T")[0]) == true
//     && this.logcash.createSchemaWithMandFieldName.ModificationDateTime.includes(newDate().toISOString().split("T")[0]) == true
//     && this.logcash.createSchemaWithMandFieldName.Name != ''
//     && this.logcash.createSchemaWithMandFieldName.Hidden == false
//     && this.logcash.createSchemaWithMandFieldName.Type == 'meta_data') {
//     this.logcash.createSchemaWithMandFieldNameStatus = true;
// }
// else {
//     this.logcash.createSchemaWithMandFieldNameStatus = false;
//     this.logcash.createSchemaWithMandFieldNameErrorMessage = ('One of parameters on Schema creation get with wrong value: ' + this.logcash.createSchemaWithMandFieldName)
// }

// asynccreateSchemaWithProperties() {
//     this.logcash.createSchemaWithProperties = awaitfetch(this.baseURL + '/addons/data/schemes', {
//         method: "POST",
//         headers: {
//             'Authorization': 'Bearer ' + this.globalTestService.getToken(),
//             'X-Pepperi-OwnerID': this.addonUUID,
//             'X-Pepperi-SecretKey': this.logcash.secretKey
//         },
//         body: JSON.stringify({
//             'Name': this.logcash.createSchemaWithMandFieldName.Name,
//             'Type': 'meta_data',
//             'Fields': { 'testString': { 'Type': 'String' }, 'testBoolean': { 'Type': 'Bool' }, 'TestInteger': { 'Type': 'Integer' }, 'TestMultipleStringValues': { 'Type': 'MultipleStringValues' } },
//             'CreationDateTime': '2020-10-08T10:19:00.677Z',
//             'ModificationDateTime': '2020-10-08T10:19:00.677Z'
//         })
//     }).then((data) => data.json())
//     //debugger;
//     if (this.logcash.createSchemaWithProperties.CreationDateTime == this.logcash.createSchemaWithMandFieldName.CreationDateTime
//         && this.logcash.createSchemaWithProperties.ModificationDateTime != '2020-10-08T10:19:00.677Z'
//         && this.logcash.createSchemaWithProperties.Name == this.logcash.createSchemaWithMandFieldName.Name
//         && this.logcash.createSchemaWithProperties.Hidden == false
//         && this.logcash.createSchemaWithProperties.Type == 'meta_data'
//         && this.logcash.createSchemaWithProperties.Fields.testBoolean.Type == 'Bool'
//         && this.logcash.createSchemaWithProperties.Fields.TestInteger.Type == 'Integer'
//         && this.logcash.createSchemaWithProperties.Fields.testString.Type == 'String'
//         && this.logcash.createSchemaWithProperties.Fields.TestMultipleStringValues.Type == 'MultipleStringValues') {
//         this.logcash.createSchemaWithPropertiesStatus = true;
//     }
//     else {
//         this.logcash.createSchemaWithPropertiesStatus = false;
//         this.logcash.createSchemaWithPropertiesErrorMessage = ('One of parameters on Schema updating get with wrong value: ' + this.logcash.createSchemaWithProperties)
//     }
//     awaitthis.insertDataToTableWithoutOwnerIDNegative();
// }

// [10: 40 AM] Oleg Yefimov
// insert data to table
// [10: 40 AM]Oleg Yefimov

// asyncinsertDataToTableWithOwnerID() {
//     this.logcash.insertDataToTableWithOwnerID = awaitfetch(this.baseURL + '/addons/data/' + this.addonUUID + '/' + this.logcash.createSchemaWithMandFieldName.Name, {
//         method: "POST",
//         headers: {
//             'Authorization': 'Bearer ' + this.globalTestService.getToken(),
//             'X-Pepperi-OwnerID': this.addonUUID,
//             'X-Pepperi-SecretKey': this.logcash.secretKey
//         },
//         body: JSON.stringify({
//             'Key': 'testKey1',
//             'Column1': ['Value1', 'Value2', 'Value3']

//         })
//     }).then((data) => data.json())
//     //debugger;
//     if (this.logcash.insertDataToTableWithOwnerID.Column1[0] == 'Value1'
//         && this.logcash.insertDataToTableWithOwnerID.Column1[1] == 'Value2'
//         && this.logcash.insertDataToTableWithOwnerID.Column1[2] == 'Value3'
//         && this.logcash.insertDataToTableWithOwnerID.CreationDateTime == this.logcash.insertDataToTableWithOwnerID.ModificationDateTime
//         && this.logcash.insertDataToTableWithOwnerID.Key == 'testKey1') {
//         this.logcash.insertDataToTableWithOwnerIDStatus = true;
//     }
//     else {
//         this.logcash.insertDataToTableWithOwnerIDStatus = false;
//         this.logcash.insertDataToTableWithOwnerIDError = ('One of parameters is wrong: ' + this.logcash.insertDataToTableWithOwnerID);
//     }
//     awaitthis.getDataToTableWithOwnerID();
// }
