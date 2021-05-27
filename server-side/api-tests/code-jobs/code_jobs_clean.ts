import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function CodeJobsCleanTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const _addonUUID = service['options'].addonUUID;

    const codeJobsResponse = await generalService.fetchStatus(
        '/code_jobs?Fields=IsScheduled,CodeJobName,UUID,OwnerUUID&page_size=1000',
        {
            method: 'GET',
        },
    );
    const scheduledCodeJobsArr: any = [];
    for (let index = 0; index < codeJobsResponse.Body.length; index++) {
        if (codeJobsResponse.Body[index].IsScheduled) {
            scheduledCodeJobsArr.push(codeJobsResponse.Body[index]);
        }
    }

    for (let index = 0; index < codeJobsResponse.Body.length; index++) {
        if (codeJobsResponse.Body[index].OwnerUUID) {
            service['options'].addonUUID = codeJobsResponse.Body[index].OwnerUUID;
        }
        await service.codeJobs.upsert({
            CodeJobName: codeJobsResponse.Body[index].CodeJobName,
            UUID: codeJobsResponse.Body[index].UUID,
            CodeJobIsHidden: true,
            IsScheduled: false,
        });
        service['options'].addonUUID = _addonUUID;
    }

    describe('Cleaned Data', () => {
        it(`Found ${codeJobsResponse.Body.length} Total Code Jobs And Removed Them All`, async () => {
            const codeJobsResponse = await generalService.fetchStatus('/code_jobs?Fields=IsScheduled&page_size=1000', {
                method: 'GET',
            });
            expect(codeJobsResponse.Body.length).to.equal(0);
        });

        it(`Found ${scheduledCodeJobsArr.length} Scheduled Code Jobs And Removed Them All`, async () => {
            const codeJobsResponse = await generalService.fetchStatus('/code_jobs?Fields=IsScheduled&page_size=1000', {
                method: 'GET',
            });
            const scheduledCodeJobsArr: any = [];
            for (let index = 0; index < codeJobsResponse.Body.length; index++) {
                if (codeJobsResponse.Body[index].IsScheduled) {
                    scheduledCodeJobsArr.push(codeJobsResponse.Body[index]);
                }
            }
            expect(scheduledCodeJobsArr.length).to.equal(0);
        });
    });
}
