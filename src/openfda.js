const BASE_URL = 'https://api.fda.gov/device/event.json';
const UA = 'MedicalDeviceAdverseEventTracker/0.1 (+contact: mdaet-admin@example.com)';

function isoToFdaDate(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function fdaDateToIso(d) {
    if (!d || d.length !== 8) return null;
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

function buildSearchQuery({ deviceName, eventType, startDate, endDate }) {
    const clauses = [`date_received:[${isoToFdaDate(startDate)}+TO+${isoToFdaDate(endDate)}]`];
    if (deviceName) clauses.push(`device.generic_name:${deviceName.trim().replace(/\s+/g, '+')}`);
    if (eventType && eventType !== 'all') clauses.push(`event_type:"${eventType}"`);
    return clauses.join('+AND+');
}

export async function fetchEvents({ deviceName, eventType, startDate, endDate, maxResults }) {
    const search = buildSearchQuery({ deviceName, eventType, startDate, endDate });
    // Built as a raw template string, not URLSearchParams: openFDA's query syntax expects literal
    // "+" as an operator (AND/TO) within the search value, but URLSearchParams percent-encodes it.
    const url = `${BASE_URL}?search=${search}&sort=date_received:desc&limit=${maxResults}`;

    const res = await fetch(url, { headers: { 'User-Agent': UA, Connection: 'close' } });
    if (res.status === 404) return []; // openFDA returns 404 when a search matches zero records
    if (!res.ok) throw new Error(`openFDA device event request failed: ${res.status} ${res.statusText}`);

    const body = await res.json();
    const results = body.results ?? [];

    return results.map((r) => {
        const device = r.device?.[0] ?? {};
        return {
            reportNumber: r.report_number,
            eventType: r.event_type,
            dateReceived: fdaDateToIso(r.date_received),
            dateOfEvent: fdaDateToIso(r.date_of_event),
            deviceGenericName: device.generic_name ?? null,
            deviceBrandName: device.brand_name ?? null,
            manufacturer: device.manufacturer_d_name ?? null,
            productProblemFlag: r.product_problem_flag === 'Y',
            reporterOccupation: r.reporter_occupation_code ?? null,
        };
    });
}
