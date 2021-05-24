import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';

export async function BulkBigDataTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let bulkAccountExternalID = 'API bulk 60K';
    let runTest = await service.countAccounts({
        where: "ExternalID like '%API bulk 60K%'", include_deleted: true
    });

    if (runTest == 60000) {
        runTest = true as any
    }

    describe('Bulk Big Data 60K accounts test', () => {
        let bulkCreateAccount
        let bulkJobInfo;
        let bulkAccountArray;

        // it('Bulk create 60,000 accounts', async () => {
        //     bulkAccountArray = service.createBulkArray(60000, bulkAccountExternalID, 0);
        //     bulkCreateAccount = await service.bulkCreate('accounts', {
        //         Headers: ['ExternalID', 'Name', 'Hidden'],
        //         Lines: bulkAccountArray,
        //     });
        //     expect(bulkCreateAccount.JobID).to.be.a('number'),
        //         expect(bulkCreateAccount.URI).to.include('/bulk/jobinfo/' + bulkCreateAccount.JobID);
        // });

        // it('Verify bulk 60,000 accounts jobinfo', async () => {
        //     bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateAccount.JobID, 300000);
        //     expect(bulkJobInfo.ID).to.equal(bulkCreateAccount.JobID),
        //         expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
        //         expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
        //         expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
        //             new Date().toISOString().split('T')[0],
        //         ),
        //         expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
        //         expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
        //         expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
        //         expect(bulkJobInfo.Records, 'Records').to.equal(60000),
        //         expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(60000),
        //         expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
        //         expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(0),
        //         expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
        //         expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
        //         expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
        //         expect(bulkJobInfo.Error, 'Error').to.equal('');
        // });

        // it('Verify bulk 60,000 accounts', async () => {
        //     return Promise.all([
        //         expect(
        //             await service.countAccounts({
        //                 where: "ExternalID like '%API bulk 60K%'",
        //             }),
        //         )
        //             .to.be.a('number')
        //             .and.equals(60000),
        //     ]);
        // });


        it('Verify 60,000 accounts available for test', async () => {
            return Promise.all([
                expect(
                    await service.countAccounts({
                        where: "ExternalID like '%API bulk 60K%'", include_deleted: true
                    }),
                )
                    .to.be.a('number')
                    .and.equals(60000),
            ]);
        });

        if (runTest) {

            it('Bulk remove hidden from 60,000 accounts', async () => {
                bulkAccountArray = service.createBulkArray(60000, bulkAccountExternalID, 0);
                bulkCreateAccount = await service.bulkCreate('accounts', {
                    Headers: ['ExternalID', 'Name', 'Hidden'],
                    Lines: bulkAccountArray,
                });
                expect(bulkCreateAccount.JobID).to.be.a('number'),
                    expect(bulkCreateAccount.URI).to.include('/bulk/jobinfo/' + bulkCreateAccount.JobID);
            });

            it('Verify bulk 60,000 accounts remove hidden jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateAccount.JobID, 300000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateAccount.JobID),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                    expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                    expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                    expect(bulkJobInfo.Records, 'Records').to.equal(60000),
                    expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(0),
                    expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                    expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(60000),
                    expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                    expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                    expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                    expect(bulkJobInfo.Error, 'Error').to.equal('');
            });

            it('Verify bulk 60,000 accounts remove hidden', async () => {
                return Promise.all([
                    expect(
                        await service.countAccounts({
                            where: "ExternalID like '%API bulk 60K%'",
                        }),
                    )
                        .to.be.a('number')
                        .and.equals(60000),
                ]);
            });

            it('Bulk delete 60,000 accounts', async () => {
                bulkAccountArray = service.createBulkArray(60000, bulkAccountExternalID, 1);
                bulkCreateAccount = await service.bulkCreate('accounts', {
                    Headers: ['ExternalID', 'Name', 'Hidden'],
                    Lines: bulkAccountArray,
                });
                expect(bulkCreateAccount.JobID).to.be.a('number'),
                    expect(bulkCreateAccount.URI).to.include('/bulk/jobinfo/' + bulkCreateAccount.JobID);
            });

            it('Verify bulk 60,000 accounts delete jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateAccount.JobID, 300000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateAccount.JobID),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                    expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                    expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                    expect(bulkJobInfo.Records, 'Records').to.equal(60000),
                    expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(0),
                    expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                    expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(60000),
                    expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                    expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                    expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                    expect(bulkJobInfo.Error, 'Error').to.equal('');
            });

            it('Verify bulk 60,000 accounts delete', async () => {
                return Promise.all([
                    expect(
                        await service.countAccounts({
                            where: "ExternalID like '%API bulk 60K%'",
                        }),
                    )
                        .to.be.a('number')
                        .and.equals(0),
                ]);
            });
        }
    });
}
