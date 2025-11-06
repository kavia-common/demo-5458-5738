# Environment Configuration

The frontend discovers the backend base URL in this order:
1. REACT_APP_API_BASE — used as a base and `/api` will be appended.
2. REACT_APP_BACKEND_URL — `/api` will be appended.
3. Default `/api` (same-origin).

Examples:
- Backend served at http://localhost:5000/api
  - Set `REACT_APP_BACKEND_URL=http://localhost:5000` (recommended)
  - Or set `REACT_APP_API_BASE=http://localhost:5000`

See .env.example for optional variables.
