# Device Management Frontend (React)

A lightweight React application to manage network devices. It supports listing, searching, sorting, creating, editing, deleting, and checking status (ping) of devices. Integrates with a backend REST API mounted under the `/api` base path.

## Features
- Sortable/searchable device table
- Create/Edit device forms with validation (including IPv4)
- Device detail view with status indicator and last-checked timestamp
- Delete with confirmation dialog
- Manual status refresh (ping) per device
- Accessible UI (ARIA for dialogs, labels, focus mgmt)
- Loading indicators (devices list shows a loader on navigation or refetch)
- Test hooks via `data-testid` attributes
- Environment-configurable API base

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install
```bash
npm install
```

### Run (dev)
```bash
npm start
```
Open http://localhost:3000

By default, the frontend calls the backend at same origin with base `/api`. To target another host/port, set `REACT_APP_API_BASE`:

Create `.env`:
```
REACT_APP_API_BASE=http://localhost:5000
```

Or see `.env.example`.

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

## Routes
- `/` devices list
- `/devices/new` create device
- `/devices/:id` device detail
- `/devices/:id/edit` edit device

Navigation notes:
- After successfully creating a device, the app redirects back to the devices list (`/`).
- The Add Device page provides both a Back button in the header and a Cancel button in the form. Both route back to the devices list without submitting.
- Loader behavior: When navigating back to the devices list (`/`) from Add Device or other pages, a loading indicator (aria role="status", aria-live="polite") is shown until the device data is fetched. The loader also appears during manual refresh and other refetch operations to avoid a flash of empty content.

### Test hooks
- Loader: `data-testid="devices-loading"`
- Table rows: `data-testid="device-row-<id>"`
- Other controls retained as previously documented.

## API
The app uses the provided OpenAPI spec endpoints:
- GET/POST `/api/devices`
- GET/PUT/DELETE `/api/devices/{id}`
- POST/GET `/api/devices/{id}/status`

## Development Notes
- Functional components + hooks
- No heavy UI libs; plain CSS in `src/styles.css`
- Client-side search/sort with debounced input
- Form validation includes IPv4 check
- Data test ids:
  - `device-row-<id>`, `submit-button`, `delete-button`, `status-badge-<id>`, `search-input`, `sort-<column>`, `confirm-delete-button`, `cancel-button`, `back-button`, `devices-loading`

## Environment Variables
- `REACT_APP_API_BASE` (optional): base URL to prepend before `/api`. Default is empty (same origin).
