# Medical Device Adverse Event Tracker — FDA MAUDE Reports

Search FDA MAUDE (Manufacturer and User Facility Device Experience)
adverse event reports by device name and event type. These are raw
incident reports — malfunctions, injuries, deaths associated with a
device — not official recalls, and often the earliest public signal of
a device problem.

Built for hospital risk management, device safety teams, and
researchers who want to know what's being reported before it becomes an
official recall.

## Input

```json
{
  "deviceName": "insulin pump",
  "eventType": "all",
  "daysBack": 30,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `deviceName` | string (optional) | Free-text search across the device's generic name. |
| `eventType` | string | `"all"`, `"Malfunction"`, `"Injury"`, or `"Death"`. Default `"all"`. |
| `daysBack` | number | How many days back from today to search, by date received by FDA. Default `30`, max `365`. |
| `maxResults` | number | Max reports to return, most recently received first. Default `25`, max `100`. |

## Output

One record per report:

```json
{
  "reportNumber": "2124215-2026-35065",
  "eventType": "Injury",
  "dateReceived": "2026-07-01",
  "dateOfEvent": "2026-06-19",
  "deviceGenericName": "PACEMAKER",
  "deviceBrandName": null,
  "manufacturer": "MEDTRONIC",
  "productProblemFlag": true,
  "reporterOccupation": "PHYSICIAN"
}
```

A search with no matching reports returns no items but is still billed
once for the search.

## How it works

Direct calls to the official [openFDA Device Adverse Event
API](https://open.fda.gov/apis/device/event/) (`api.fda.gov`) — no
proxy, no key, no scraping.

**Note:** these are unverified reports submitted by manufacturers,
health professionals, and consumers — FDA publishes them as filed,
without confirming a device caused the reported outcome. Treat volume
and pattern as a signal worth investigating, not proof of a defect.

## Pricing note

Billed per **search**, not per report returned — one charge whether the
search returns 0 reports or 100.

## Related products

- [Product Recall Alert](https://github.com/timmKal01/product-recall-alert) — official FDA drug, food, and device recalls, the confirmed-issue counterpart to this actor's raw incident reports
- [Vehicle Complaint Tracker](https://github.com/timmKal01/vehicle-complaint-tracker) — the same raw-complaints-before-recall pattern for vehicles instead of medical devices
