import { Client } from "@pepperi-addons/debug-server/dist";
import { Event, EventResponse } from "../constants";
import CpiSessionService from "./cpiSession.service";
import FetchService from "./fetch.service";
import deepClone from 'lodash.clonedeep';
import {EventResult} from "../eventEntities/index";
import { AddonUUID } from '../../addon.config.json';
import { LOGGING_PREFIX } from "shared-cpi-automation";

export class EventsService
{
	protected fetchService: FetchService;
	protected cpiSession: CpiSessionService;

	constructor(protected client: Client)
	{
		this.fetchService = new FetchService();
		this.cpiSession = new CpiSessionService(client, this.fetchService);
	}

	/**
    Emits an event using the provided event body.
    @param eventBody - The event body to be posted.
    @returns A new instance of the {@link EventResult} class.
    */
	public async emitEvent(eventBody: Event) 
	{
		const eventResponse: EventResponse = await this.postEvent(eventBody);
		return new EventResult(this, eventResponse) ;
	}

	/**
    Registers for user events.
    @param userEvents The list of user events to subscribe to.
    @throws Error if the registration process fails. The error message will contain the error code and error message from the response.
    */
	public async registerToUserEvents(userEvents: Array<string>)
	{
		const eventData = { UserEvents : userEvents};

		const event: Event = {
			EventKey: "AddonAPI",
			EventData: {
				AddonUUID: AddonUUID,
				RelativeURL: '/addon-cpi-simcha/subscribe_to_user_events',
				Method: 'POST',
				Body: eventData
			}
		};
		const res = await this.postEvent(event);
        
		if(!res.Success)
		{
			throw new Error(`${LOGGING_PREFIX} Failed to register to user event: ${res.ErrorCode}: ${res.ErrorMessage}`);
		}
	}

	/**
    Asynchronously posts an event to the server.
    @param {Event} event - The event to be posted.
    @return {Promise<EventResponse>} A promise that resolves to the server's response to the posted event.
    */
	protected async postEvent(event: Event): Promise<EventResponse>
	{
		const url = `${await this.cpiSession.webApiBaseUrl}/Service1.svc/v1/EmitEvent`;

		const headers = { PepperiSessionToken: await this.cpiSession.accessToken };

		const eventCopy = deepClone(event);

		eventCopy.EventData = JSON.stringify(eventCopy.EventData);

		const postRes = await this.fetchService.post(url, eventCopy, headers);

		postRes.Value = JSON.parse(postRes.Value);

		return postRes;
	}
}
