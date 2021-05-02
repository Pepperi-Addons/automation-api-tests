import GeneralService, { TesterFunctions } from '../services/general.service';

export async function CodeJobsCleanTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const codeJobsResponse = await generalService.fetchStatus(
        'GET',
        '/code_jobs?Fields=IsScheduled,CodeJobName&page_size=1000',
    );
    const scheduledCodeJobsArr: any = [];
    for (let index = 0; index < codeJobsResponse.Body.length; index++) {
        if (codeJobsResponse.Body[index].IsScheduled) {
            scheduledCodeJobsArr.push(codeJobsResponse.Body[index]);
        }
    }

    for (let index = 0; index < codeJobsResponse.Body.length; index++) {
        const oren = await service.codeJobs.upsert({
            CodeJobName: codeJobsResponse.Body[index].CodeJobName,
            UUID: codeJobsResponse.Body[index].UUID,
            CodeJobIsHidden: true,
            IsScheduled: false,
        });

        console.log({ oren: oren });
    }

    describe('Cleaned Data', () => {
        it(`Found ${codeJobsResponse.Body.length} Total Code Jobs And Removed Them All`, async () => {
            const codeJobsResponse = await generalService.fetchStatus(
                'GET',
                '/code_jobs?Fields=IsScheduled&page_size=1000',
            );
            expect(codeJobsResponse.Body.length).to.equal(0);
        });

        it(`Found ${scheduledCodeJobsArr.Body.length} Scheduled Code Jobs And Removed Them All`, async () => {
            const codeJobsResponse = await generalService.fetchStatus(
                'GET',
                '/code_jobs?Fields=IsScheduled&page_size=1000',
            );
            const scheduledCodeJobsArr: any = [];
            for (let index = 0; index < codeJobsResponse.Body.length; index++) {
                if (codeJobsResponse.Body[index].IsScheduled) {
                    scheduledCodeJobsArr.push(codeJobsResponse.Body[index]);
                }
            }
            expect(scheduledCodeJobsArr.Body.length).to.equal(0);
        });
    });
}
