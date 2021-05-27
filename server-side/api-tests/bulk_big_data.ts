import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';

export async function BulkBigDataTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const bulkAccountExternalID = 'API bulk 60K';
    const UDTRandom = 'Big Bulk UDT';
    let runAccountTest = await service.countAccounts({
        where: "ExternalID like '%API bulk 60K%'",
        include_deleted: true,
    });

    let runUDTTest = await service.countUDTRows({
        where: "MapDataExternalID like '%Big Bulk UDT%'",
        include_deleted: true,
    });

    if (runAccountTest == 10000) {
        runAccountTest = true as any;
    }

    describe('Bulk Big Data tests', () => {
        let bulkCreateAccount;
        let bulkJobInfo;
        let bulkAccountArray;
        let createdUDT;
        let bulkUpdateUDT;
        let bulkUDTArray;

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
                        where: "ExternalID like '%API bulk 60K%'",
                        include_deleted: true,
                    }),
                )
                    .to.be.a('number')
                    .and.equals(60000),
            ]);
        });

        if (runAccountTest) {
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

        it('Verify 10,000 UDT rows available for test', async () => {
            return Promise.all([
                expect(
                    await service.countUDTRows({
                        where: "MapDataExternalID like '%Big Bulk UDT%'",
                        include_deleted: true,
                    }),
                )
                    .to.be.a('number')
                    .and.equals(10000),
            ]);
        });

        if (runUDTTest) {
            // it('Create UDT meta data', async () => {
            //     createdUDT = await service.postUDTMetaData({
            //         TableID: UDTRandom,
            //         MainKeyType: {
            //             ID: 35,
            //             Name: 'Account External ID',
            //         },
            //         SecondaryKeyType: {
            //             ID: 0,
            //             Name: 'Any',
            //         },
            //     });
            // });

            it('Bulk update 10,000 UDT', async () => {
                bulkUDTArray = service.createBulkUDTArray(10000, UDTRandom, 0);
                bulkUpdateUDT = await service.bulkCreate('user_defined_tables', {
                    Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values', 'Hidden'],
                    Lines: bulkUDTArray
                });
                expect(bulkUpdateUDT.JobID).to.be.a('number'),
                    expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
            });

            it('Verify bulk jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkUpdateUDT.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkUpdateUDT.JobID),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                    expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                    expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                    expect(bulkJobInfo.Records, 'Records').to.equal(10000),
                    expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(0),
                    expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                    expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(10000),
                    expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                    expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                    expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                    expect(bulkJobInfo.Error, 'Error').to.equal('');
            });

            it('Verify 10,000 bulk UDT remove hidden', async () => {
                return Promise.all([
                    expect(
                        await service.countUDTRows({
                            where: "MapDataExternalID like '%Big Bulk UDT%'",
                            include_deleted: true,
                        }),
                    )
                        .to.be.a('number')
                        .and.equals(10000),
                ]);
            });

            it('Bulk delete 10,000 UDT', async () => {
                bulkUDTArray = service.createBulkUDTArray(10000, UDTRandom, 1);
                bulkUpdateUDT = await service.bulkCreate('user_defined_tables', {
                    Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values', 'Hidden'],
                    Lines: bulkUDTArray
                });
                expect(bulkUpdateUDT.JobID).to.be.a('number'),
                    expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
            });

            it('Verify bulk jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkUpdateUDT.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkUpdateUDT.JobID),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                    expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                    expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                    expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                    expect(bulkJobInfo.Records, 'Records').to.equal(10000),
                    expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(0),
                    expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                    expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(10000),
                    expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                    expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                    expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                    expect(bulkJobInfo.Error, 'Error').to.equal('');
            });

            it('Verify 10,000 bulk UDT delete', async () => {
                return Promise.all([
                    expect(
                        await service.countUDTRows({
                            where: "MapDataExternalID like '%Big Bulk UDT%'"
                        }),
                    )
                        .to.be.a('number')
                        .and.equals(0),
                ]);
            });
        }
    });
}
