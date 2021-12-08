import GeneralService, { TesterFunctions, FilterAttributes } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { DistributorService } from '../../services/distributor.service';
import { LoremIpsum } from 'lorem-ipsum';

export async function DistributorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const distributorService = new DistributorService(generalService, request);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Distributor Test Suites', async () => {
        it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
            expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
        });

        it(`Create New Distributor`, async function () {
            const lorem = new LoremIpsum({});
            const distributorFirstName = lorem.generateWords(1);
            const distributorLastName = lorem.generateWords(1);
            const distributorEmail = `${distributorFirstName}.${distributorLastName}@pepperitest.com`;
            const distributorCompany = lorem.generateWords(3);
            const lettersGenerator = lorem.generateWords(1).substring(0, 2);
            const distributorPassword =
                lettersGenerator[0].toUpperCase() +
                lettersGenerator[1] +
                (Math.random() * 10000000000).toString().substring(0, 6);

            console.log(distributorEmail, distributorPassword);

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
            const danielClient = await generalService.initiateTester('daniel3@pepperitest.com', '******');
            const danielService = new GeneralService(danielClient);
            const danielAddons = await danielService.getAddons();
            debugger;
        });
    });
}
