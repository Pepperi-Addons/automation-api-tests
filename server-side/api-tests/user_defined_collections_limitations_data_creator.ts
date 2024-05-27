import GeneralService, { TesterFunctions } from '../services/general.service';
import { PFSService } from '../services/pfs.service';
import fs from 'fs';
import * as path from 'path';

export async function UDCLimitationTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDCLimitationTests(generalService, request, tester);
}
export async function UDCLimitationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    // await generalService.baseAddonVersionsInstallation(varKey);
    //#region Upgrade UDC
    const testData = {
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        // 'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        // 'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        // 'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        // ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        // 'User Defined Collections': [UserDefinedCollectionsUUID, ''],
        // 'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''],
        // 'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade UDC

    describe('UDC Tests Suites', () => {
        describe('Prerequisites Addon for UDC Tests', () => {
            //Test Data
            //UDC
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
        describe('Base Collection Testing', () => {
            it(`1. Hard Deleting All The UDC's We Have`, async function () {
                // const allUdcsIncludingDeleted = await udcService.getSchemes({ page_size: -1 });
                // console.log('there are: ' + allUdcsIncludingDeleted.length + ' Collections');
                // for (let index = 0; index < allUdcsIncludingDeleted.length; index++) {
                //     const element = allUdcsIncludingDeleted[index];
                //     const hideCollectionResponse = await udcService.hideCollection(element.Name);
                //     if (hideCollectionResponse.Body.fault.faultstring && hideCollectionResponse.Body.fault.faultstring == 'Failed due to exception: Cannot delete collection with documents'){
                //         expect(element.Name).to.equal('UserDefinedCollectionsSettings');
                //     }else{
                //         expect(hideCollectionResponse.Ok).to.equal(true);
                //         expect(hideCollectionResponse.Status).to.equal(200);
                //         expect(hideCollectionResponse.Body.Name).to.equal(element.Name);
                //         console.log('Deleted ' + element.Name + ' collection');
                //         console.log('there are: ' + (allUdcsIncludingDeleted.length - (index + 1)) + ' collecions left');
                //     }
                // }
            });
            it(`1. Metadata - create 49 UDC's`, async () => {
                // const SOFT_META_DATA_LIMIT = 100;
                // let numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                // const numOfNeededCollectionsUntilGettingToLimit = SOFT_META_DATA_LIMIT - numOfInitialCollections;
                // console.log(
                //     'need: ' +
                //         numOfNeededCollectionsUntilGettingToLimit +
                //         ' collections until limit of: ' +
                //         SOFT_META_DATA_LIMIT,
                // );
                // for (let index = 0; index < numOfNeededCollectionsUntilGettingToLimit; index++) {
                //     const name = generalService.generateRandomString(5);
                //     const response = await udcService.createUDCWithFields(name.toLocaleUpperCase(), []);
                //     expect(response.Fail).to.be.undefined;
                //     expect(response).to.deep.equal({});
                //     generalService.sleep(5000);
                //     const documents = await udcService.getSchemes({ page_size: -1 });
                //     expect(documents.length).to.equal(numOfInitialCollections + 1);
                //     numOfInitialCollections++;
                //     console.log('now we have: ' + numOfInitialCollections + ' collections');
                // }
                // debugger;
            });
            it('Positive Test: create a UDC based on "scheme only" UDC', async () => {
                // for (let index = 0; index < 4999; index++) {
                //     const fieldValues = { a: generalService.generateRandomString(5) };
                //     const response = await udcService.sendDataToField('NotIndexedColl', fieldValues);
                //     expect(response.Ok).to.equal(true);
                //     expect(response.Status).to.equal(200);
                //     expect(response.Body.Hidden).to.equal(false);
                //     expect(response.Body).to.haveOwnProperty('Key');
                // }
                debugger;
                const pfsService = new PFSService(generalService);
                const dimxOverWriteCollectionName = 'ImportCollection';
                const howManyRows = 250000;
                let counter = 0;
                for (let index = 0; index < 1; index++) {
                    //1. create the file to import
                    const fileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
                    const mime = 'text/csv';
                    const tempFileResponse = await pfsService.postTempFile({
                        FileName: fileName,
                        MIME: mime,
                    });
                    expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                    expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                    expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
                    const csvFileName = await createInitalData(howManyRows);
                    const localPath = __dirname;
                    const combinedPath = path.join(localPath, csvFileName);
                    const buf = fs.readFileSync(combinedPath);
                    const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
                    expect(putResponsePart1.ok).to.equal(true);
                    expect(putResponsePart1.status).to.equal(200);
                    //3. import file to UDC
                    const bodyToImport = {
                        URI: tempFileResponse.TemporaryFileURL,
                    };
                    const importResponse = await generalService.fetchStatus(
                        `/addons/data/import/file/${UserDefinedCollectionsUUID}/${dimxOverWriteCollectionName}`,
                        { method: 'POST', body: JSON.stringify(bodyToImport) },
                    );
                    const executionURI = importResponse.Body.URI;
                    const auditLogDevTestResponse = await generalService.getAuditLogResultObjectIfValid(
                        executionURI as string,
                        250,
                        7000,
                    );
                    if (auditLogDevTestResponse.Status) {
                        expect(auditLogDevTestResponse.Status.Name).to.equal('Success');
                    } else {
                        expect(auditLogDevTestResponse.Status).to.not.be.undefined;
                    }
                    const lineStats = JSON.parse(auditLogDevTestResponse.AuditInfo.ResultObject).LinesStatistics;
                    expect(lineStats.Inserted).to.equal(howManyRows);
                    counter += 200000;
                    generalService.sleep(1000 * 150); //let PNS Update
                    console.log('** done importing: ' + counter + ' rows');
                    debugger;
                }
                debugger;
            });
        });
    });
}

async function createInitalData(howManyDataRows: number) {
    const headers = 'code,value';
    const runningDataCode = 'data_index';
    const runningDataValue = 'old_value_index';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataCode.replace('index', index.toString())},`;
        strData += `${runningDataValue.replace('index', index.toString())}\n`;
    }
    return await genrateFile('Data', strData);
}

async function genrateFile(tempFileName, data) {
    let filePath;
    try {
        const localPath = __dirname;
        filePath = `./test-data/${tempFileName}.csv`;
        const xx = path.join(localPath, filePath);
        fs.writeFileSync(xx, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
    return filePath;
}
