import { Actor, log } from 'apify';
import { fetchEvents } from './openfda.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { deviceName, eventType = 'all', daysBack = 30, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const EVENT_SEARCH_EVENT = 'event-search';

const endDate = new Date();
const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

const events = await fetchEvents({
    deviceName,
    eventType,
    startDate,
    endDate,
    maxResults: Math.min(maxResults, 100),
});

for (const event of events) {
    await Actor.pushData(event);
}

await Actor.charge({ eventName: EVENT_SEARCH_EVENT });

log.info(`Pushed ${events.length} event(s)`);

await Actor.exit();
