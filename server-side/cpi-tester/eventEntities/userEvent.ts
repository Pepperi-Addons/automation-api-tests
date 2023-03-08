import { ADDON_BLOCK_NAME } from "shared-cpi-automation";
import { EventResponseUserEvent, UserEventExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class UserEvent extends EventResult
{
	constructor(protected eventsService: EventsService, protected data: EventResponseUserEvent)
	{
		super(eventsService, data);
		this.validateUserEvent(data);
	}

	/**
	 * Validate the AddonBlockName and Description belong to a UserEvent.
	 * @param data {EventResponseUserEvent} - The data to validate.
	 */
	protected validateUserEvent(data: EventResponseUserEvent) 
	{
		let errorMessage = "";
		if (data.Value.Data.AddonBlockName !== ADDON_BLOCK_NAME) 
		{
			errorMessage = `The AddonBlockName is not ${ADDON_BLOCK_NAME}.`;
		}
		else if (data.Value.Data.Title !== ADDON_BLOCK_NAME)
		{
			errorMessage = `The Title is not ${ADDON_BLOCK_NAME}.`;
		}

		if (errorMessage !== "")
		{
			throw new Error(`Failed to create an instance of a User Event. ${errorMessage}\nGot the following data: ${JSON.stringify(data)}`);
		}
	}
	
	get eventData() 
	{
		return this.data.Value.Data.HostObject.pageParams.userEventData;
	}

	get userEventName() 
	{
		return this.data.Value.Data.HostObject.pageParams.userEventName;
	}

	get eventType() 
	{
		return "UserEvent";
	}

	/**
	 * Passes an empty result to the event.
	 * @returns {Promise<EventResult>} - A promise that resolves to the resulting EventResult.
	 */
	public async setEmptyResult(): Promise<EventResult>
	{
		return await this.setResult({});
	}

	public async setResult(resultToSet: UserEventExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;

	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
