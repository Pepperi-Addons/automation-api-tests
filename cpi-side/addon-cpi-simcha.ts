import '@pepperi-addons/cpi-node';
import { ModalOptions } from '@pepperi-addons/cpi-node/build/cpi-side/app/components';
import { AddonsDataSearchParams } from '@pepperi-addons/cpi-node/build/cpi-side/client-api';
import { AddonUUID } from '../addon.config.json';
import { SCHEMA_NAME, ADDON_BLOCK_NAME, LOGGING_PREFIX } from "shared-cpi-automation";


/*
	Since currently no way to get the full list of user events, we have to rely on the test passing the list of
	user events it expects, and to subscribe to them.
	Since a Sync or a Resync could be initiated by an addon's logic mid-test, resulting in a CPI-Node reload and a loss
	of the subscriptions, we have to somehow save the list of user events.

	The solution we came up with is to save the user events in an ADAL table.
	The table's contents is read on load, and we subscribe to these events.

	A test still passes a list of its expected user events (this is how new events are added to the table, as we add new tests).
	We we check to see if we already subscribed to the passed events. If we have, nothing's left to do.
	Otherwise, we add the new event to the table, and then subscribe to it.

	To improve performance and avoid multiple readings from the table, on load we read the table's contents into a global Set.
	Now all validations (whether we already subscribed to a user event, or whether it is saved to the table) is done
	By querying this Set.
*/
declare global {
    var userEventsSet: Set<string>;
}

export async function load(configuration: any) 
{
	// console.log(`${LOGGING_PREFIX} get list of user events`);
	// const userEvents: Array<string> = await getUserEventsFromSchema();

	global.userEventsSet = new Set<string>();

	// console.log(`${LOGGING_PREFIX} Subscribe to user events listed in schema`);
	// await subscribeToUserEvents(userEvents);
}

export const router = Router();



router.post('/subscribe_to_user_events', async (req, res, next) => 
{
	
	try
	{
		await subscribeToUserEvents(req.body.UserEvents);
		res.json({});
	}
	catch(err)
	{
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
async function subscribeToUserEvents(userEvents: Array<string>): Promise<void>
{
	const userEventsNotYetSubscribed = userEvents.filter(userEvent => !global.userEventsSet.has(userEvent));
	
	// await addUserEventsToSchema(userEventsNotYetSubscribed);

	console.log(`${LOGGING_PREFIX} Adding interceptors for the following User Events: ${JSON.stringify(userEventsNotYetSubscribed)}`);
	for (const userEventName of userEventsNotYetSubscribed) 
	{
		global.userEventsSet.add(userEventName);

		pepperi.events.intercept(userEventName as any, {}, async (data, next, main): Promise<any> => 
		{
			console.log(`${LOGGING_PREFIX} Intercepted User Event "${userEventName}".`);

			const { client, clientLoop, timers, clientFactory, ...userEventData } = data;
			const eventData = {
				userEventName: userEventName,
				userEventData: userEventData
			};

			const modalOptions: ModalOptions = {
				addonBlockName: ADDON_BLOCK_NAME,
				allowCancel: false,
				title: ADDON_BLOCK_NAME,
				hostObject: {
					pageKey: "",
					pageParams: eventData
				}
			};

			console.log(`${LOGGING_PREFIX} modal body: ${JSON.stringify(modalOptions)}`);

			// Emit CPI test client action
			console.log(`${LOGGING_PREFIX} Emitting modal client action.`);

			await data.client?.showModal(modalOptions);

			console.log(`${LOGGING_PREFIX} Got back from modal client action.`);

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
