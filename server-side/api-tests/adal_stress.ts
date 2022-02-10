import GeneralService, { TesterFunctions } from '../services/general.service';
import { ADALService } from '../services/adal.service';
// import { v4 as uuidv4 } from 'uuid';

export async function ADALStressTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const adalService = new ADALService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    // const PepperiSecretKey = await generalService.getSecretKey(PepperiOwnerID);

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade ADAL

    describe('ADAL Stress Tests Suites', () => {
        describe('Prerequisites Addon for ADAL Stress Tests', () => {
            //Test Data
            //ADAL
            it('Validate That All The Needed Addons Installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
                    expect(isInstalled).to.be.true;
                });
            });

            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });

                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Endpoints', () => {
            describe('Create Schema', () => {
                it(`Post`, async () => {
                    const schemaName = `CreateSchemaWithMandatoryFields ${new Date()}`;
                    const createSchemaResponse = await adalService.postSchema({ Name: schemaName });
                    expect(createSchemaResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.include('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.include(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.include('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('meta_data');
                    //console.log({ createSchemaResponse: createSchemaResponse });
                    const deleteSchemaResponse = await adalService.deleteSchema(schemaName);
                    expect(deleteSchemaResponse).to.equal('');
                    //console.log({deleteSchemaResponse:deleteSchemaResponse})
                });

                it(`Post Properties`, async () => {
                    const schemaName = `CreateSchemaWithProperties ${new Date()}`;
                    const createSchemaResponse = await adalService.postSchema({
                        Name: schemaName,
                        Type: 'data',
                        Fields: {
                            testString: { Type: 'String' },
                            testBoolean: { Type: 'Bool' },
                            TestInteger: { Type: 'Integer' },
                            TestMultipleStringValues: { Type: 'MultipleStringValues' },
                        },
                        CreationDateTime: '2020-10-08T10:19:00.677Z',
                        ModificationDateTime: '2020-10-08T10:19:00.677Z',
                    });

                    expect(createSchemaResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.include('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.include(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.include('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('data');
                    expect(createSchemaResponse.Fields?.testBoolean.Type).to.equal('Bool');
                    expect(createSchemaResponse.Fields?.TestInteger.Type).to.equal('Integer');
                    expect(createSchemaResponse.Fields?.testString.Type).to.equal('String');
                    expect(createSchemaResponse.Fields?.TestMultipleStringValues.Type).to.equal('MultipleStringValues');
                    //console.log({ createSchemaResponse: createSchemaResponse });
                    const deleteSchemaResponse = await adalService.deleteSchema(schemaName);
                    expect(deleteSchemaResponse).to.equal('');
                    //console.log({deleteSchemaResponse:deleteSchemaResponse})
                });

                it(`Insert Data To Table`, async () => {
                    const schemaName = `TestSchemaName`;
                    const createSchemaResponse = await adalService.postSchema({
                        Name: schemaName,
                        Type: 'meta_data',
                    });
                    //console.log({ createSchemaResponse: createSchemaResponse });

                    const updateSchemaResponse = await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                        Key: 'testKey1',
                        Column1: ['Value1', 'Value2', 'Value3'],
                    });
                    expect(createSchemaResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.include('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.include(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.include('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('meta_data');
                    //console.log({ createSchemaResponse: createSchemaResponse });

                    expect(updateSchemaResponse.Column1[0]).to.equal('Value1');
                    expect(updateSchemaResponse.Column1[1]).to.equal('Value2');
                    expect(updateSchemaResponse.Column1[2]).to.equal('Value3');
                    expect(updateSchemaResponse.Key).to.equal('testKey1');
                    //console.log({ createSchemaResponse: createSchemaResponse });
                    const deleteSchemaResponse = await adalService.deleteSchema(schemaName);
                    expect(deleteSchemaResponse).to.equal('');
                    //console.log({deleteSchemaResponse:deleteSchemaResponse})
                });

                // it(`Insert Data To Table (Stress)`, async () => {
                //     const schemaName = `TestSchemaName`;
                //     //const createSchemaResponse =
                //     await adalService.postSchema({
                //         Name: schemaName,
                //         Type: 'cpi_meta_data',
                //     });
                //     //console.log({ createSchemaResponse: createSchemaResponse });

                //     const updateSchemaResponsePromiseArr = [] as any;
                //     for (let i = 0; i < 1; i++) {
                //         updateSchemaResponsePromiseArr.push(
                //             generalService.fetchStatus(`/addons/data/${PepperiOwnerID}/${schemaName}`, {
                //                 method: 'POST',
                //                 headers: {
                //                     'X-Pepperi-OwnerID': PepperiOwnerID,
                //                     'X-Pepperi-SecretKey': PepperiSecretKey,
                //                 },
                //                 body: JSON.stringify({
                //                     Key: `testKey${i}`,
                //                     Itteration: i,
                //                     UUID: uuidv4(),
                //                     InternalID: i,
                //                 }),
                //                 timeout: 1000 * 20,
                //             }),
                //         );
                //         if (i % 100 == 0) {
                //             await generalService.sleepAsync(2000);
                //         } else if (i % 10 == 0) {
                //             await generalService.sleepAsync(1000);
                //         } else {
                //             await generalService.sleepAsync(100);
                //         }
                //     }

                //     const updateSchemaResponseArr = await Promise.all(updateSchemaResponsePromiseArr);

                //     const addonDataArr = updateSchemaResponseArr.map((addonData) => {
                //         const addonDataBody = addonData.Body;
                //         try {
                //             expect(addonDataBody.CreationDateTime).to.include(
                //                 new Date().toISOString().split('T')[0],
                //             );
                //             expect(addonDataBody.CreationDateTime).to.include('Z');
                //             expect(addonDataBody.ModificationDateTime).to.include(
                //                 new Date().toISOString().split('T')[0],
                //             );
                //             expect(addonDataBody.ModificationDateTime).to.include('Z');
                //             expect(addonDataBody.Hidden).to.be.false;
                //             expect(addonDataBody.Key).to.contain('testKey');
                //             expect(addonDataBody.Itteration).to.be.a('number');
                //             expect(addonDataBody.UUID).to.be.a('string').that.have.lengthOf(36);
                //             expect(addonDataBody.InternalID).to.be.a('number');
                //             return addonDataBody;
                //         } catch (error) {
                //             console.log('ERROR');
                //             return addonData;
                //         }
                //     });

                //     console.log(addonDataArr);

                //     for (let j = 0; j < addonDataArr.length; j++) {
                //         for (let i = j + 1; i < addonDataArr.length; i++) {
                //             if (addonDataArr[j].UUID == undefined || addonDataArr[i].UUID == undefined) {
                //                 continue;
                //             }
                //             if (
                //                 addonDataArr[j].UUID == addonDataArr[i].UUID ||
                //                 addonDataArr[j].Key == addonDataArr[i].Key ||
                //                 addonDataArr[j].Itteration == addonDataArr[i].Itteration ||
                //                 addonDataArr[j].InternalID == addonDataArr[i].InternalID
                //             ) {
                //                 console.log({ j: addonDataArr[j], i: addonDataArr[i] });
                //                 debugger;
                //             }
                //         }
                //     }

                //     console.log(addonDataArr);
                // });

                it(`Clear CPI Meta Data Schema`, async () => {
                    const schemaName = `TestSchemaName`;

                    const addonDataArr = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                        page_size: -1,
                    });

                    const deleteSchemaResponsePromiseArr = [] as any;
                    for (let i = 0; i < addonDataArr.length; i++) {
                        deleteSchemaResponsePromiseArr.push(
                            adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                                Key: addonDataArr[i].Key,
                                Hidden: true,
                            }),
                        );
                        if (i % 100 == 0) {
                            await generalService.sleepAsync(2000);
                        } else if (i % 10 == 0) {
                            await generalService.sleepAsync(1000);
                        } else {
                            await generalService.sleepAsync(100);
                        }
                    }

                    await Promise.all(deleteSchemaResponsePromiseArr);

                    const emptySchema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName);
                    expect(emptySchema).to.have.lengthOf(0);
                    //console.log({deleteSchemaResponse:deleteSchemaResponse})
                });
            });
        });
    });
}
