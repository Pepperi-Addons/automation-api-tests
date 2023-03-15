"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.load = void 0;
require("@pepperi-addons/cpi-node");
const shared_cpi_automation_1 = require("shared-cpi-automation");
async function load(configuration) {
    // console.log(`${LOGGING_PREFIX} get list of user events`);
    // const userEvents: Array<string> = await getUserEventsFromSchema();
    global.userEventsSet = new Set();
    // console.log(`${LOGGING_PREFIX} Subscribe to user events listed in schema`);
    // await subscribeToUserEvents(userEvents);
}
exports.load = load;
exports.router = Router();
exports.router.post('/subscribe_to_user_events', async (req, res, next) => {
    try {
        await subscribeToUserEvents(req.body.UserEvents);
        res.json({});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
// /** 
// 	Asynchronously gets all the user events from a schema.
//     @return {Promise<Array<string>>} A promise that resolves to an array of strings representing the user events.
// */
// async function getUserEventsFromSchema(): Promise<Array<string>> 
// {
// 	let userEvents: Array<string> = [];
// 	const addonsDataSearchParams: AddonsDataSearchParams = {
// 		Fields: ["Key"],
// 		PageSize: -1,
// 	};
// 	try
// 	{
// 		userEvents = (await pepperi.addons.data.uuid(AddonUUID).table(SCHEMA_NAME).search(addonsDataSearchParams)).Objects.map(userEvent => userEvent.Key!);
// 	}
// 	catch(error)
// 	{
// 		const errorMessage = `${LOGGING_PREFIX} Failed to get user events from "${SCHEMA_NAME}" table. Error: ${error instanceof Error ? error.message : "Unknown error occurred."}`;
// 		console.error(errorMessage);
// 	}
// 	return userEvents;
// }
/**
Subscribes to user events and intercepts them for further processing.
@param {Array<string>} userEvents - An array of user events to be subscribed to and intercepted.
*/
async function subscribeToUserEvents(userEvents) {
    const userEventsNotYetSubscribed = userEvents.filter(userEvent => !global.userEventsSet.has(userEvent));
    // await addUserEventsToSchema(userEventsNotYetSubscribed);
    console.log(`${shared_cpi_automation_1.LOGGING_PREFIX} Adding interceptors for the following User Events: ${JSON.stringify(userEventsNotYetSubscribed)}`);
    for (const userEventName of userEventsNotYetSubscribed) {
        global.userEventsSet.add(userEventName);
        pepperi.events.intercept(userEventName, {}, async (data, next, main) => {
            var _a;
            console.log(`${shared_cpi_automation_1.LOGGING_PREFIX} Intercepted User Event "${userEventName}".`);
            const { client, clientLoop, timers, clientFactory } = data, userEventData = __rest(data, ["client", "clientLoop", "timers", "clientFactory"]);
            const eventData = {
                userEventName: userEventName,
                userEventData: userEventData
            };
            const modalOptions = {
                addonBlockName: shared_cpi_automation_1.ADDON_BLOCK_NAME,
                allowCancel: false,
                title: shared_cpi_automation_1.ADDON_BLOCK_NAME,
                hostObject: {
                    pageKey: "",
                    pageParams: eventData
                }
            };
            console.log(`${shared_cpi_automation_1.LOGGING_PREFIX} modal body: ${JSON.stringify(modalOptions)}`);
            // Emit CPI test client action
            console.log(`${shared_cpi_automation_1.LOGGING_PREFIX} Emitting modal client action.`);
            await ((_a = data.client) === null || _a === void 0 ? void 0 : _a.showModal(modalOptions));
            console.log(`${shared_cpi_automation_1.LOGGING_PREFIX} Got back from modal client action.`);
            await next(main);
        });
    }
}
// /**
//     Asynchronously add the user events to the addon's user_events.
//     @param {Array<string>} userEvents - An array of user events to be added.
//     @return {Promise<void>} A promise that resolves when the user events have been added to the schema.
// */
// async function addUserEventsToSchema(userEvents: Array<string>): Promise<void>
// {
// 	for (const userEvent of userEvents)
// 	{
// 		try
// 		{
// 			await pepperi.addons.data.uuid(AddonUUID).table(SCHEMA_NAME).upsert({Key: userEvent});
// 		}
// 		catch(error)
// 		{
// 			const errorMessage = `${LOGGING_PREFIX} Failed to save user event "${userEvent}" to "${SCHEMA_NAME}" table. Error: ${error instanceof Error ? error.message : "Unknown error occurred."}`;
// 			console.error(errorMessage);
// 		}
// 	}
// }
//# sourceMappingURL=addon-cpi-simcha.js.map