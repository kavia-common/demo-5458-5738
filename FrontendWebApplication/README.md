# Device Management Frontend (React)

A lightweight React application to manage network devices. It supports listing, searching, sorting, creating, editing, deleting, and checking status (ping) of devices. Integrates with a backend REST API mounted under the `/api` base path.

## Features
- Sortable/searchable device table
- Create/Edit device forms with validation (including IPv4)
- Device detail view with status indicator and last-checked timestamp
- Delete with confirmation dialog
- Manual status refresh (ping) per device and list
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

By default, the frontend calls the backend at same origin with base `/api`.

API base resolution precedence:
1) If `REACT_APP_API_BASE` is set, the app uses `${REACT_APP_API_BASE}/api`.
2) Else if `REACT_APP_BACKEND_URL` is set, the app uses `${REACT_APP_BACKEND_URL}/api`.
3) Else default to `/api`.

Examples (.env):
```
# Option A: explicit base
REACT_APP_API_BASE=http://localhost:5000

# Option B: backend root host:port (the app appends /api)
# REACT_APP_BACKEND_URL=http://localhost:5000
```

See `.env.example` for more variables.

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
- Other controls:
  - `submit-button`, `delete-button`, `status-badge-<id>`, `search-input`, `sort-<column>`, `confirm-delete-button`, `cancel-button`, `back-button`

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

## Environment Variables
- `REACT_APP_API_BASE` (optional): base URL which will be prepended before `/api`. Default is same-origin.
