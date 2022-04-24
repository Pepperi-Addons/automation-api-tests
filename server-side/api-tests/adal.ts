import GeneralService, { TesterFunctions } from '../services/general.service';
import { ADALService } from '../services/adal.service';

export async function ADALTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const adalService = new ADALService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;

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

    describe('ADAL Tests Suites', () => {
        describe('Prerequisites Addon for ADAL Tests', () => {
            //Test Data
            //ADAL
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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
                    const createSchemaResponse = await adalService.postSchema({ Name: schemaName });
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
            });
        });
    });
}
