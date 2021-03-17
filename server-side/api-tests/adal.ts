import GeneralService, { TesterFunctions } from '../services/general.service';
import { ADALService } from '../services/adal.service';

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
    const PepperiOwnerID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';

    const ADALInstalledAddonVersion = await service.addons.installedAddons.addonUUID(`${ADALAddonUUID}`).get();

    describe('ADAL Tests Suites', () => {
        //Test Data
        it(`Test Data: Tested Addon: ADAL - Version: ${ADALInstalledAddonVersion.Version}`, () => {
            expect(ADALInstalledAddonVersion.Version).to.contain('.');
        });

        describe('Endpoints', () => {
            describe('Create Schema', () => {
                it(`Post`, async () => {
                    const schemaName = `CreateSchemaWithMandatoryFields ${new Date()}`;
                    const createSchemaResponse = await adalService.postSchema({ Name: schemaName });
                    expect(createSchemaResponse.CreationDateTime).to.includes(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.includes('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.includes(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.includes('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('meta_data');
                    console.log({ createSchemaResponse: createSchemaResponse });
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

                    expect(createSchemaResponse.CreationDateTime).to.includes(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.includes('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.includes(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.includes('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('data');
                    expect(createSchemaResponse.Fields?.testBoolean.Type).to.equal('Bool');
                    expect(createSchemaResponse.Fields?.TestInteger.Type).to.equal('Integer');
                    expect(createSchemaResponse.Fields?.testString.Type).to.equal('String');
                    expect(createSchemaResponse.Fields?.TestMultipleStringValues.Type).to.equal('MultipleStringValues');
                    console.log({ createSchemaResponse: createSchemaResponse });
                });

                it(`Insert Data To Table`, async () => {
                    const schemaName = `Oren111`;
                    const createSchemaResponse = await adalService.postSchema({ Name: schemaName });
                    console.log({ createSchemaResponse: createSchemaResponse });

                    const updateSchemaResponse = await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                        Key: 'testKey1',
                        Column1: ['Value1', 'Value2', 'Value3'],
                    });
                    expect(createSchemaResponse.CreationDateTime).to.includes(new Date().toISOString().split('T')[0]);
                    expect(createSchemaResponse.CreationDateTime).to.includes('Z');
                    expect(createSchemaResponse.ModificationDateTime).to.includes(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(createSchemaResponse.ModificationDateTime).to.includes('Z');
                    expect(createSchemaResponse.Name).to.equal(schemaName);
                    expect(createSchemaResponse.Hidden).to.be.false;
                    expect(createSchemaResponse.Type).to.equal('meta_data');
                    console.log({ createSchemaResponse: createSchemaResponse });

                    expect(updateSchemaResponse.Column1[0]).to.equal('Value1');
                    expect(updateSchemaResponse.Column1[1]).to.equal('Value2');
                    expect(updateSchemaResponse.Column1[2]).to.equal('Value3');
                    expect(updateSchemaResponse.Key).to.equal('testKey1');
                    console.log({ createSchemaResponse: createSchemaResponse });
                });
            });
        });
    });
}
