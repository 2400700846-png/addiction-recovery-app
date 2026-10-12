# Steady — recovery, at your pace

A private recovery-support web app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style accessible primitives, Prisma, and SQLite.

## Requirements

- Node.js 20.9 or newer
- npm

## Install and run

In PowerShell, from this folder:

```powershell
npm install
Copy-Item .env.example .env
node -e "const fs=require('fs');const crypto=require('crypto');const p='.env';const s=fs.readFileSync(p,'utf8').replace(/^AUTH_SECRET=.*$/m,'AUTH_SECRET=\"'+crypto.randomBytes(32).toString('hex')+'\"');fs.writeFileSync(p,s)"
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000. Create your own account from the registration screen. The command above sets a fresh session-signing secret; keep `.env` private. Useful commands:

```powershell
npm run typecheck
npm run build
npm run db:studio
```

Optional seed account (set these only in your local shell; don't commit credentials):

```powershell
$env:SEED_EMAIL = "demo@example.com"
$env:SEED_PASSWORD = "use-a-long-unique-password"
npm run db:seed
```

## `src/` directory

```text
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (app)/
      dashboard/page.tsx
      cravings/page.tsx
      emergency/page.tsx
      settings/page.tsx
      layout.tsx
    api/
      auth/login/route.ts
      auth/logout/route.ts
      auth/register/route.ts
      auth/session/route.ts
      cravings/route.ts
      discreet/route.ts
      emergency/contacts/route.ts
      pin/route.ts
      settings/clock/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    app-shell.tsx
    auth-form.tsx
    breathing-timer.tsx
    chart.tsx
    check-in.tsx
    clock-card.tsx
    contact-manager.tsx
    cravings-workspace.tsx
    dashboard-content.tsx
    emergency-panel.tsx
    grounding-guide.tsx
    header.tsx
    providers.tsx
    settings-workspace.tsx
    ui/
      button.tsx
      card.tsx
      input.tsx
      label.tsx
  lib/
    auth.ts
    db.ts
    schemas.ts
    utils.ts
```

## Privacy and safety notes

- Passwords and detail passcodes are stored as bcrypt hashes. The signed session cookie is HTTP-only, same-site, and secure in production.
- Craving log APIs require the detail passcode whenever discreet mode is on. Disabling discreet mode requires the current account password.
- Emergency contact phones are account data. Use a strong unique password and HTTPS in any deployed environment.
- The 988 Lifeline is a US service. If you may be in immediate danger, contact your local emergency services. This app is not a substitute for clinical care or emergency response.
- SQLite is useful for local use and small single-instance deployments; choose a managed database and review operational, privacy, backup, and regulatory obligations before serving real-world clinical or sensitive workloads.
