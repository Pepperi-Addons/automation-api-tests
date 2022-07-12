import GeneralService, { TesterFunctions } from '../services/general.service';
import { PFSService } from '../services/pfs.service';
import { ADALService } from '../services/adal.service';
// import { pfs } from '../tests';

export async function PFSTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    console.log(generalService);
    console.log(request);
    console.log(tester);
    await PFSTests(generalService, request, tester);
}

export async function PFSTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade PFS
    const testData = {
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.0.2'],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        generalService['client'].AddonSecretKey = await generalService.getSecretKey(
            generalService['client'].AddonUUID,
            varKey,
        );
        console.log(`!!!!ADDON SK IN JENKINS:${generalService['client'].AddonSecretKey}`);
    }
    const pfsService = new PFSService(generalService);
    await generalService.baseAddonVersionsInstallation(varKey);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    // debugger;
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const distributor = await pfsService.getDistributor();
    console.log(`!!!!!!!DIST IN JENKINS:${JSON.stringify(distributor)}`);
    //#endregion Upgrade PFS

    describe('PFS Tests Suites', () => {
        const schemaName = 'pfsTestSchema';
        const verifyAfterPurge = [] as any;
        describe('Prerequisites Addon for PFS Tests', () => {
            //Test Data
            //PFS
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

        describe('POST/GET', () => {
            it(`Reset pfs Schema`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                let purgedSchema;
                try {
                    purgedSchema = await adalService.deleteSchema(schemaName);
                } catch (error) {
                    purgedSchema = '';
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                const newSchema = await adalService.postSchema({
                    Name: schemaName,
                    Type: 'pfs',
                } as any);
                expect(purgedSchema).to.equal('');
                expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                expect(newSchema).to.have.property('Type').a('string').that.is.equal('pfs');
                expect(newSchema.Fields).to.have.property('Description');
                expect(newSchema.Fields).to.have.property('MIME');
                expect(newSchema.Fields).to.have.property('Sync');
                expect(newSchema.Fields).to.have.property('Thumbnails');
                expect(newSchema.Fields).to.have.property('Folder');
                expect(newSchema.Fields).to.have.property('URL');
                expect(newSchema.Fields).to.have.property('FileVersion');
                expect(newSchema.Fields).to.have.property('Cache');
                expect(newSchema.Fields).to.have.property('UploadedBy');
                expect(newSchema.Fields).to.have.property('FileSize');
            });

            it(`Post + Get file in root folder`, async () => {
                const tempKey = 'RootFolderFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                    Cache: false,
                    ExpirationDateTime: '2035-07-03T05:56:17.222Z',
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.ExpirationDateTime).to.equal('2035-07-03T05:56:17.000Z');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const getFileResponse = await pfsService.getFile(schemaName, tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.ExpirationDateTime).to.equal('2035-07-03T05:56:17.000Z');
                expect(getFileResponse.Description).to.equal(tempDescription);
                expect(getFileResponse).to.have.property('FileVersion').that.is.a('string').and.is.not.empty;
                expect(getFileResponse).to.have.property('UploadedBy').that.is.a('string').and.is.not.empty;
                expect(getFileResponse.Folder).to.equal('/');
                expect(getFileResponse.Key).to.equal(tempKey);
                expect(getFileResponse.MIME).to.equal('file/plain');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.Hidden).to.be.false;
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const getFileBeforeDelete = await pfsService.getFileFromURL(getFileResponse.URL);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
                const getFileAfterDelete = await pfsService.getFileFromURL(getFileResponse.URL + '?asda');
                expect(getFileBeforeDelete).to.not.deep.equal(getFileAfterDelete);
            });

            it(`Post file with space in name`, async () => {
                const tempKey = 'Name with spaces' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                    Cache: true,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const getFileResponse = await pfsService.getFile(schemaName, tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.Description).to.equal(tempDescription);
                expect(getFileResponse).to.have.property('FileVersion').that.is.a('string').and.is.not.empty;
                expect(getFileResponse).to.have.property('UploadedBy').that.is.a('string').and.is.not.empty;
                expect(getFileResponse.Folder).to.equal('/');
                expect(getFileResponse.Key).to.equal(tempKey);
                expect(getFileResponse.MIME).to.equal('file/plain');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.Hidden).to.be.false;
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const fileBeforeUpdate = await pfsService.getFileFromURL(getFileResponse.URL);
                const updateFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Sync: 'None',
                    Description: tempDescription,
                });
                expect(updateFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(updateFileResponse.CreationDateTime).to.include('Z');
                expect(updateFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(updateFileResponse.ModificationDateTime).to.include('Z');
                expect(updateFileResponse.Description).to.equal(tempDescription);
                expect(updateFileResponse.Folder).to.equal('/');
                expect(updateFileResponse.Key).to.equal(tempKey);
                expect(updateFileResponse.MIME).to.equal('image/png');
                expect(updateFileResponse.Name).to.equal(tempKey);
                expect(updateFileResponse.Sync).to.equal('None');
                expect(updateFileResponse.URL).to.include('https://pfs.');
                expect(updateFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const fileAfterUpdate = await pfsService.getFileFromURL(updateFileResponse.URL);
                expect(fileBeforeUpdate).to.deep.equal(fileAfterUpdate);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post + Get file in root folder SDK`, async () => {
                const tempKey = 'RootFolderFileSDK' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFileSDK(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const getFileResponse = await pfsService.getFileSDK(schemaName, tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.Description).to.equal(tempDescription);
                expect(getFileResponse).to.have.property('FileVersion').that.is.a('string').and.is.not.empty;
                expect(getFileResponse.Folder).to.equal('/');
                expect(getFileResponse.Key).to.equal(tempKey);
                expect(getFileResponse.MIME).to.equal('file/plain');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.Hidden).to.be.false;
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file using URL`, async () => {
                const tempKey = 'urlFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'https://www.pepperi.com/img/brand-logo-full.svg',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post CSV file`, async () => {
                const tempKey = 'RootFolderCSVFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    MIME: 'application/vnd.ms-excel',
                    URI: 'data:application/vnd.ms-excel;base64,RW1wbG95ZWVOdW1iZXI7Rmlyc3ROYW1lO0xhc3ROYW1lO0FnZQoyMTM7Um9pO0FoYXJvbiBCYXNzaTszNg==',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('application/vnd.ms-excel');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file in folder`, async () => {
                const tempKey = 'FolderFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: 'TestFolder/' + tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('TestFolder');
                expect(postFileResponse.Key).to.equal('TestFolder/' + tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/TestFolder/' +
                        tempKey,
                );
                const getFileResponse = await pfsService.getFile(schemaName, 'TestFolder/' + tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.Description).to.equal(tempDescription);
                expect(getFileResponse.Folder).to.equal('TestFolder');
                expect(getFileResponse.Key).to.equal('TestFolder/' + tempKey);
                expect(getFileResponse.MIME).to.equal('file/plain');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.Hidden).to.be.false;
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/TestFolder/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, 'TestFolder/' + tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file in folder limit + negative test`, async () => {
                const tempKey = 'FolderFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: '1/2/3/4/5/6/7/' + tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('1/2/3/4/5/6/7');
                expect(postFileResponse.Key).to.equal('1/2/3/4/5/6/7/' + tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/1/2/3/4/5/6/7/' +
                        tempKey,
                );
                const getFileResponse = await pfsService.getFile(schemaName, '1/2/3/4/5/6/7/' + tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.Description).to.equal(tempDescription);
                expect(getFileResponse.Folder).to.equal('1/2/3/4/5/6/7');
                expect(getFileResponse.Key).to.equal('1/2/3/4/5/6/7/' + tempKey);
                expect(getFileResponse.MIME).to.equal('file/plain');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.Hidden).to.be.false;
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/1/2/3/4/5/6/7/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, '1/2/3/4/5/6/7/' + tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: '1/2/3/4/5/6/7/8/NegativeDepthTest.txt',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Requested path is deeper than the maximum allowed depth of 7.","detail":{"errorcode":"BadRequest"}}}`,
                );
            });

            it(`Post folder`, async () => {
                const tempKey = 'Folder' + Math.floor(Math.random() * 1000000).toString() + '/';
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    MIME: 'pepperi/folder',
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('pepperi/folder');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('None');
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file negative tests`, async () => {
                const tempKey = 'NegativeFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                await expect(
                    pfsService.postFile(schemaName, {
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Missing mandatory field 'Key'","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey + '/',
                        MIME: 'file/plain',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: A filename cannot contain a '/'.","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey,
                        MIME: 'pepperi/folder',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: On creation of a folder, the key must end with '/'","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: 'badExtension.kuk',
                        MIME: 'pepperi/folder',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: The requested file extension '.kuk' is not supported.","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: 'noExtension',
                        MIME: 'pepperi/folder',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        Sync: 'Device',
                        Description: tempDescription,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: The requested file does not have an extension.","detail":{"errorcode":"BadRequest"}}}`,
                );
            });

            it(`Update file`, async () => {
                const tempKey = 'FileForUpdate' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const updateFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:text/csv;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'text/csv',
                    Sync: 'None',
                    Description: tempDescription + ' Updated',
                });
                expect(updateFileResponse.Description).to.equal(tempDescription + ' Updated');
                expect(updateFileResponse.Sync).to.equal('None');
                expect(updateFileResponse.MIME).to.equal('text/csv');
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Delete file`, async () => {
                const tempKey = 'FileForDelete' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Key).to.equal(tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
                expect(deletedFileResponse.ExpirationDateTime).to.include('Z');
                await expect(pfsService.getFile(schemaName, tempKey)).eventually.to.be.rejectedWith(
                    `failed with status: 404 - Not Found error: {"fault":{"faultstring":"Failed due to exception: Could not find requested item:`,
                );
            });
        });

        describe('MIME settings tets', () => {
            it(`MIME negative tests`, async () => {
                const tempKey = 'MIMENegativeFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey,
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Missing mandatory field 'MIME'","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: '1' + tempKey,
                        URI: 'https://www.pepperi.com/img/brand-logo-full.svg',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Missing mandatory field 'MIME'","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: '2' + tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'image/jpeg',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: There's a discrepancy between the passed MIME type and the parsed one from the data URI.","detail":{"errorcode":"BadRequest"}}}`,
                );
            });
        });

        describe('Secret key negative tests', () => {
            it(`Secret key negative tests`, async () => {
                const negativeResult1 = await pfsService.negativePOST(schemaName, '123');
                const negativeResult2 = await pfsService.negativePOST(schemaName, '');
                expect(negativeResult1.Body.fault.faultstring).to.include(
                    'Failed due to exception: Authorization request denied. check secret key ',
                );
                expect(negativeResult1.Status).to.equal(401);
                expect(negativeResult2.Body.fault.faultstring).to.include(
                    'Failed due to exception: Authorization request denied. Missing secret key header ',
                );
                expect(negativeResult2.Status).to.equal(401);
            });
        });

        describe('Get Files (list)', () => {
            let startingListLength;
            const rootFileTempKey = 'ListTestsRootFile' + Math.floor(Math.random() * 1000000).toString();
            const rootFiletempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const folderFiletempKey = 'ListTestsFolderFile' + Math.floor(Math.random() * 1000000).toString();
            const folderFiletempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const folderTempKey = 'ListFolder' + Math.floor(Math.random() * 1000000).toString();

            it(`Post files and folders for list tests`, async () => {
                startingListLength = await pfsService.getFilesList(schemaName, '/');
                let i = 1;
                while (i < 21) {
                    const postFileResponse = await pfsService.postFile(schemaName, {
                        Key: rootFileTempKey + '-' + i + '.txt',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: rootFiletempDescription + ' ' + i,
                    });
                    expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(postFileResponse.CreationDateTime).to.include('Z');
                    expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(postFileResponse.ModificationDateTime).to.include('Z');
                    expect(postFileResponse.Description).to.equal(rootFiletempDescription + ' ' + i);
                    expect(postFileResponse.Folder).to.equal('/');
                    expect(postFileResponse.Key).to.equal(rootFileTempKey + '-' + i + '.txt');
                    expect(postFileResponse.MIME).to.equal('file/plain');
                    expect(postFileResponse.Name).to.equal(rootFileTempKey + '-' + i + '.txt');
                    expect(postFileResponse.Sync).to.equal('Device');
                    expect(postFileResponse.URL).to.include('https://pfs.');
                    expect(postFileResponse.URL).to.include(
                        '.pepperi.com/' +
                            distributor.UUID +
                            '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                            schemaName +
                            '/' +
                            rootFileTempKey,
                    );
                    i++;
                }

                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: folderTempKey + '/',
                    MIME: 'pepperi/folder',
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(folderTempKey + '/');
                expect(postFileResponse.MIME).to.equal('pepperi/folder');
                expect(postFileResponse.Name).to.equal(folderTempKey + '/');
                expect(postFileResponse.Sync).to.equal('None');

                let f = 1;
                while (f < 21) {
                    const postFileResponse = await pfsService.postFile(schemaName, {
                        Key: folderTempKey + '/' + folderFiletempKey + '-' + f + '.txt',
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: folderFiletempDescription + ' ' + f,
                    });
                    expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(postFileResponse.CreationDateTime).to.include('Z');
                    expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                    expect(postFileResponse.ModificationDateTime).to.include('Z');
                    expect(postFileResponse.Description).to.equal(folderFiletempDescription + ' ' + f);
                    expect(postFileResponse.Folder).to.equal(folderTempKey);
                    expect(postFileResponse.Key).to.equal(folderTempKey + '/' + folderFiletempKey + '-' + f + '.txt');
                    expect(postFileResponse.MIME).to.equal('file/plain');
                    expect(postFileResponse.Name).to.equal(folderFiletempKey + '-' + f + '.txt');
                    expect(postFileResponse.Sync).to.equal('Device');
                    expect(postFileResponse.URL).to.include('https://pfs.');
                    expect(postFileResponse.URL).to.include(
                        '.pepperi.com/' +
                            distributor.UUID +
                            '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                            schemaName +
                            '/' +
                            folderTempKey +
                            '/' +
                            folderFiletempKey,
                    );
                    f++;
                }
            });

            it(`Get list of files`, async () => {
                const rootFolderResponse = await pfsService.getFilesList(schemaName, '/');
                expect(rootFolderResponse)
                    .to.be.an('Array')
                    .with.lengthOf(startingListLength.length + 21);
                expect(rootFolderResponse[1].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(rootFolderResponse[1].CreationDateTime).to.include('Z');
                expect(rootFolderResponse[1].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(rootFolderResponse[1].ModificationDateTime).to.include('Z');
                expect(rootFolderResponse[1].Description).to.equal('');
                expect(rootFolderResponse[1].Folder).to.equal('/');
                expect(rootFolderResponse[1].Sync).to.equal('None');
                expect(rootFolderResponse[1].URL).to.equal('');
                expect(rootFolderResponse[1].Key).to.include('ListFolder');
                expect(rootFolderResponse[1].Key).to.include('/');
                expect(rootFolderResponse[1].MIME).to.equal('pepperi/folder');
                expect(rootFolderResponse[1].Name).to.include('ListFolder');
                let i = 2;
                while (i < 21) {
                    expect(rootFolderResponse[i].MIME).to.equal('file/plain');
                    expect(rootFolderResponse[i].Folder).to.equal('/');
                    expect(rootFolderResponse[i].Description).to.include(rootFiletempDescription);
                    expect(rootFolderResponse[i].Name).to.include(rootFileTempKey);
                    expect(rootFolderResponse[i].Key).to.include(rootFileTempKey);
                    expect(rootFolderResponse[i].URL).to.include('https://pfs.');
                    expect(rootFolderResponse[i].URL).to.include(
                        '.pepperi.com/' +
                            distributor.UUID +
                            '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                            schemaName +
                            '/' +
                            rootFileTempKey,
                    );
                    i++;
                }
                const folderResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/');
                let f = 1;
                while (f < 20) {
                    expect(folderResponse[f].MIME).to.equal('file/plain');
                    expect(folderResponse[f].Folder).to.equal(folderTempKey);
                    expect(folderResponse[f].Description).to.include(folderFiletempDescription);
                    expect(folderResponse[f].Name).to.include(folderFiletempKey);
                    expect(folderResponse[f].Key).to.include(folderFiletempKey);
                    expect(folderResponse[f].URL).to.include('https://pfs.');
                    expect(folderResponse[f].URL).to.include(
                        '.pepperi.com/' +
                            distributor.UUID +
                            '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                            schemaName +
                            '/' +
                            folderTempKey +
                            '/' +
                            folderFiletempKey,
                    );
                    f++;
                }
            });

            it(`Fields parameter`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    fields: ['Description', 'Name'],
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(20);
                expect(getFileResponse[0]).to.not.have.property('MIME');
                expect(getFileResponse[0]).to.not.have.property('Folder');
                expect(getFileResponse[0].Description).to.include(folderFiletempDescription);
                expect(getFileResponse[0].Name).to.include(folderFiletempKey);
                expect(getFileResponse[0]).to.not.have.property('Key');
                expect(getFileResponse[0]).to.not.have.property('URL');
            });

            // it(`Sort by parameter`, async () => {
            //     const getFileResponse = await pfsService.getFilesList(folderTempKey + '/', { order_by: 'MIME' });
            //     expect(getFileResponse).to.be.an('Array').with.lengthOf(20);
            //     expect(getFileResponse[0].Name).to.include('-1');
            //     expect(getFileResponse[1].Name).to.include('-10');
            //     expect(getFileResponse[2].Name).to.include('-11');
            //     expect(getFileResponse[3].Name).to.include('-12');
            //     expect(getFileResponse[4].Name).to.include('-13');
            //     expect(getFileResponse[5].Name).to.include('-14');
            //     expect(getFileResponse[6].Name).to.include('-15');
            //     expect(getFileResponse[7].Name).to.include('-16');
            //     expect(getFileResponse[8].Name).to.include('-17');
            //     expect(getFileResponse[9].Name).to.include('-18');
            //     expect(getFileResponse[10].Name).to.include('-19');
            //     expect(getFileResponse[11].Name).to.include('-2');
            //     expect(getFileResponse[12].Name).to.include('-20');
            //     expect(getFileResponse[13].Name).to.include('-3');
            //     expect(getFileResponse[14].Name).to.include('-4');
            //     expect(getFileResponse[15].Name).to.include('-5');
            //     expect(getFileResponse[16].Name).to.include('-6');
            //     expect(getFileResponse[17].Name).to.include('-7');
            //     expect(getFileResponse[18].Name).to.include('-8');
            //     expect(getFileResponse[19].Name).to.include('-9');
            // });

            // Waiting for fix in ADAL
            // it(`Validate indexed fields - key`, async () => {
            //     const keyIndexResponse = await pfsService.getFilesList(folderTempKey + '/', { order_by: 'Key' });
            // });

            // it(`Validate indexed fields - MIME`, async () => {
            //     debugger;
            //     const mimeIndexResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', { order_by: 'MIME' });
            //     expect(mimeIndexResponse).to.be.an('array').with.length.above(0);
            // });

            // Waiting for fix in ADAL
            // it(`Validate indexed fields - ModificationDate`, async () => {
            //     const modificationDateIndexResponse = await pfsService.getFilesList(folderTempKey + '/', { order_by: 'ModificationDate' });
            // });

            // it(`Validate indexed fields - Folder`, async () => {
            //     debugger;
            //     const descriptionIndexResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
            //         order_by: 'Folder',
            //     });
            //     expect(descriptionIndexResponse).to.be.an('array').with.length.above(0);
            // });

            it(`Page size parameter`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    page_size: 2,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(2);
                expect(getFileResponse[0].Description).to.include(folderFiletempDescription + ' 1');
                expect(getFileResponse[1].Description).to.include(folderFiletempDescription + ' 10');
            });

            it(`Where Clause Equal Operator`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    where: `Name='${folderFiletempKey}-1.txt'`,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(1);
                expect(getFileResponse[0].MIME).to.equal('file/plain');
                expect(getFileResponse[0].Folder).to.equal(folderTempKey);
                expect(getFileResponse[0].Description).to.include(folderFiletempDescription);
                expect(getFileResponse[0].Name).to.include(folderFiletempKey);
                expect(getFileResponse[0].Key).to.include(folderFiletempKey);
                expect(getFileResponse[0].URL).to.include('https://pfs.');
                expect(getFileResponse[0].URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        folderTempKey +
                        '/' +
                        folderFiletempKey,
                );
            });

            it(`Where Clause In`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    where: `Description IN '${folderFiletempDescription} 1'`,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(1);
                expect(getFileResponse[0].MIME).to.equal('file/plain');
                expect(getFileResponse[0].Folder).to.equal(folderTempKey);
                expect(getFileResponse[0].Description).to.include(folderFiletempDescription);
                expect(getFileResponse[0].Name).to.include(folderFiletempKey);
                expect(getFileResponse[0].Key).to.include(folderFiletempKey);
                expect(getFileResponse[0].URL).to.include('https://pfs.');
                expect(getFileResponse[0].URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        folderTempKey +
                        '/' +
                        folderFiletempKey,
                );
            });

            it(`Where Clause In group`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    where: `Description IN ('${folderFiletempDescription} 1', '${folderFiletempDescription} 2')`,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(2);
                expect(getFileResponse[0].Description).to.include(folderFiletempDescription + ' 1');
                expect(getFileResponse[1].Description).to.include(folderFiletempDescription + ' 2');
            });

            it(`Where Clause Like`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    where: `Description LIKE '${folderFiletempDescription} 12'`,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(1);
                expect(getFileResponse[0].Description).to.equal(folderFiletempDescription + ' 12');
            });

            it(`Delete files`, async () => {
                let i = 1;
                let deletedFileResponse;
                while (i < 21) {
                    deletedFileResponse = await pfsService.deleteFile(schemaName, rootFileTempKey + '-' + i + '.txt');
                    expect(deletedFileResponse.Hidden).to.be.true;
                    i++;
                }

                await expect(pfsService.deleteFile(schemaName, folderTempKey + '/')).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Bad request. Folder content must be deleted before the deletion of the folder.","detail":{"errorcode":"BadRequest"}}}`,
                );

                let f = 1;
                while (f < 21) {
                    deletedFileResponse = await pfsService.deleteFile(
                        schemaName,
                        folderTempKey + '/' + folderFiletempKey + '-' + f + '.txt',
                    );
                    expect(deletedFileResponse.Hidden).to.be.true;
                    f++;
                }
            });

            it(`Include Deleted`, async () => {
                const getFileResponse = await pfsService.getFilesList(schemaName, folderTempKey + '/', {
                    include_deleted: true,
                });
                expect(getFileResponse).to.be.an('Array').with.lengthOf(20);
                expect(getFileResponse[0].Hidden).to.be.true;
                expect(getFileResponse[1].Hidden).to.be.true;
                expect(getFileResponse[2].Hidden).to.be.true;
                expect(getFileResponse[3].Hidden).to.be.true;
                expect(getFileResponse[4].Hidden).to.be.true;
                expect(getFileResponse[5].Hidden).to.be.true;
                expect(getFileResponse[6].Hidden).to.be.true;
                expect(getFileResponse[7].Hidden).to.be.true;
                expect(getFileResponse[8].Hidden).to.be.true;
                expect(getFileResponse[9].Hidden).to.be.true;
                expect(getFileResponse[10].Hidden).to.be.true;
                expect(getFileResponse[11].Hidden).to.be.true;
                expect(getFileResponse[12].Hidden).to.be.true;
                expect(getFileResponse[13].Hidden).to.be.true;
                expect(getFileResponse[14].Hidden).to.be.true;
                expect(getFileResponse[15].Hidden).to.be.true;
                expect(getFileResponse[16].Hidden).to.be.true;
                expect(getFileResponse[17].Hidden).to.be.true;
                expect(getFileResponse[18].Hidden).to.be.true;
                expect(getFileResponse[19].Hidden).to.be.true;
            });

            it(`Delete folder`, async () => {
                generalService.sleep(180000);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, folderTempKey + '/');
                expect(deletedFileResponse.Hidden).to.be.true;
            });
        });

        describe('PresignedURL, thumbnails, hard delete', () => {
            it(`Post file and PUT to presigned URL`, async () => {
                const tempKey = 'PresignedURLFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                const putImage = await pfsService.getFileFromURL(
                    'https://en.wikipedia.org/wiki/JPEG#/media/File:Felis_silvestris_silvestris_small_gradual_decrease_of_quality.png',
                );
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    MIME: 'image/jpeg',
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('image/jpeg');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('None');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(postFileResponse).to.have.property('PresignedURL').that.is.a('string').and.is.not.empty;
                const putResponse = await pfsService.putPresignedURL(postFileResponse.PresignedURL, putImage);
                expect(putResponse.ok).to.equal(true);
                expect(putResponse.status).to.equal(200);
                const presignedPutFile = await pfsService.getFileFromURL(postFileResponse.URL);
                expect(putImage).to.deep.equal(presignedPutFile);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Key).to.equal(tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post image file with thumbnail + delete thumbnail`, async () => {
                const tempKey = 'ThumbnailFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Thumbnails: [
                        {
                            Size: '200x200',
                        },
                    ],
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('image/png');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(postFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(postFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(postFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const deleteThumbnailResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Thumbnails: [],
                    Description: tempDescription,
                });
                expect(deleteThumbnailResponse.Key).to.equal(tempKey);
                expect(deleteThumbnailResponse.URL).to.include('https://pfs.');
                expect(deleteThumbnailResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(deleteThumbnailResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.empty;
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Add thumbnail to existing image`, async () => {
                const tempKey = 'ThumbnailFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('image/png');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const updateFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Thumbnails: [
                        {
                            Size: '200x200',
                        },
                    ],
                    Description: tempDescription,
                    Cache: false,
                });
                expect(updateFileResponse.Key).to.equal(tempKey);
                expect(updateFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(updateFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(updateFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
                generalService.sleep(60000);
                const thumbnailAfterDelete = await pfsService.getFileFromURLNoBuffer(
                    updateFileResponse.Thumbnails[0].URL,
                );
                expect(thumbnailAfterDelete.Body.Text).to.include('AccessDenied');
            });

            it(`Post image file with thumbnail, verify thumbnail is updated after image update`, async () => {
                const tempKey = 'ThumbnailFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Cache: false,
                    Thumbnails: [
                        {
                            Size: '200x200',
                        },
                    ],
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('image/png');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(postFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(postFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(postFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const postThumbnail = await pfsService.getFileFromURL(postFileResponse.Thumbnails[0].URL);
                const updateFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAADiCAMAAAD5w+JtAAAAOVBMVEX///+BgYF+fn6mpqbm5uZycnJvb292dnbk5OR/f3/Kysrz8/PFxcX5+fmXl5d7e3uHh4ft7e2qqqrlWm1NAAAAvklEQVR4nO3XCw7CIBRFwT5KpdZP1f0vVmOscQMExZkVnJsmBYYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhGh/m4m8acW3dUcjqXNSKVmFuX1HFJ8bSPa+uUKkq8rMfWKTUs67YvptYtNYzpvS/dWsdU8LlvbB1TgX2/7Z/29fh/6f18GHbbvNLl+T7kx83seX1ZWpdUMkdJUaZe5z2+YB5T7vT1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAduANy0AJFN8zV0wAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Description: tempDescription,
                    Cache: false,
                });
                expect(updateFileResponse.Key).to.equal(tempKey);
                expect(updateFileResponse.URL).to.include('https://pfs.');
                expect(updateFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(updateFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(updateFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(updateFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const updateThumbnail = await pfsService.getFileFromURL(updateFileResponse.Thumbnails[0].URL + '?asa');
                expect(postThumbnail).to.not.deep.equal(updateThumbnail);
                verifyAfterPurge.push(updateFileResponse.Thumbnails[0].URL, updateFileResponse.URL);
            });

            it(`Post image file with thumbnail, verify invalidation + negative`, async () => {
                const Folder = 'InvalidateTestFolder';
                const tempKey =
                    Folder + '/' + 'InvalidateFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Cache: true,
                    Thumbnails: [
                        {
                            Size: '200x200',
                        },
                    ],
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal(Folder);
                expect(postFileResponse.Hidden).to.be.false;
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('image/png');
                expect(postFileResponse.Name).to.equal(tempKey.split(Folder + '/')[1]);
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(postFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(postFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(postFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const thumbnailBeforeInvalidate = await pfsService.getFileFromURL(postFileResponse.Thumbnails[0].URL);
                const fileBeforeInvalidate = await pfsService.getFileFromURL(postFileResponse.URL);
                const updateFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAADiCAMAAAD5w+JtAAAAOVBMVEX///+BgYF+fn6mpqbm5uZycnJvb292dnbk5OR/f3/Kysrz8/PFxcX5+fmXl5d7e3uHh4ft7e2qqqrlWm1NAAAAvklEQVR4nO3XCw7CIBRFwT5KpdZP1f0vVmOscQMExZkVnJsmBYYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhGh/m4m8acW3dUcjqXNSKVmFuX1HFJ8bSPa+uUKkq8rMfWKTUs67YvptYtNYzpvS/dWsdU8LlvbB1TgX2/7Z/29fh/6f18GHbbvNLl+T7kx83seX1ZWpdUMkdJUaZe5z2+YB5T7vT1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAduANy0AJFN8zV0wAAAABJRU5ErkJggg==',
                    MIME: 'image/png',
                    Description: tempDescription,
                    Cache: false,
                });
                expect(updateFileResponse.Key).to.equal(tempKey);
                expect(updateFileResponse.URL).to.include('https://pfs.');
                expect(updateFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(updateFileResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(updateFileResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(updateFileResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                const invalidateResponse = await pfsService.invalidate(schemaName, tempKey);
                expect(invalidateResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(invalidateResponse.CreationDateTime).to.include('Z');
                expect(invalidateResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(invalidateResponse.ModificationDateTime).to.include('Z');
                expect(invalidateResponse.Description).to.equal(tempDescription);
                expect(invalidateResponse.Folder).to.equal(Folder);
                expect(invalidateResponse.Hidden).to.be.false;
                expect(invalidateResponse.Key).to.equal(tempKey);
                expect(invalidateResponse.MIME).to.equal('image/png');
                expect(invalidateResponse.Name).to.equal(tempKey.split(Folder + '/')[1]);
                expect(invalidateResponse.URL).to.include('https://pfs.');
                expect(invalidateResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                expect(invalidateResponse).to.have.property('Thumbnails').that.is.an('Array').and.is.not.empty;
                expect(invalidateResponse.Thumbnails[0]).to.have.property('Size').that.equals('200x200');
                expect(invalidateResponse.Thumbnails[0]).to.have.property('URL').that.includes('_200x200');
                generalService.sleep(60000);
                const thumbnailAfterInvalidate = await pfsService.getFileFromURL(postFileResponse.Thumbnails[0].URL);
                const fileAfterInvalidate = await pfsService.getFileFromURL(postFileResponse.URL);
                expect(thumbnailBeforeInvalidate).to.not.deep.equal(thumbnailAfterInvalidate);
                expect(fileBeforeInvalidate).to.not.deep.equal(fileAfterInvalidate);
                await expect(pfsService.invalidate(schemaName, 'NegativeShouldFail.png')).eventually.to.be.rejectedWith(
                    `${generalService.papiClient['options'].baseURL}/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/pfsTestSchema/NegativeShouldFail.png/invalidate failed with status: 404 - Not Found error: {"fault":{"faultstring":"Failed due to exception: Could not find requested item: 'NegativeShouldFail.png'","detail":{"errorcode":"NotFound"}}}`,
                );
            });

            it(`Thumbnail negative tests`, async () => {
                const tempKey = 'ThumbnailNegativeFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey,
                        URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                        MIME: 'image/png',
                        Thumbnails: [
                            {
                                Size: '200x200',
                            },
                            {
                                Size: '200x200',
                            },
                        ],
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: A maximum of a single thumbnail is supported.","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey,
                        URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                        MIME: 'image/png',
                        Thumbnails: [
                            {
                                Size: '400x400',
                            },
                        ],
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Size of thumbnail should be '200x200'.","detail":{"errorcode":"BadRequest"}}}`,
                );
                await expect(
                    pfsService.postFile(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                        MIME: 'file/plain',
                        Thumbnails: [
                            {
                                Size: '200x200',
                            },
                        ],
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Bad Request. Creating a thumbnail for MIME type file/plain is not supported.","detail":{"errorcode":"BadRequest"}}}`,
                );
            });

            // it(`Post file, hard delete and verify`, async () => {
            //     const tempKey = 'HardDeleteFile' + Math.floor(Math.random() * 1000000).toString() + '.jpg';
            //     const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            //     const postFileResponse = await pfsService.postFile({
            //         "Key": tempKey,
            //         "URI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
            //         "MIME": "image/png",
            //         "Cache": false,
            //         "Description": tempDescription
            //     });
            //     expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
            //     expect(postFileResponse.CreationDateTime).to.include('Z');
            //     expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
            //     expect(postFileResponse.ModificationDateTime).to.include('Z');
            //     expect(postFileResponse.Description).to.equal(tempDescription);
            //     expect(postFileResponse.Folder).to.equal('/');
            //     expect(postFileResponse.Key).to.equal(tempKey);
            //     expect(postFileResponse.MIME).to.equal('image/png');
            //     expect(postFileResponse.Name).to.equal(tempKey);
            //     expect(postFileResponse.URL).to.include('https://pfs.');
            //     expect(postFileResponse.URL).to.include('.pepperi.com/' + distributor.UUID + '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '/' + tempKey);
            //     const postedFile = await pfsService.getFileAfterDelete(postFileResponse.URL);
            //     const hardDeleteResponse = await pfsService.hardDelete(distributor.UUID, 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',varKey, tempKey)
            //     expect(hardDeleteResponse.Ok).to.be.true;
            //     generalService.sleep(20000);
            //     const postedFileAfterHardDelete = await pfsService.getFileAfterDelete(postFileResponse.URL);
            //     expect(postedFile).to.not.deep.equal(postedFileAfterHardDelete);
            //     expect(postedFileAfterHardDelete.Text).to.include('Access Denied');
            //     expect(postedFileAfterHardDelete.Type).to.equal('Error');
            // });
        });

        describe('Lock mechanism and rollback tests', () => {
            it(`Post file + update and verify fail after lock`, async () => {
                const tempKey = 'FailAfterLockTest' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const lockKey =
                    distributor.UUID + '~' + 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe~' + schemaName + '~' + tempKey;
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                await expect(
                    pfsService.postFileFailAfterLock(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Test lock mechanism: Fail after locking file.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const lockTableResult = await pfsService.getLockTable(lockKey, varKey);
                expect(lockTableResult[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].CreationDateTime).to.include('Z');
                expect(lockTableResult[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].ModificationDateTime).to.include('Z');
                expect(lockTableResult[0].Hidden).to.be.false;
                await expect(
                    pfsService.rollBack(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Testing rollback - finishing execution after rollback was done.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const getFileResponse = await pfsService.getFile(schemaName, tempKey);
                expect(getFileResponse).to.deep.equal(postFileResponse);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file + update and verify fail after S3`, async () => {
                const tempKey = 'FailAfterS3Test' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const lockKey =
                    distributor.UUID + '~' + 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe~' + schemaName + '~' + tempKey;
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                await expect(
                    pfsService.postFileFailAfterS3(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Test lock mechanism: Fail after mutating S3.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const lockTableResult = await pfsService.getLockTable(lockKey, varKey);
                expect(lockTableResult[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].CreationDateTime).to.include('Z');
                expect(lockTableResult[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].ModificationDateTime).to.include('Z');
                expect(lockTableResult[0].Hidden).to.be.false;
                await expect(
                    pfsService.rollBack(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Testing rollback - finishing execution after rollback was done.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const getFileResponse = await pfsService.getFile(schemaName, tempKey);
                expect(getFileResponse).to.deep.equal(postFileResponse);
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Post file + update and verify fail after ADAL`, async () => {
                const tempKey = 'FailAfterADALTest' + Math.floor(Math.random() * 1000000).toString() + '.txt';
                const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
                const lockKey =
                    distributor.UUID + '~' + 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe~' + schemaName + '~' + tempKey;
                const postFileResponse = await pfsService.postFile(schemaName, {
                    Key: tempKey,
                    URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                    MIME: 'file/plain',
                    Sync: 'Device',
                    Description: tempDescription,
                });
                expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.CreationDateTime).to.include('Z');
                expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFileResponse.ModificationDateTime).to.include('Z');
                expect(postFileResponse.Description).to.equal(tempDescription);
                expect(postFileResponse.Folder).to.equal('/');
                expect(postFileResponse.Key).to.equal(tempKey);
                expect(postFileResponse.MIME).to.equal('file/plain');
                expect(postFileResponse.Name).to.equal(tempKey);
                expect(postFileResponse.Sync).to.equal('Device');
                expect(postFileResponse.URL).to.include('https://pfs.');
                expect(postFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                await expect(
                    pfsService.postFileFailAfterADAL(schemaName, {
                        Key: tempKey,
                        URI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAADiCAMAAAD5w+JtAAAAOVBMVEX///+BgYF+fn6mpqbm5uZycnJvb292dnbk5OR/f3/Kysrz8/PFxcX5+fmXl5d7e3uHh4ft7e2qqqrlWm1NAAAAvklEQVR4nO3XCw7CIBRFwT5KpdZP1f0vVmOscQMExZkVnJsmBYYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhGh/m4m8acW3dUcjqXNSKVmFuX1HFJ8bSPa+uUKkq8rMfWKTUs67YvptYtNYzpvS/dWsdU8LlvbB1TgX2/7Z/29fh/6f18GHbbvNLl+T7kx83seX1ZWpdUMkdJUaZe5z2+YB5T7vT1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAduANy0AJFN8zV0wAAAABJRU5ErkJggg==',
                        MIME: 'image/png',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Test lock mechanism: Fail after mutating ADAL.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const lockTableResult = await pfsService.getLockTable(lockKey, varKey);
                expect(lockTableResult[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].CreationDateTime).to.include('Z');
                expect(lockTableResult[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(lockTableResult[0].ModificationDateTime).to.include('Z');
                expect(lockTableResult[0].Hidden).to.be.false;
                await expect(
                    pfsService.rollBack(schemaName, {
                        Key: tempKey,
                        URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                        MIME: 'file/plain',
                        Sync: 'Device',
                        Description: tempDescription + ' UPDATE 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Testing rollback - finishing execution after rollback was done.","detail":{"errorcode":"BadRequest"}}}`,
                );
                const getFileResponse = await pfsService.getFile(schemaName, tempKey);
                expect(getFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.CreationDateTime).to.include('Z');
                expect(getFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFileResponse.ModificationDateTime).to.include('Z');
                expect(getFileResponse.Description).to.equal(tempDescription + ' UPDATE');
                expect(getFileResponse.Folder).to.equal('/');
                expect(getFileResponse.Key).to.equal(tempKey);
                expect(getFileResponse.MIME).to.equal('image/png');
                expect(getFileResponse.Name).to.equal(tempKey);
                expect(getFileResponse.Sync).to.equal('Device');
                expect(getFileResponse.URL).to.include('https://pfs.');
                expect(getFileResponse.URL).to.include(
                    '.pepperi.com/' +
                        distributor.UUID +
                        '/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' +
                        schemaName +
                        '/' +
                        tempKey,
                );
                const deletedFileResponse = await pfsService.deleteFile(schemaName, tempKey);
                expect(deletedFileResponse.Hidden).to.be.true;
            });

            it(`Delete pfs Schema and verify purged files`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                try {
                    await adalService.deleteSchema(schemaName);
                } catch (error) {
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                generalService.sleep(70000);
                const verifyPurgedFile = await pfsService.getFileFromURLNoBuffer(verifyAfterPurge[1] + '?asda');
                expect(verifyPurgedFile.Body.Text).to.include('AccessDenied');
                const verifyPurgedThumbnail = await pfsService.getFileFromURLNoBuffer(verifyAfterPurge[0] + '?asda');
                expect(verifyPurgedThumbnail.Body.Text).to.include('AccessDenied');
            });
        });
    });
}
