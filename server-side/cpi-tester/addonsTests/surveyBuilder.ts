import { Client } from '@pepperi-addons/debug-server/dist';
import { Event } from '../constants';
import { EventsService } from '../services/events.service';

export default class SurveyBuilderTest {
    constructor(protected client: Client) {}

    public async SurveyBuilderTestCPI() {
        // Register to user events.
        const initialEventsService = new EventsService(this.client);
        const userEvents = ['OnSurveyDataLoad', 'OnSurveyViewLoad'];

        debugger;
        await initialEventsService.registerToUserEvents(userEvents);

        const initialEventBody: Event = {
            EventKey: 'OnClientSurveyLoad',
            EventData: {
                SurveyKey: '02916a23-c6e0-4c6b-b18d-230612741985',
            },
        };

        // Emit "OnClientSurveyLoad" event, expecting "OnSurveyDataLoad" user event
        const clientAction = await initialEventsService.emitEvent(initialEventBody);
        debugger;
        const firstUserEvent = clientAction.as('UserEvent');
        console.log(firstUserEvent.eventType);
        console.log(JSON.stringify(firstUserEvent.eventData));

        const secondDialog = (await firstUserEvent.setEmptyResult()).as('Dialog');
        console.log(secondDialog.eventType);
        console.log(JSON.stringify(secondDialog.eventData));

        const thirdUserEvent = (await secondDialog.selectActionK(0)).as('UserEvent');
        console.log(thirdUserEvent.eventType);
        console.log(JSON.stringify(thirdUserEvent.eventData));

        const finish = await (await thirdUserEvent.setEmptyResult()).as('Finish');
        console.log(finish.eventType);
        console.log(JSON.stringify(finish.eventData));
    }
}
