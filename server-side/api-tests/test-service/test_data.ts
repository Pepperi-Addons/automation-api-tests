import GeneralService, { TesterFunctions } from '../../services/general.service';

const installedAddons = {
    'API Testing Framework': '' as any,
    'Services Framework': '' as any,
    'Cross Platforms API': '' as any,
    'WebApp API Framework': '' as any,
    'WebApp Platform': '' as any,
    'Settings Framework': '' as any,
    'Addons Manager': '' as any,
    'Data Views API': '' as any,
    ADAL: '' as any,
    'Automated Jobs': '' as any,
    'Relations Framework': '' as any,
    'Object Types Editor': '' as any,
    'Notification Service': '' as any,
    'Item Trade Promotions': '' as any,
    'Order Trade Promotions': '' as any,
    'Package Trade Promotions': '' as any,
};

export interface TestDataOptions {
    IsUUID: boolean;
    IsAllAddons: boolean;
}

// Get the Tests Data
export async function TestDataTests(
    generalService: GeneralService,
    tester: TesterFunctions,
    options: TestDataOptions = { IsAllAddons: true, IsUUID: false },
) {
    const service = generalService;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const installedAddonsArr = await service.getInstalledAddons({ page_size: -1 });
    for (let index = 0; index < installedAddonsArr.length; index++) {
        if (installedAddonsArr[index].Addon !== null) {
            if (installedAddonsArr[index].Addon.Name == 'API Testing Framework')
                installedAddons['API Testing Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Services Framework')
                installedAddons['Services Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Cross Platforms API')
                installedAddons['Cross Platforms API'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'WebApp API Framework')
                installedAddons['WebApp API Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'WebApp Platform')
                installedAddons['WebApp Platform'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Settings Framework')
                installedAddons['Settings Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Addons Manager')
                installedAddons['Addons Manager'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Data Views API')
                installedAddons['Data Views API'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'ADAL')
                installedAddons['ADAL'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Automated Jobs')
                installedAddons['Automated Jobs'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Relations Framework')
                installedAddons['Relations Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Object Types Editor')
                installedAddons['Object Types Editor'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Notification Service')
                installedAddons['Notification Service'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Item Trade Promotions')
                installedAddons['Item Trade Promotions'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Order Trade Promotions')
                installedAddons['Order Trade Promotions'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Package Trade Promotions')
                installedAddons['Package Trade Promotions'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Data Index Framework')
                installedAddons['Data Index Framework'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Activity Data Index')
                installedAddons['Activity Data Index'] = installedAddonsArr[index].Version;
            if (installedAddonsArr[index].Addon.Name == 'Audit Log')
                installedAddons['Audit Log'] = installedAddonsArr[index].Version;
        }
    }

    describe('Test Data', async () => {
        it(`Start Test Server Time And Date: ${service.getServer()} ${service.getTime()} ${service.getDate()}`, () => {
            expect(service.getDate().length == 10 && service.getTime().length == 8).to.be.true;
        });

        it(`Tested User: ${service.getClientData('UserEmail')} UserID: ${service.getClientData(
            'UserID',
        )} DistributorID: ${service.getClientData('DistributorID')}`, () => {
            expect(service.getClientData('UserEmail')).to.contain('@');
        });

        if (options.IsUUID) {
            it(`UserUUID: ${service.getClientData('UserUUID')} DistributorUUID: ${service.getClientData(
                'DistributorUUID',
            )}`, () => {
                expect(service.getClientData('DistributorUUID')).to.contain('-');
            });
        }

        it('Test Prerequisites', () => {
            expect(installedAddonsArr).to.be.an('array');
        });

        describe('Installed Addons Versions', () => {
            const regex = /\D/g;

            if (options.IsAllAddons) {
                it(`API Testing Framework | Version: ${installedAddons['API Testing Framework']}`, () => {
                    const regexMatched = installedAddons['API Testing Framework'].replace(regex, '');
                    expect(regexMatched.length).to.be.above(2);
                });
            }
            it(`Services Framework | Version: ${installedAddons['Services Framework']}`, () => {
                const regexMatched = installedAddons['Services Framework'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Cross Platforms API | Version: ${installedAddons['Cross Platforms API']}`, () => {
                const regexMatched = installedAddons['Cross Platforms API'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`WebApp API Framework | Version: ${installedAddons['WebApp API Framework']}`, () => {
                const regexMatched = installedAddons['WebApp API Framework'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`WebApp Platform | Version: ${installedAddons['WebApp Platform']}`, () => {
                const regexMatched = installedAddons['WebApp Platform'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Settings Framework | Version: ${installedAddons['Settings Framework']}`, () => {
                const regexMatched = installedAddons['Settings Framework'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Addons Manager | Version: ${installedAddons['Addons Manager']}`, () => {
                const regexMatched = installedAddons['Addons Manager'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Data Views API | Version: ${installedAddons['Data Views API']}`, () => {
                const regexMatched = installedAddons['Data Views API'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`ADAL | Version: ${installedAddons['ADAL']}`, () => {
                const regexMatched = installedAddons['ADAL'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Data Index Framework | Version: ${installedAddons['Data Index Framework']}`, () => {
                const regexMatched = installedAddons['Data Index Framework'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Activity Data Index (Papi Index) | Version: ${installedAddons['Activity Data Index']}`, () => {
                const regexMatched = installedAddons['Activity Data Index'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Audit Log | Version: ${installedAddons['Audit Log']}`, () => {
                const regexMatched = installedAddons['Audit Log'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            if (options.IsAllAddons) {
                it(`Automated Jobs | Version: ${installedAddons['Automated Jobs']}`, () => {
                    const regexMatched = installedAddons['Automated Jobs'].replace(regex, '');
                    expect(regexMatched.length).to.be.above(2);
                });
            }
            it(`Relations Framework | Version: ${installedAddons['Relations Framework']}`, () => {
                const regexMatched = installedAddons['Relations Framework'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Object Types Editor | Version: ${installedAddons['Object Types Editor']}`, () => {
                const regexMatched = installedAddons['Object Types Editor'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            it(`Pepperi Notification Service | Version: ${installedAddons['Notification Service']}`, () => {
                const regexMatched = installedAddons['Notification Service'].replace(regex, '');
                expect(regexMatched.length).to.be.above(2);
            });
            if (options.IsAllAddons) {
                it(`Item Trade Promotions | Version: ${installedAddons['Item Trade Promotions']}`, () => {
                    const regexMatched = installedAddons['Item Trade Promotions'].replace(regex, '');
                    expect(regexMatched.length).to.be.above(2);
                });
                it(`Order Trade Promotions | Version: ${installedAddons['Order Trade Promotions']}`, () => {
                    const regexMatched = installedAddons['Order Trade Promotions'].replace(regex, '');
                    expect(regexMatched.length).to.be.above(2);
                });
                it(`Package Trade Promotions | Version: ${installedAddons['Package Trade Promotions']}`, () => {
                    const regexMatched = installedAddons['Package Trade Promotions'].replace(regex, '');
                    expect(regexMatched.length).to.be.above(2);
                });
            }
        });
    });
}
