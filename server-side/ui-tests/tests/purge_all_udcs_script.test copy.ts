import { describe, it } from 'mocha';
import chai from 'chai';
import promised from 'chai-as-promised';
// import { UDCService } from '../../services/user-defined-collections.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';

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
            let auditLogResponse;
            let counter = 0;
            do {
                if (counter > 0) {
                    console.log(`trying for the: ${counter} time!`);
                }
                const addonUUID = '00000000-0000-0000-0000-000000006a91';
                const uninstallResponse = await generalService.papiClient.addons.installedAddons
                    .addonUUID(`${addonUUID}`)
                    .uninstall();
                auditLogResponse = await generalService.getAuditLogResultObjectIfValid(
                    uninstallResponse.URI as string,
                    40,
                );
                console.log(`received: ${JSON.stringify(auditLogResponse)}`);
                counter++;
            } while (
                auditLogResponse.AuditInfo.ErrorMessage.includes(
                    '504 - Gateway Timeout error: {"message":"Endpoint request timed out"}',
                )
            );
            debugger;
        });
    });
}
