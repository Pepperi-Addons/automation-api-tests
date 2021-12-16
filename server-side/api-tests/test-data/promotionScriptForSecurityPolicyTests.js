//  * Define the logic field and the input/output fields to use.
//  * initiate the promotion logic.
// Definition:
//  * Level: Transaction
//  * Trigger: Temporary
/******** Configuration Start *************/
// 1. If you need to use your own logic (not recommended) then you can add an on-demand transaction level TSA with your logic and change the following value to refer to your TSA.
const API_LogicField = 'TSAPPIItemPromotionLogic';

// 2. To use different fields, such as a TSA for units quantity or price, uncomment the relevant config lines below and change the value accordingly.

const config = {
    APINames: {},
    Arrays: {},
    Functions: {},
    General: {},
};

/* Input fields: */
// config.APINames["API_UnitPrice"] = "TSAmyUnitPrice";											// The field which contains the item price
// config.APINames["API_Discount_BreakBy_Quantity"] = "TSAmyUnitsQuantity";						// The field which contains the item quantity (for a quantity based discount)
//18/11/2021 The TSA my total is crerate as example by Eyal
//TSAmyTotalUnitsPriceBeforeDiscount
config.APINames['API_Discount_BreakBy_Price'] = 'TSATotalPriceBefore'; // The field which contains the item total price (for a price based discount)

/* Output fields: */
// config.APINames["API_UnitDiscount"] = "TSAmyUnitDiscountPercentage";							// This field will be set with the new discount
// config.APINames["API_UnitPriceAfterDiscount"] = "TSAmyUnitPriceAfterDiscount";				// This field will be set with the new unit price after discount
// config.APINames["API_TotalUnitsPriceAfterDiscount"] = "TSAmyTotalUnitsPriceAfterDiscount";	// This field will be set with the new total unit price after discount (for additional item)
// config.APINames["API_UnitsQuantity"] = "TSAmyUnitsQuantity";									// This field will be set with the new quantity (for additional item)
/* Arrays: */
// config.Arrays["AdditionalItemFields"] = ["TSAmyField1","TSAmyField2"];						// Array of fields to take from the order center and set to the item added when getting an additional item.
/* Functions: */
// config.Functions["ReasonFormatFunction"] = "function (discountDetails) {...}";				// The function to use for generating the reason string
// config.Functions["NextDiscountFormatFunction"] = "function (discountDetails) {...}";			// The function to use for generating the next discount string
/* General configuration: */
// config.General["CurrencyDecimals"] = 2;														// The Number of digits after the decimal point to be stored in the price
// config.General["NextDiscountTextBuyMorePrefix"] = 'Buy additional ';							// Translation text for the next discount message
// config.General["NextDiscountTextBuyMoreSuffix"] = '';										// Translation text for the next discount message
/******** Configuration End *************/
/******** Init Code Start *************/
// Load the Logic into memory (and creates the this.PPI_ItemPromotion variable).
this.PPI_ItemPromotion = {};
GetValueByApiName(API_LogicField);
// Initiate the logic data with the defined configuration.
this.PPI_ItemPromotion.init(config);
return '';
