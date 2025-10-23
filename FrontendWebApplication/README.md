# Device Management Frontend (React)

A lightweight React application to manage network devices. It supports listing, searching, sorting, creating, editing, deleting, and checking status (ping) of devices. Integrates with a backend REST API mounted under the `/api` base path.

## Features
- Sortable/searchable device table
- Create/Edit device forms with validation (including IPv4)
- Device detail view with status indicator and last-checked timestamp
- Delete with confirmation dialog
- Manual status refresh (ping) per device
- Accessible UI (ARIA for dialogs, labels, focus mgmt)
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
  - `device-row-<id>`, `submit-button`, `delete-button`, `status-badge-<id>`, `search-input`, `sort-<column>`, `confirm-delete-button`

## Environment Variables
- `REACT_APP_API_BASE` (optional): base URL to prepend before `/api`. Default is empty (same origin).
