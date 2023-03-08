import { ClientActionType, Event, EventResponse } from "../constants";
import { EventsService } from "../services/events.service";
import {ClientActionDialog, ClientActionGeoLocation, ClientActionHUD, ClientActionModal, ClientActionNavigation, ClientActionBarcodeScan, FinishEvent, UserEvent} from "./index";

export class EventResult
{
	constructor(protected eventsService: EventsService, protected data: EventResponse)
	{}

	//#region Getters 
	
	/**
    Getter method for retrieving the data associated with the event.
    @returns The data associated with the event.
    */
	get eventData() 
	{
		return this.data.Value.Data;
	}

	/**
    Getter method for retrieving the callback associated with the event.
    @returns The callback associated with the event.
    */
	get eventCallback() 
	{
		return this.data.Value.Callback;
	}

	/**
    Getter method for retrieving the type of the event.
    @returns The type of the event.
    */
	get eventType() 
	{
		return this.data.Value.Type;
	}

	//#endregion

	//#region as method overloading

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'Dialog'): ClientActionDialog;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: "GeoLocation"): ClientActionGeoLocation;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'HUD'): ClientActionHUD;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'Modal'): ClientActionModal;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'Barcode'): ClientActionBarcodeScan;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'Navigation'): ClientActionNavigation;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'UserEvent'): UserEvent;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: 'Finish'): FinishEvent;
		
	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: string): EventResult;

	/**
    The as method is used to cast an EventResult object to a specific ClientAction type or UserEvent type.
    @param {ClientActionType | string} type - The type of ClientAction or UserEvent to cast the EventResult object to.
    @return {EventResult} An instance of the specified ClientAction or UserEvent type.
    */
	as(type: ClientActionType | string): EventResult
	{
		let eventResultClassReference: typeof EventResult | undefined = undefined; 

		switch(type)
		{
		case "Dialog":
		{
			eventResultClassReference = ClientActionDialog;
			break;
		}
		case "GeoLocation":
		{
			eventResultClassReference = ClientActionGeoLocation;
			break;
		}
		case "HUD":
		{
			eventResultClassReference = ClientActionHUD;
			break;
		}
		case "Modal":
		{
			eventResultClassReference = ClientActionModal;
			break;
		}
		case "Barcode":
		{
			eventResultClassReference = ClientActionBarcodeScan;
			break;
		}
		case "Navigation":
		{
			eventResultClassReference = ClientActionNavigation;
			break;
		}
		case "UserEvent":
		{
			eventResultClassReference = UserEvent;
			break;
		}
		default:
		{
			eventResultClassReference = EventResult;
			break;
		}
		}

		return new eventResultClassReference(this.eventsService, this.data);
	}

	//#endregion

	//#region Public methods
	//#region setResult method overloading

	public async setResult(resultToSet: Event): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;

	/**
    A method to set the result for the current event.
    @param resultToSet The result to be set for the current event. It can be an instance of Event or any other object.
    @returns A Promise that resolves to an instance of EventResult.
    */
	public async setResult(resultToSet: Event | any): Promise<EventResult>
	{
		const res: Event = this.isEvent(resultToSet) ? resultToSet : 
			{
				EventKey: this.data.Value.Callback,
				EventData: resultToSet
			};

		return await this.eventsService.emitEvent(res);
	}

	//#endregion

	/**
    Registers for user events.
    @param userEvents The list of user events to subscribe to.
    @throws Error if the registration process fails. The error message will contain the error code and error message from the response.
    */
	public async registerToUserEvents(userEvents: Array<string>): Promise<void>
	{
		await this.eventsService.registerToUserEvents(userEvents);
	}
	//#endregion

	//#region Private methods

	/**
    Determines if the given value is of type Event.
    @param value The value to be tested
    @returns true if the value is of type Event, false otherwise.
    */
	private isEvent(value: any): value is Event
	{
		return (
			value &&
			typeof value.EventKey === 'string' &&
			"EventData" in value
		);
	}

	//#endregion
}
