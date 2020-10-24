import GeneralService, { TesterFunctions } from '../services/general.service';

const installedAddons = {
    'Services Framework': '' as any,
    'WebApp Platform': '' as any,
    'Data Views API': '' as any,
    'Addons Manager': '' as any,
    'Cross Platforms API': '' as any,
};

// All Sync Tests
export async function TestDataTest(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const installedAddonsArr = await service.getAddons();
    for (let index = 0; index < installedAddonsArr.length; index++) {
        if (installedAddonsArr[index].Addon !== null) {
            if (installedAddonsArr[index].Addon.Name == 'Services Framework')
                installedAddons['Services Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'WebApp Platform')
                installedAddons['WebApp Platform'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Data Views API')
                installedAddons['Data Views API'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Addons Manager')
                installedAddons['Addons Manager'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Cross Platforms API')
                installedAddons['Cross Platforms API'] = installedAddonsArr[index].Version;
        }
    }

    describe('Test Data', async () => {
        it(`Start Test Server Time And Date: \xa0\xa0\xa0\xa0 ${service.getServer()} \xa0\xa0\xa0\xa0 ${service.getTime()} \xa0\xa0\xa0\xa0 ${service.getDate()}`, () => {
            expect(service.getDate().length == 10 && service.getTime().length == 8).to.be.true;
        });

        it(`Tested User: \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 ${service.getClientData(
            'UserEmail',
        )} \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 UserID: \xa0${service.getClientData(
            'UserID',
        )} \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 DistributorID: \xa0${service.getClientData('DistributorID')}`, () => {
            expect(service.getClientData('UserEmail')).to.contain('@');
        });

        it('Test Prerequisites', async () => {
            expect(installedAddonsArr).to.be.an('array');
        });

        describe('Installed Addons Versions', () => {
            it(`Services Framework \xa0\xa0\xa0 | \xa0\xa0\xa0\xa0 Version: ${installedAddons['Services Framework']}`, () => {
                expect(installedAddons['Services Framework']).to.not.be.null;
            });
            it(`Cross Platforms API \xa0\xa0\xa0 | \xa0\xa0\xa0\xa0 Version: ${installedAddons['Cross Platforms API']}`, () => {
                expect(installedAddons['Cross Platforms API']).to.not.be.null;
            });
            it(`WebApp Platform \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 | \xa0\xa0\xa0\xa0 Version: ${installedAddons['WebApp Platform']}`, () => {
                expect(installedAddons['WebApp Platform']).to.not.be.null;
            });
            it(`Addons Manager \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 | \xa0\xa0\xa0\xa0 Version: ${installedAddons['Addons Manager']}`, () => {
                expect(installedAddons['Addons Manage']).to.not.be.null;
            });
            it(`Data Views API \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 | \xa0\xa0\xa0\xa0 Version: ${installedAddons['Data Views API']}`, () => {
                expect(installedAddons['Data Views API']).to.not.be.null;
            });
        });
    });
}
