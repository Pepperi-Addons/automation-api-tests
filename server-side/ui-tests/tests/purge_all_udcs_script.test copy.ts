import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
// import { UDCService } from '../../services/user-defined-collections.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PFSService } from '../../services/pfs.service';
import fs from 'fs';

chai.use(promised);

export async function PurgeAllUcds(client: Client) {
    const generalService = new GeneralService(client);
    // const udcService = new UDCService(generalService);
    //in case you want to filter specific collections by name
    // const UDCPrefixName = "DimxOverwrite";
    describe('Purging All UDCs With Certaing Prefix', async function () {
        it(`Purging All UDCs With Certaing Prefix`, async function () {
            // let allUdcs = await udcService.getSchemes({ page_size: -1 });
            // //in case you want to filter specific collections by name
            // // let onlyRelevantUdcs = allUdcs.filter(doc => (doc.Name.includes(UDCPrefixName) && doc.Hidden === false));
            // const onlyRelevantUdcNames = allUdcs.map((doc) => doc.Name);
            // for (let index = 0; index < onlyRelevantUdcNames.length; index++) {
            //     const udcName = onlyRelevantUdcNames[index];
            //     await udcService.purgeScheme(udcName);
            //     generalService.sleep(2500);
            //     allUdcs = await udcService.getSchemes({ page_size: -1 });
            //     console.log(`${udcName} was deleted, ${allUdcs.length} left`);
            // }
            // let auditLogResponse;
            // let counter = 0;
            // do {
            //     if (counter > 0) {
            //         console.log(`trying for the: ${counter} time!`);
            //     }
            //     const addonUUID = '00000000-0000-0000-0000-000000006a91';
            //     const uninstallResponse = await generalService.papiClient.addons.installedAddons
            //         .addonUUID(`${addonUUID}`)
            //         .uninstall();
            //     auditLogResponse = await generalService.getAuditLogResultObjectIfValid(
            //         uninstallResponse.URI as string,
            //         40,
            //     );
            //     console.log(`received: ${JSON.stringify(auditLogResponse)}`);
            //     counter++;
            // } while (
            //     auditLogResponse.AuditInfo.ErrorMessage.includes(
            //         '504 - Gateway Timeout error: {"message":"Endpoint request timed out"}',
            //     )
            // );
            debugger;
            const pfsService = new PFSService(generalService);
            const howManyRows = 50000;
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
            await createInitalData(howManyRows);
            const buf = fs.readFileSync('./Data.csv');
            debugger;
            const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
            expect(putResponsePart1.ok).to.equal(true);
            expect(putResponsePart1.status).to.equal(200);
            const bodyToImport = {
                URI: tempFileResponse.TemporaryFileURL,
            };
            const importResponse = await generalService.fetchStatus(
                `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/di22999`,
                { method: 'POST', body: JSON.stringify(bodyToImport) },
            );
            const executionURI = importResponse.Body.URI;
            const auditLogDevTestResponse = await generalService.getAuditLogResultObjectIfValid(
                executionURI as string,
                120,
                7000,
            );
            debugger;
        });
    });
}


async function createInitalData(howManyDataRows: number) {
    const headers = 'Value,Hidden';
    const runningDataValue1 = 'index';
    const runningDataValue2 = 'false';
    const runningDataValue3 = 'data';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataValue1.replace('index', index.toString())},`;
        strData += `${runningDataValue2.replace('index', index.toString())}\n`;
    }
    await genrateFile('Data', strData);
}


async function genrateFile(tempFileName, data) {
    try {
        fs.writeFileSync(`./${tempFileName}.csv`, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
}
