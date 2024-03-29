import GeneralService, { TesterFunctions } from '../services/general.service';

export async function VarSystemAddonsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const arrayOfAddonsDiff = [{}];
    arrayOfAddonsDiff.pop();

    const productionSystemAddons = await generalService.fetchStatus(
        'https://papi.pepperi.com/V1.0/var/addons?where=Type LIKE 1&order_by=UUID',
        {
            method: `GET`,
            headers: {
                Authorization: `Basic ${Buffer.from(request.body.varKeyPro).toString('base64')}`,
            },
        },
    );

    const StageSystemAddons = await generalService.fetchStatus(
        'https://papi.staging.pepperi.com/V1.0/var/addons?where=Type LIKE 1&order_by=UUID',
        {
            method: `GET`,
            headers: {
                Authorization: `Basic ${Buffer.from(request.body.varKeyStage).toString('base64')}`,
            },
        },
    );

    let outerLoopSize, innerLoopSize;
    if (productionSystemAddons.Body.length > StageSystemAddons.Body.length) {
        outerLoopSize = productionSystemAddons.Body.length;
        innerLoopSize = StageSystemAddons.Body.length;
    } else {
        innerLoopSize = productionSystemAddons.Body.length;
        outerLoopSize = StageSystemAddons.Body.length;
    }
    let tempArrLength = innerLoopSize;
    for (let j = 0; j < outerLoopSize; j++) {
        for (let i = 0; i < innerLoopSize; i++) {
            if (productionSystemAddons.Body[j].UUID.includes(StageSystemAddons.Body[i].UUID)) {
                arrayOfAddonsDiff.push({ Prod: productionSystemAddons.Body[j], Stage: StageSystemAddons.Body[i] });
                break;
            }
            if (i == tempArrLength - 1) {
                arrayOfAddonsDiff.push({ Prod: productionSystemAddons.Body[j], Stage: 'Addon Missing' });
            }
        }
    }
    tempArrLength = arrayOfAddonsDiff.length;
    for (let j = 0; j < StageSystemAddons.Body.length; j++) {
        for (let i = 0; i < tempArrLength; i++) {
            if (StageSystemAddons.Body[j].UUID.includes(arrayOfAddonsDiff[i]['Prod'].UUID)) {
                break;
            }
            if (i == tempArrLength - 1) {
                arrayOfAddonsDiff.push({ Prod: 'Addon Missing', Stage: StageSystemAddons.Body[j] });
            }
        }
    }

    let UsageMonitorTestData;
    let DataRetentionTestData;

    for (let index = 0; index < arrayOfAddonsDiff.length; index++) {
        if (arrayOfAddonsDiff[index]['Prod'].Name == 'Usage Monitor') {
            UsageMonitorTestData = arrayOfAddonsDiff[index]['Stage'];
            arrayOfAddonsDiff.splice(index, 1);
        } else if (arrayOfAddonsDiff[index]['Prod'].Name == 'Data Retention') {
            DataRetentionTestData = arrayOfAddonsDiff[index]['Stage'];
            arrayOfAddonsDiff.splice(index, 1);
        }
    }

    describe('Var System Addons Test Suites', async () => {
        it(`Get Production System Addons`, async () => {
            expect(StageSystemAddons.Body.length).to.be.above(10);
        });

        it(`Get Stage System Addons`, async () => {
            expect(StageSystemAddons.Body.length).to.be.above(10);
        });

        it(`Expect Usage Monitor Is System in Production Only `, async () => {
            expect(UsageMonitorTestData).to.equal('Addon Missing');
        });

        it(`Expect Data Retention Is System in Production Only `, async () => {
            expect(DataRetentionTestData).to.equal('Addon Missing');
        });

        it(`No Diff Between Production and Stage System Addons`, async () => {
            expect(JSON.stringify(arrayOfAddonsDiff).split('Addon Missing').length - 1).to.equal(0);
        });

        for (let index = 0; index < arrayOfAddonsDiff.length; index++) {
            if (arrayOfAddonsDiff[index]['Stage'] == 'Addon Missing') {
                it(`System Addon Is Missing In Stage: ${arrayOfAddonsDiff[index]['Prod'].Name}`, async () => {
                    expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['Prod'].Name)},
                Addon.Description: ${JSON.stringify(arrayOfAddonsDiff[index]['Prod'].Description)}, 
                Addon.UUID: ${JSON.stringify(arrayOfAddonsDiff[index]['Prod'].UUID)}`);
                });
            }
            if (arrayOfAddonsDiff[index]['Prod'] == 'Addon Missing') {
                it(`System Addon Is Missing In Production: ${arrayOfAddonsDiff[index]['Stage'].Name}`, async () => {
                    expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['Stage'].Name)},
                    Addon.Description: ${JSON.stringify(arrayOfAddonsDiff[index]['Stage'].Description)},
                    Addon.UUID: ${JSON.stringify(arrayOfAddonsDiff[index]['Stage'].UUID)}`);
                });
            }
        }
    });
}
