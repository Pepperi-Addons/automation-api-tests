export class ListAbiTestData {
    constructor(
        num_of_items,
        num_of_accounts,
        num_of_items_filtered_MaNa,
        num_of_accounts_filtered_a,
        num_of_items_filtered_a,
        num_of_ReferenceAccountAuto,
        num_of_FiltersAccRefAuto,
        num_of_ArraysOfPrimitivesAuto,
        num_of_ContainedArray,
    ) {
        this['1. Items Basic'] = {
            listToSelect: '',
            expectedTitle: 'Items Basic',
            expectedNumOfResults: num_of_items,
            views: ['Items'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Menu: false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                'Line Menu': false,
            },
        };
        this['2. Accounts Basic'] = {
            listToSelect: '2. Accounts View - Basic',
            expectedTitle: 'Accounts Basic',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Key', 'Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                'Line Menu': false,
            },
        };
        this['3. Accounts Default Draw'] = {
            listToSelect: '3. Accounts Basic View with Default Draw',
            expectedTitle: 'Accounts With Default Draw',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Key', 'Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {},
        };
        this['4. Accounts Selection - Multi'] = {
            listToSelect: '4. Accounts with Selection Type "Multi"',
            expectedTitle: 'Accounts Selection Type Multi',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': true,
                'Line Menu': false,
            },
        };
        this['5. Accounts Selection - Single'] = {
            listToSelect: '5. Accounts with Selection Type "Single"',
            expectedTitle: 'Accounts Selection Type Single',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                'Single Radio Button': true,
                'Select All Checkbox': false,
                'Line Menu': false,
            },
        };
        this['6. Accounts Selection - None'] = {
            listToSelect: '6. Accounts with Selection Type "None"',
            expectedTitle: 'Accounts Selection Type None',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': false,
                'Line Menu': false,
            },
        };
        this['7. Accounts Menu'] = {
            listToSelect: '7. Accounts with Menu',
            expectedTitle: 'Accounts With Menu',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: true,
            },
        };
        this['8. Accounts Menu Hosting Addon Functionality'] = {
            listToSelect: '8. Accounts with Menu of Hosting Addon Func',
            expectedTitle: 'Accounts Menu With Hosting Addon functionality',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: true,
            },
        };
        this['9. Accounts Menu Full'] = {
            listToSelect: '9. Accounts with Menu - Full',
            expectedTitle: 'Accounts With Menu Full',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: true,
            },
        };
        // this['10. Accounts Line Menu'] = {                                  // https://pepperi.atlassian.net/browse/DI-24145 - Release: Resource List 1.1
        //     listToSelect: '10. Accounts with Line Menu',
        //     expectedTitle: 'Accounts With Line Menu',
        //     expectedNumOfResults: num_of_accounts,
        //     views: ['Accounts'],
        // columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
        //     elements: {
        //         'Single Radio Button': true,
        //         'Select All Checkbox': false,
        //         'Line Menu': true,
        //     },
        // }
        this['11. Items Line Menu Selection Type Multi'] = {
            listToSelect: '11. Items with Line Menu & Selection "Multi"',
            expectedTitle: "Items with Line Menu (Selection Type 'Multi')",
            expectedNumOfResults: num_of_items,
            views: ['Items Line Menu Selection Multi'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': true,
                'Line Menu': true,
            },
        };
        this['12. Items Search'] = {
            listToSelect: '12. Items with Search',
            expectedTitle: 'Items With Search (Name, Category, Description)',
            expectedNumOfResults: num_of_items,
            views: ['Items'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                'Search Input': true,
            },
        };
        this['13. Accounts Smart Search'] = {
            listToSelect: '13. Accounts with Smart Search',
            expectedTitle: 'Accounts With Smart Search (Name)',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                'Smart Search': true,
            },
        };
        this['14. Accounts Sorting Ascending'] = {
            listToSelect: '14. Accounts with Sorting - Ascending',
            expectedTitle: 'Accounts Sorting by Name Acsending',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {},
        };
        this['15. Accounts Sorting Descending'] = {
            listToSelect: '15. Accounts with Sorting - Descending',
            expectedTitle: 'Accounts Sorting by Name Decsending',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts'],
            columnHeadersPerView: [['Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {},
        };
        this['16. Items Search String'] = {
            listToSelect: '16. Items with Search String',
            expectedTitle: 'Items - Search String',
            expectedNumOfResults: num_of_items_filtered_MaNa,
            views: ['Items'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                'Search Input': true,
            },
        };
        this['17. Items Page Type Pages'] = {
            listToSelect: '17. Items with Page Type "Pages"',
            expectedTitle: "Items Page Type 'Pages'",
            expectedNumOfResults: num_of_items,
            views: ['Items Page Type Pages'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['18. Items Page Type Pages - Page size'] = {
            listToSelect: '18. Items with Page Type "Pages" & Page Size',
            expectedTitle: "Items Page Type 'Pages' with Page Size",
            expectedNumOfResults: num_of_items,
            views: ['Items Pages Page Size'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['19. Items Page Type Pages - Page Index'] = {
            listToSelect: '19. Items with Page Type "Pages" & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Pages Page Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['20. Items Page Type Pages - Top Scroll Index'] = {
            listToSelect: '20. Items Page Type "Pages" & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Top Scroll Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Pages Top Scroll Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['21. Items Page Type Pages - Page Size & Page Index'] = {
            listToSelect: '21. Items with Page Type "Pages" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size & Page Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Pages Page Size & Page Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['22. Items Page Type Pages - Page Size, Page Index & Top Scroll Index'] = {
            listToSelect: '22. Items with Page Type "Pages" & Page Size & Page Index & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size, Page Index and Top Scroll Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Pages Page Size, Page Index, Top Scroll Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: true,
            },
        };
        this['23. Items Page Type Scroll'] = {
            listToSelect: '23. Items with Page Type "Scroll"',
            expectedTitle: "Items Page Type 'Scroll'",
            expectedNumOfResults: num_of_items,
            views: ['Items Page Type Scroll'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: false,
            },
        };
        // this['24. Items Page Type Scroll - Top Scroll Index'] = {                                // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
        //     listToSelect: '24. Items with Page Type "Scroll" & Top Scroll Index',
        //     expectedTitle: "Items: Page Type 'Scroll' with Top Scroll Index",
        //     expectedNumOfResults: num_of_items,
        //     views: ['Items Scroll Top Scroll Index'],
        //     columnHeadersPerView: [
        //         ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
        //     ],
        //     elements: {
        //         Pager: false,
        //     },
        // }
        this['25. Items Page Type Scroll - Page Index'] = {
            listToSelect: '25. Items with Page Type "Scroll" & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Scroll Page Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: false,
            },
        };
        // this['26. Items Page Type Scroll - Page Index & Top Scroll Index'] = {                            // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
        //     listToSelect: '26. Items with Page Type "Scroll" & Page Index & Top Scroll Index',
        //     expectedTitle: "Items Page Type 'Scroll' with Page Index and Top Scroll Index",
        //     expectedNumOfResults: num_of_items,
        //     views: ['Items Scroll Page Index Top Scroll Index'],
        //     columnHeadersPerView: [
        //         ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
        //     ],
        //     elements: {
        //         Pager: false,
        //     },
        // }
        this['27. Items Page Type Scroll - Page Size & Page Index'] = {
            listToSelect: '27. Items with Page Type "Scroll" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Size and Page Index",
            expectedNumOfResults: num_of_items,
            views: ['Items Scroll Page Size Page Index'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Pager: false,
            },
        };
        // this['28. Items Page Type Scroll - Page Size & Page Index & Top Scroll Index'] = {                    // https://pepperi.atlassian.net/browse/DI-24154 - Release: Resource List 1.1
        //     listToSelect: '28. Items with Page Type "Scroll" & Page Size & Page Index & Top Scroll Index',
        //     expectedTitle: "Items Page Type 'Scroll' with Page Size, Page Index and Top Scroll Index",
        //     expectedNumOfResults: num_of_items,
        //     views: ['Items Scroll Page Size Page Index Top Scroll Index'],
        //     columnHeadersPerView: [
        //         ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
        //     ],
        //     elements: {
        //         Pager: false,
        //     },
        // }
        this['29. Accounts Full'] = {
            listToSelect: '29. Accounts View - Full',
            expectedTitle: 'Accounts Full',
            expectedNumOfResults: num_of_accounts_filtered_a,
            views: ['Accounts Full'],
            columnHeadersPerView: [['Account Key', 'Account Name', 'Account Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': true,
            },
        };
        this['30. Items Full - with 2 Views'] = {
            listToSelect: '30. Items View - Full with 2 Views',
            expectedTitle: 'Items Full - 2 Views',
            expectedNumOfResults: num_of_items_filtered_a,
            views: ['Items Name Main Category', 'Items Name Price'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category'],
                ['Name', 'External ID', 'Price', 'Cost Price', 'UPC'],
            ],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                // 'Line Menu': true,                     // https://pepperi.atlassian.net/browse/DI-24145 - Release: Resource List 1.1
            },
        };
        this['31. Accounts Draw Grid Relation'] = {
            listToSelect: '31. Accounts - Test Draw Grid Relation',
            expectedTitle: 'Accounts Test Draw Grid Relation',
            expectedNumOfResults: num_of_accounts,
            views: ['Accounts Test Draw'],
            columnHeadersPerView: [['Name', 'Email', 'Country', 'City', 'Type']],
            elements: {
                Menu: false,
                'New Button': false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': false,
            },
        };
        this['32. ReferenceAccount with 2 Views - Tests'] = {
            listToSelect: '32. ReferenceAccount with 2 Views',
            expectedTitle: 'Reference Account',
            expectedNumOfResults: num_of_ReferenceAccountAuto,
            views: ['Best Seller', 'Max Quantity'],
            columnHeadersPerView: [
                ['Account Key', 'Best Seller Item'],
                ['Account Key', 'Max Quantity'],
            ],
            elements: {
                Menu: true,
                'New Button': false,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: false,
                'Line Menu': true,
            },
        };
        this['33. FiltersAccRef with 2 Views - Tests'] = {
            listToSelect: '33. FiltersAccRef with 2 Views',
            expectedTitle: 'Filters Acc Ref ABI View',
            expectedNumOfResults: num_of_FiltersAccRefAuto,
            views: ['Additional Indexed Fields', 'No Additional'],
            columnHeadersPerView: [
                ['Item', 'Price', 'Quantity', 'In Stock', 'Account Key', 'Account Name', 'Account Email'],
                ['Account Key', 'Item', 'Price', 'Quantity', 'In Stock'],
            ],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': true,
            },
        };
        this['34. Accounts Propagated Error'] = {
            listToSelect: '34. Accounts - throw Error due to wrong AddonUUID',
            expectedTitle: '',
            expectedNumOfResults: 0,
            elements: {},
        };
        this['35. Arrays Of Primitives Numbers Names Reals'] = {
            listToSelect: '35. Arrays Of Primitives - Test Draw Array',
            expectedTitle: 'Arrays Of Primitives - Numbers, Names, Reals (Test Draw Array)',
            expectedNumOfResults: num_of_ArraysOfPrimitivesAuto,
            views: ['Arrays Of Primitives'],
            columnHeadersPerView: [['Numbers', 'Names', 'Reals']],
            elements: {},
        };
        this['36. Contained Array Scheme Only Name Age'] = {
            listToSelect: '36. Contained Array - Test Draw Array',
            expectedTitle: 'Contained Array - Scheme Only Name Age (Test Draw Array)',
            expectedNumOfResults: num_of_ContainedArray,
            views: ['Contained Array'],
            columnHeadersPerView: [['Title', 'Contained Scheme Only Name Age']],
            elements: {},
        };
    }
    public '1. Items Basic';
    public '2. Accounts Basic';
    public '3. Accounts Default Draw';
    public '4. Accounts Selection - Multi';
    public '5. Accounts Selection - Single';
    public '6. Accounts Selection - None';
    public '7. Accounts Menu';
    public '8. Accounts Menu Hosting Addon Functionality';
    public '9. Accounts Menu Full';
    // public '10. Accounts Line Menu';  // https://pepperi.atlassian.net/browse/DI-24145 - Release: Resource List 1.1
    public '11. Items Line Menu Selection Type Multi';
    public '12. Items Search';
    public '13. Accounts Smart Search';
    public '14. Accounts Sorting Ascending';
    public '15. Accounts Sorting Descending';
    public '16. Items Search String';
    public '17. Items Page Type Pages';
    public '18. Items Page Type Pages - Page size';
    public '19. Items Page Type Pages - Page Index';
    public '20. Items Page Type Pages - Top Scroll Index';
    public '21. Items Page Type Pages - Page Size & Page Index';
    public '22. Items Page Type Pages - Page Size, Page Index & Top Scroll Index';
    public '23. Items Page Type Scroll';
    // public '24. Items Page Type Scroll - Top Scroll Index';   // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
    public '25. Items Page Type Scroll - Page Index';
    // public '26. Items Page Type Scroll - Page Index & Top Scroll Index';     // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
    '27. Items Page Type Scroll - Page Size & Page Index';
    // public '28. Items Page Type Scroll - Page Size & Page Index & Top Scroll Index';      // https://pepperi.atlassian.net/browse/DI-24154 - Release: Resource List 1.1
    public '29. Accounts Full';
    public '30. Items Full - with 2 Views';
    public '31. Accounts Draw Grid Relation';
    public '32. ReferenceAccount with 2 Views - Tests';
    public '33. FiltersAccRef with 2 Views - Tests';
    public '34. Accounts Propagated Error';
    public '35. Arrays Of Primitives Numbers Names Reals';
    public '36. Contained Array Scheme Only Name Age';
}
