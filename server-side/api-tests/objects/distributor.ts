import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { DistributorService } from '../../services/distributor.service';
import { LoremIpsum } from 'lorem-ipsum';

export interface ClientObject {
    Email: string;
    Password: string;
}

export async function DistributorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const distributorService = new DistributorService(generalService, request);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Distributor Test Suites', async () => {
        const clientArr: ClientObject[] = [];
        it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
            expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
        });

        it(`Create New Distributor`, async function () {
            const lorem = new LoremIpsum({});
            const distributorFirstName = lorem.generateWords(1);
            const distributorLastName = lorem.generateWords(1);
            const distributorEmail = `${distributorFirstName + (Math.random() * 10000000000).toString().substring(0, 4)
                }.${distributorLastName}@pepperitest.com`;
            const distributorCompany = lorem.generateWords(3);
            const lettersGenerator = lorem.generateWords(1).substring(0, 2);
            const distributorPassword =
                lettersGenerator[0].toUpperCase() +
                lettersGenerator[1] +
                (Math.random() * 10000000000).toString().substring(0, 6);

            console.log(distributorEmail, distributorPassword);
            clientArr.push({ Email: distributorEmail, Password: distributorPassword });

            const newDistributor = await distributorService.createDistributor({
                FirstName: distributorFirstName,
                LastName: distributorLastName,
                Email: distributorEmail,
                Company: distributorCompany,
                Password: distributorPassword,
            });
            expect(newDistributor.Status).to.equal(200);
            expect(newDistributor.Body.Status.ID).to.equal(1);
            expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);
        });

        it(`Get Installed Addons`, async () => {
            // clientArr.push({ Email: 'aute6667.occaecat@pepperitest.com', Password: 'An801443' });
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            const adminAddons = await adminService.getInstalledAddons();
            expect(adminAddons.length).to.be.above(10);
            const adminObjectsService = new ObjectsService(adminService);
            const newDistributorUsers = await adminObjectsService.getUsers();
            const systemAddons = await adminService.getSystemAddons();
            const installedAddons = await adminService.getInstalledAddons();
            expect(newDistributorUsers.length).to.be.above(0);
            expect(systemAddons.length).to.be.above(10);
            expect(installedAddons.length).to.be.above(10);
            const systemAddonTestData = new Array();
            for (let index = 0; index < systemAddons.length; index++) {
                const phasedVersion = JSON.parse(systemAddons[index].SystemData);
                systemAddonTestData.push({ Name: systemAddons[index].Name, Version: phasedVersion['CurrentPhasedVersion'] })
            }
            const installedAddonTestData = new Array();
            for (let index = 0; index < installedAddons.length; index++) {
                installedAddonTestData.push({ Name: installedAddons[index].Addon.Name, Version: installedAddons[index].Version })
            }

            let sortedSystemAddonTestData = systemAddonTestData.sort(compareByName);
            let sortedInstalledAddonTestData = installedAddonTestData.sort(compareByName);

               for (let j = 0; j < sortedSystemAddonTestData.length; j++) {
                for (let i = 0; i < sortedInstalledAddonTestData.length; i++) {
                    if (sortedSystemAddonTestData[j]['Name'] == sortedInstalledAddonTestData[i]['Name']) {
                        sortedSystemAddonTestData = sortedSystemAddonTestData.splice(j, 1);
                        sortedInstalledAddonTestData = sortedInstalledAddonTestData.splice(i, 1);
                        j--;
                        i--;
                    }

                }
            }

            debugger;

            // try {
                expect(installedAddonTestData.sort(compareByName)).to.deep.include(systemAddonTestData.sort(compareByName))
            // } catch (error) {
            //     debugger;
            // }
            try {
                expect(installedAddonTestData.sort(compareByName)).to.deep.include(systemAddonTestData.sort(compareByName))
            } catch (error) {
                debugger;
            }
        })
        
    });
}

const compareByName = (a, b) => {
    if (a.Name > b.Name) {
        return 1;
    } else if (a.Name < b.Name) {
        return -1;
    }
    return 0;
};