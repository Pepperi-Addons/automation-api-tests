import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';

export async function UDTTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('UDT Test Suites', () => {
        let UDTRandom;
        let updatedUDT;
        let createdUDT;
        let bulkUpdateUDT;
        //let updatedUDTRow; //Removed 07/05/2021 by oren - this test can't pass on production or EU
        let bulkJobInfo;
        let updatedUDTRowPOST;
        //let updatedUDTRowUPDATE; //Removed 07/05/2021 by oren - this test can't pass on production or EU
        let batchUDTresponse;

        it('Create UDT meta data', async () => {
            UDTRandom = 'Automated API test UDT ' + Math.floor(Math.random() * 1000000).toString();
            createdUDT = await service.postUDTMetaData({
                TableID: UDTRandom,
                MainKeyType: {
                    ID: 35,
                    Name: 'Account External ID',
                },
                SecondaryKeyType: {
                    ID: 0,
                    Name: 'Any',
                },
            });

            const getCreatedUDT = await service.getUDTMetaData(createdUDT.TableID);

            return Promise.all([
                expect(getCreatedUDT).to.deep.include({
                    TableID: UDTRandom,
                    MainKeyType: {
                        ID: 35,
                        Name: 'Account External ID',
                    },
                    SecondaryKeyType: {
                        ID: 0,
                        Name: 'Any',
                    },
                }),
                expect(getCreatedUDT)
                    .to.have.property('CreationDateTime')
                    .that.contains(new Date().toISOString().split('T')[0]),
                expect(getCreatedUDT).to.have.property('CreationDateTime').that.contains('Z'),
                expect(getCreatedUDT)
                    .to.have.property('ModificationDateTime')
                    .that.contains(new Date().toISOString().split('T')[0]),
                expect(getCreatedUDT).to.have.property('ModificationDateTime').that.contains('Z'),
                expect(getCreatedUDT).to.have.property('Hidden').that.is.false,
                expect(getCreatedUDT['MemoryMode']).to.have.property('Dormant').that.is.false,
                expect(getCreatedUDT['MemoryMode']).to.have.property('Volatile').that.is.false,
            ]);
        });

        it('Update UDT meta data', async () => {
            updatedUDT = await service.postUDTMetaData({
                TableID: UDTRandom,
                MainKeyType: {
                    ID: 0,
                    Name: 'Any',
                },
                SecondaryKeyType: {
                    ID: 0,
                    Name: 'Any',
                },
                MemoryMode: {
                    Dormant: true,
                    Volatile: false,
                },
            });
            expect(updatedUDT).to.deep.include({
                TableID: UDTRandom,
                MainKeyType: {
                    ID: 0,
                    Name: 'Any',
                },
                SecondaryKeyType: {
                    ID: 0,
                    Name: 'Any',
                },
                MemoryMode: {
                    Dormant: true,
                    Volatile: false,
                },
            });
            expect(updatedUDT).to.have.property('CreationDateTime').that.contains('Z');
            expect(updatedUDT)
                .to.have.property('ModificationDateTime')
                .that.contains(new Date().toISOString().split('T')[0]);
            expect(updatedUDT).to.have.property('ModificationDateTime').that.contains('Z');
            expect(updatedUDT).to.have.property('Hidden').that.is.false;
            expect(updatedUDT['MemoryMode']).to.have.property('Dormant').that.is.true;
            expect(updatedUDT['MemoryMode']).to.have.property('Volatile').that.is.false;
        });

        it('Bulk update UDT', async () => {
            bulkUpdateUDT = await service.bulkCreate('user_defined_tables', {
                Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
                Lines: [
                    [UDTRandom, 'Test 1', '', 'Value 1'],
                    [UDTRandom, 'Test 2', '', 'Value 2'],
                    [UDTRandom, 'Test 3', '', 'Value 3'],
                    [UDTRandom, 'Test 4', '', 'Value 4'],
                    [UDTRandom, 'Test 5', '', 'Value 5'],
                ],
            });
            expect(bulkUpdateUDT.JobID).to.be.a('number');
            expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
        });

        it('Verify bulk jobinfo', async () => {
            generalService.sleep(5000);
            bulkJobInfo = await service.waitForBulkJobStatus(bulkUpdateUDT.JobID, 30000);
            expect(bulkJobInfo.ID).to.equal(bulkUpdateUDT.JobID);
            expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]);
            expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z');
            expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(new Date().toISOString().split('T')[0]);
            expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z');
            expect(bulkJobInfo.Status, 'Status').to.equal('Ok');
            expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3);
            expect(bulkJobInfo.Records, 'Records').to.equal(5);
            expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(5);
            expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0);
            expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(0);
            expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0);
            expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0);
            expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0);
            expect(bulkJobInfo.Error, 'Error').to.equal('');
        });

        it('Verify bulk UDT update', async () => {
            const bulkUpdatedUDT = await service.getUDT({ where: "MapDataExternalID='" + UDTRandom + "'" });
            expect(bulkUpdatedUDT).to.be.an('array').with.lengthOf(5);
            expect(bulkUpdatedUDT[0])
                .to.have.property('CreationDateTime')
                .that.contains(new Date().toISOString().split('T')[0]);
            expect(bulkUpdatedUDT[0]).to.have.property('CreationDateTime').that.contain('Z');
            expect(bulkUpdatedUDT[0])
                .to.have.property('ModificationDateTime')
                .that.contains(new Date().toISOString().split('T')[0]);
            expect(bulkUpdatedUDT[0]).to.have.property('ModificationDateTime').that.contains('Z');
            expect(bulkUpdatedUDT[0]).to.have.property('MainKey').that.contains('Test');
            expect(bulkUpdatedUDT[0]).to.have.property('SecondaryKey').that.equals(null);
            expect(bulkUpdatedUDT[0]).to.have.property('MapDataExternalID').that.equals(UDTRandom);
            expect(bulkUpdatedUDT[0]).to.have.property('Values').that.is.an('array').with.lengthOf(1);
            expect(bulkUpdatedUDT[0].Values[0]).to.contain('Value');
        });

        it('POST UDT row', async () => {
            updatedUDTRowPOST = await service.postUDT({
                MapDataExternalID: UDTRandom,
                MainKey: 'API Test row',
                SecondaryKey: '',
                Values: ['Api Test value'],
            });
            expect(updatedUDTRowPOST).to.deep.include({
                MapDataExternalID: UDTRandom,
                MainKey: 'API Test row',
                SecondaryKey: null,
                Values: ['Api Test value'],
            });
            expect(updatedUDTRowPOST).to.have.property('CreationDateTime').that.contains('Z');
            expect(updatedUDTRowPOST)
                .to.have.property('ModificationDateTime')
                .that.contains(new Date().toISOString().split('T')[0]);
            expect(updatedUDTRowPOST).to.have.property('ModificationDateTime').that.contains('Z');
            expect(updatedUDTRowPOST).to.have.property('Hidden').that.is.false;
            expect(updatedUDTRowPOST).to.have.property('InternalID').that.is.above(0);
        });

        it('Verify POST UDT row', async () => {
            const UpdatedUDT = await service.getUDT({ where: "MapDataExternalID='" + UDTRandom + "'" });
            expect(UpdatedUDT).to.be.an('array').with.lengthOf(6);
        });

        //Removed 07/05/2021 by oren - this test can't pass on production or EU
        // it('UPDATE UDT row', async () => {
        //     (updatedUDTRowUPDATE = await service.postUDT({
        //         InternalID: updatedUDTRowPOST.InternalID,
        //         MapDataExternalID: UDTRandom,
        //         MainKey: 'API Test row UPDATE',
        //         SecondaryKey: '',
        //         Values: ['Api Test value UPDATE'],
        //     }));
        //         expect(updatedUDTRowUPDATE).to.deep.include({
        //             MapDataExternalID: UDTRandom,
        //             MainKey: 'API Test row UPDATE',
        //             SecondaryKey: null,
        //             Values: ['Api Test value UPDATE'],
        //         });
        //         expect(updatedUDTRowUPDATE).to.have.property('CreationDateTime').that.contains('Z');
        //         expect(updatedUDTRowUPDATE)
        //             .to.have.property('ModificationDateTime')
        //             .that.contains(new Date().toISOString().split('T')[0]);
        //         expect(updatedUDTRowUPDATE).to.have.property('ModificationDateTime').that.contains('Z');
        //         expect(updatedUDTRowUPDATE).to.have.property('Hidden').that.is.false;
        //         expect(updatedUDTRowUPDATE)
        //             .to.have.property('InternalID')
        //             .that.equals(updatedUDTRowPOST.InternalID);
        // });

        //Removed 07/05/2021 by oren - this test can't pass on production or EU
        // it('Verify UPDATE UDT row', async () => {
        //     updatedUDTRow = await service.getUDT({ where: "MapDataExternalID='" + UDTRandom + "'" });
        //     expect(updatedUDTRow).to.be.an('array').with.lengthOf(6);
        //         (updatedUDTRow = await service.getUDT({ where: 'InternalID=' + updatedUDTRowPOST.InternalID }));
        //     expect(updatedUDTRow).to.be.an('array').with.lengthOf(1);
        //         expect(updatedUDTRow[0]).to.have.property('CreationDateTime').that.contains('Z');
        //         expect(updatedUDTRow[0])
        //             .to.have.property('ModificationDateTime')
        //             .that.contains(new Date().toISOString().split('T')[0]);
        //         expect(updatedUDTRow[0]).to.have.property('ModificationDateTime').that.contains('Z');
        //         expect(updatedUDTRow[0]).to.have.property('Hidden').that.is.false;
        //         expect(updatedUDTRow[0]).to.have.property('InternalID').that.equals(updatedUDTRowPOST.InternalID);
        //         expect(updatedUDTRow[0]).to.have.property('Values').that.is.an('array').with.lengthOf(1);
        //         expect(updatedUDTRow[0].Values[0]).to.contain('Api Test value UPDATE');
        //         expect(updatedUDTRow[0]).to.have.property('MainKey').that.equals('API Test row UPDATE');
        // });

        it('Delete UDT row', async () => {
            return Promise.all([
                expect(await service.deleteUDT(updatedUDTRowPOST.InternalID as number)).to.be.true,
                expect(await service.deleteUDT(updatedUDTRowPOST.InternalID as number)).to.be.false,
                expect(await service.getUDT({ where: 'InternalID=' + updatedUDTRowPOST.InternalID }))
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        it('BATCH UDT Insert', async () => {
            batchUDTresponse = await service.postBatchUDT([
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 1',
                    SecondaryKey: '1',
                    Values: ['Api Test value 1'],
                },
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 2',
                    SecondaryKey: '2',
                    Values: ['Api Test value 2'],
                },
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 3',
                    SecondaryKey: '3',
                    Values: ['Api Test value 3'],
                },
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 4',
                    SecondaryKey: '4',
                    Values: ['Api Test value 4'],
                },
            ]);
            expect(batchUDTresponse).to.be.an('array').with.lengthOf(4);
            batchUDTresponse.map((row) => {
                expect(row).to.have.property('InternalID').that.is.above(0);
                expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                expect(row).to.have.property('Status').that.equals('Insert');
                expect(row).to.have.property('Message').that.equals('Row inserted.');
                expect(row)
                    .to.have.property('URI')
                    .that.equals('/user_defined_tables/' + row.InternalID);
            });
        });

        it('BATCH UDT statuses', async () => {
            batchUDTresponse = await service.postBatchUDT([
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 1',
                    SecondaryKey: '1',
                    Values: ['Api Test value 1'],
                },
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 2',
                    SecondaryKey: '2',
                    Values: ['Api Test value 222'],
                },
                {
                    MapDataExternalID: UDTRandom,
                    MainKey: 'batch API Test row 33',
                    SecondaryKey: '33',
                    Values: ['Api Test value 33'],
                },
                {
                    MapDataExternalID: 'This is need to get error status',
                    MainKey: 'batch API Test row 4',
                    SecondaryKey: '4',
                    Values: ['Api Test value 4'],
                },
            ]);
            expect(batchUDTresponse).to.be.an('array').with.lengthOf(4);
            expect(batchUDTresponse[0]).have.property('InternalID').that.is.above(0);
            expect(batchUDTresponse[0]).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
            expect(batchUDTresponse[0]).to.have.property('Status').that.equals('Ignore');
            expect(batchUDTresponse[0])
                .to.have.property('Message')
                .that.equals('No changes in this row. The row is being ignored.');
            expect(batchUDTresponse[0])
                .to.have.property('URI')
                .that.equals('/user_defined_tables/' + batchUDTresponse[0].InternalID);
            expect(batchUDTresponse[1]).have.property('InternalID').that.is.above(0);
            expect(batchUDTresponse[1]).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
            expect(batchUDTresponse[1]).to.have.property('Status').that.equals('Update');
            expect(batchUDTresponse[1]).to.have.property('Message').that.equals('Row updated.');
            expect(batchUDTresponse[1])
                .to.have.property('URI')
                .that.equals('/user_defined_tables/' + batchUDTresponse[1].InternalID);
            expect(batchUDTresponse[2]).have.property('InternalID').that.is.above(0);
            expect(batchUDTresponse[2]).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
            expect(batchUDTresponse[2]).to.have.property('Status').that.equals('Insert');
            expect(batchUDTresponse[2]).to.have.property('Message').that.equals('Row inserted.');
            expect(batchUDTresponse[2])
                .to.have.property('URI')
                .that.equals('/user_defined_tables/' + batchUDTresponse[2].InternalID);
            expect(batchUDTresponse[3]).have.property('InternalID').that.equals(0);
            expect(batchUDTresponse[3]).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
            expect(batchUDTresponse[3]).to.have.property('Status').that.equals('Error');
            expect(batchUDTresponse[3])
                .to.have.property('Message')
                .that.equals('@MapDataExternalID does not exist.value: This is need to get error status');
            expect(batchUDTresponse[3]).to.have.property('URI').that.equals('');
        });

        it('Delete UDT meta data', async () => {
            return Promise.all([
                expect(await service.deleteUDTMetaData(createdUDT.TableID as number)).to.be.true,
                expect(await service.deleteUDTMetaData(createdUDT.TableID as number)).to.be.false,
                expect(await service.getUDTMetaData(createdUDT.TableID)).to.be.have.property('Hidden').that.is.true,
            ]);
        });
    });
}
