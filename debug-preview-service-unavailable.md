# Debug Session: preview-service-unavailable [OPEN]

## Symptom
- Preview at `http://localhost:3000/` shows `Service is unavailable`.

## Constraints
- Steps 1-4: no business logic changes.
- First code change to the existing app must be instrumentation only if needed.

## Hypotheses
1. The Next.js dev server is not running, so the preview has nothing healthy behind `localhost:3000`.
2. The dev server starts but crashes immediately because of a runtime boot error in the app or API route.
3. Port `3000` is occupied by another dead or incompatible process, so preview points to the wrong service.
4. The preview expects a running dev server, but only production build artifacts exist and no active server process is serving them.
5. Environment-dependent server code fails during startup, causing Next to stay unavailable until the missing runtime requirement is fixed.

## Evidence Log
- `Get-NetTCPConnection -LocalPort 3000` returned no listener before startup.
- `npm run dev` started Next.js successfully and reported `Local: http://localhost:3000`.
- `Invoke-WebRequest http://localhost:3000` returned `200 OK` after startup.
- Browser console on the earlier `localhost:3000` session showed `ENOENT: no such file or directory, open 'D:\\TRAE BUILD HACKTHON\\.next\\server\\app\\page.js'`.
- `netstat -ano | findstr :3000` confirmed PID `6104` was listening on port `3000`.
- `Get-CimInstance Win32_Process -Filter "ProcessId = 6104"` identified PID `6104` as `node.exe` running Next's `start-server.js`.
- After `Stop-Process -Id 6104 -Force` and a fresh `npm run dev`, Next reported `Local: http://localhost:3000` and `Ready in 7.5s`.
- Browser snapshot after restart rendered the COMET AGENT homepage successfully at `http://localhost:3000/`.
- Post-restart browser console no longer showed the `ENOENT` crash; the remaining hydration warning referenced `data-trae-ref` attributes injected by browser automation.

## Hypothesis Status
- H1 updated: a service was running on port 3000, but it was a stale broken Next process rather than a healthy preview server.
- H2 rejected for current app code: no current startup crash observed after clean restart.
- H3 confirmed: port 3000 was occupied by a stale Node/Next process.
- H4 rejected as the primary issue: the problem was not the absence of a server, but the wrong stale server.
- H5 rejected for current symptom: the app booted with `.env.local` present.

## Next Step
- Keep the fresh dev server running on port 3000 and ask the user to confirm the preview is fixed in their own browser session.
