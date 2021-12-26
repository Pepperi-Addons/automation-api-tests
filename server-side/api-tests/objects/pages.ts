import { Page, PageBlock, PageLayout } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions, FilterAttributes } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';

export async function SampleTest(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    describe("Pages API Tests Suite", () =>{
        let testPageBlock : PageBlock = {
            Relation: {
                RelationName: "PageBlock",
				Type: "NgComponent",
				Name: "Page Block Tester",
				AddonUUID: "5046a9e4-ffa4-41bc-8b62-db1c2cf3e455",
				SubType: "NG12",
				AddonRelativeURL: "block_tester",
				ModuleName: "BlockTesterModule",
				ComponentName: "BlockTesterComponent"
            },
            Key: "SomeKey"
        }

        let testPage : Page = {
            Name: "Pages Api Test with block",
            Blocks: [
                testPageBlock
            ],
            Layout: {
                Sections: [
                    {
                        "Key": "LayoutSectionKey",
                        "Columns": [
                            {
                                "Block": {
                                    "BlockKey": "SomeKey"
                                }
                            }
                        ],
                        "Hide": []
                    }
                ]
            }
            // Layout: {
            //     Sections: []
            // },
        }
        it('Create new page', async () => {
            const resultPage : Page = await service.papiClient.pages.upsert(testPage);
            const properties = ["Name", "Blocks", "Layout"];
            testPage.Key = resultPage.Key;
            ComparePages(testPage, resultPage, properties);
            // testPage["Key"] = resultPage["Key"];
            // expect(resultPage).to.equal(testPage);
            debugger;    
        });
        
        it("Delete created page", async () => {
            testPage.Hidden = true;
            const resultPage = await service.papiClient.pages.upsert(testPage);
            expect(resultPage.Hidden).to.equal(true);
        });

        function ComparePages(expected : Page, actual : Page, properties : Array<string>){
            properties.forEach((prop) =>{
                console.log(`Expected ${prop}: ${expected[prop]}`);
                console.log(`Actual ${prop}: ${actual[prop]}`);

                expect(actual[prop], `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`).to.deep.equal(expected[prop]);
            });
        }
        // it('Compare Page properties', async (expected : Page, actual : Page, properties : Array<string>) =>{
        //     properties.forEach((prop) =>{
        //         expect(actual[prop]).to.equal(expected[prop]);
        //     });
        // });
    });
    // const page = await service.papiClient.pages.find({ page_size: 1 });
    // const pageBlocks = page[0].Blocks;
    // const pageLayout = page[0].Layout;
    // console.log(pageBlocks);
    // console.log(pageLayout);
    // console.log(page);
    // console.log(page[0]);
}

