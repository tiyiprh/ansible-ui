# Automation Dashboard Gamification — UX handoff (Post-GA)

Net-new **gamification / Post-GA** feature work for [ANSTRAT-1976](https://issues.redhat.com/browse/ANSTRAT-1976). Prerequisite: Dashboard GA ([ANSTRAT-1981](https://issues.redhat.com/browse/ANSTRAT-1981)) ships first.

GA dashboard polish on shared components: see [CHANGES-GA-Dashboard.md](CHANGES-GA-Dashboard.md).

---

## Jira mapping — UX (existing)

| Scope | Jira | Action |
|-------|------|--------|
| UX epic | [AAP-85986](https://issues.redhat.com/browse/AAP-85986) Gamification UX | Parent for UX work |
| Prototype delivery | [AAP-85988](https://issues.redhat.com/browse/AAP-85988) Update gamification prototype | **Update** (when ready) — paste section summaries + prototype URL; dev implementation is separate XLAB stories |

## Jira mapping — dev implementation (create new)

Most sections below have **no dev story yet**. Create under ANSTRAT-1976 / XLAB when implementation starts.

| Section | Suggested dev story topic |
|---------|---------------------------|
| G-1 | Post-GA page shell — Dashboard + Highlights tabs |
| G-2 | Highlights — pinned Goals + Automation at a glance |
| G-3 | Empty states + Configure goals flow |
| G-4 | Manage view — four ranking panels |
| G-5 | Org leaderboard — % of quarterly goal met |
| G-6 | Automation adoption — level name + description (GA UI) |
| G-7 | Settings → Dashboard — Details + Edit |
| G-8 | Settings defaults — empty goals, reset, section copy |
| G-9 | — | **Do not implement** — prototype-only |

---

## G-1. Page shell — Dashboard + Highlights tabs

**Jira:** Create new (ANSTRAT-1976) · UX: [AAP-85988](https://issues.redhat.com/browse/AAP-85988)  
**Prototype-only:** No

**What:**
- Post-GA Automation Dashboard under Analytics — tabbed page with **Dashboard** (default) and **Highlights** (tab label; route path `/highlights`, `dataCy`: `post-ga-highlights-tab`).
- **Route:** Analytics → Automation Dashboard (post-GA path, e.g. `automation-dashboard/post-ga/dashboard`).
- `PageLayout` + `PageHeader` with help popover only (`titleHelp` / `titleHelpTitle`) — **no** `description` prop, **no** Export PDF, **no** Sync data in header.
- Tabs: framework `PageRoutedTabs` with `insetSm`, child routes (`/dashboard`, `/leaderboards`), `<Outlet />` for tab content — same pattern as org/detail pages, not local `Tabs` state.
- `DashboardToolbar` on **Dashboard tab only** (filters from `useAutomationDashboardToolbar`).
- **Dashboard tab** keeps GA KPIs + Cost calculation only (Goals and At a glance moved to Highlights — G-2).

**Why:** Separates operational GA metrics from gamification summary + rankings on Highlights.

**Where:**
- `frontend/awx/analytics/automation-dashboard/AutomationDashboardPostGA.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardPostGADashboardTab.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardPostGALeaderboardsTab.tsx` (Highlights tab)
- `frontend/awx/main/AwxRoutes.tsx` — route enum entries
- `frontend/awx/main/useAwxNavigation.tsx` — nested routes under post-ga

**Components:** `PageLayout`, `PageHeader`, `PageRoutedTabs`, `DashboardToolbar`.

**Acceptance criteria:**
- Two tabs: Dashboard (default), Highlights.
- Tab routing uses `PageRoutedTabs` + child routes, not local state.
- Page header has help popover only; no inline description.

**RBAC:** Follow existing Analytics dashboard access.

---

## G-2. Highlights tab — pinned Goals + Automation at a glance

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- Move **Goals** and **Automation at a glance** from Dashboard tab to **Highlights** tab.
- Pin side-by-side below Period/Organization filters and **Manage view** via `.post-ga-goals-row` (CSS grid `1fr 1fr`, stacks at 768px).
- Goals and At a glance are **not** in Manage view modal (always visible on Highlights).

**Goals card** — follow `DashboardGoalsCard.tsx`:
- PF `Card` + `CardHeader` (`Title h3 xl`) + `CardBody`.
- Two sections: **Quarterly automation goal**, **Cost savings this month** — each `DashboardSectionHeading` (h4 lg + `Help`) → `MetricValue` / `MetricLabel` → PF `Progress` (`measureLocation="outside"`).
- Targets from Settings (`dashboardSettingsUtils.ts`); progress from metrics API in product.
- Quarterly countdown helper under progress bar (`{{days}} days left in quarter`).

**Automation at a glance** — follow `DashboardAtAGlanceCard.tsx`:
- Same Card shell as Goals.
- Top row: 3 equal columns (`GridItem span={4}`), centered metrics with vertical dividers: orgs active %, templates in use %, runs this month.
- **Success streak:** 30-day heat strip — custom `div` cells (`.streak-heat-cell`), PF `Tooltip` per day; no PF heat-map component.
- Adoption section — see G-6.

**Why:** Highlights groups executive summary cards with rankings; Dashboard stays focused on GA operational KPIs.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardMetricText.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardSectionHeading.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css`

**Typography hierarchy:**

| Level | PF | Examples |
|-------|-----|----------|
| Card title | `Title h3 xl` + Help | Goals, At a glance |
| Section title | `Title h4 lg` + Help | Quarterly goal, Cost savings, Adoption, Success streak |
| Metric value | `Title h2 2xl` | Run counts, $ amounts, percentages |
| Helper | `Content component="small"` | "runs to go", "Last 30 days" |

**Acceptance criteria:**
- Goals + At a glance render on Highlights only, pinned above ranking panels.
- Cards not reorderable via Manage view.
- Responsive stack at 768px.

---

## G-3. Empty states + Configure goals

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- When goals are not configured, **Goals** and **Automation at a glance** show framework `EmptyStateCustom` (`variant="sm"`) with primary **Configure goals** → Settings Edit route.
- Reuse `GoalsConfigureEmptyState.tsx` pattern.
- Org leaderboard shows **—** when goals not configured (G-5).

**Why:** First-time admins need a clear path to configure org-specific targets before metrics are meaningful.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/GoalsConfigureEmptyState.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`

**Components:** `EmptyStateCustom` (framework), PF `Button` primary.

**Acceptance criteria:**
- Both cards show empty state when quarterly/monthly targets unset.
- **Configure goals** navigates to Settings → Dashboard Edit.
- Populated state shows metrics when Settings configured.

**Open PM questions:** Empty vs pre-populated goal defaults — see G-8 and `AutomationDashboardSettingsPrototypeNote`.

---

## G-4. Manage view — four ranking panels

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- **Manage view** modal lists **four** Top 5 ranking panels only: organizations, templates, projects, users.
- Remove **Human hours reclaimed** panel and placeholder panels from mock data and UI.
- Framework `useManageItems` + `ReorderItems` (Overview pattern).
- Ranking panels below pinned Goals row: **two table cards per row** — PF `Grid` + `GridItem md={6}`; stack below `md`.
- Toolbar filters on Highlights: PF `Toolbar` + `PageToolbarFilters` — pinned **Period** and **Organization** `SingleSelect` filters (same pattern as Dashboard tab).
- Each panel: PF `Card` + compact PF `Table` (or `EmptyState`); ~320px card height.

**Why:** Focus rankings on actionable Top 5 lists; drop unreleased placeholder panels.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/useManagedLeaderboardPanels.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaMockData.ts`

**Acceptance criteria:**
- Manage view shows exactly four panels; reorder persists per product storage pattern.
- Human hours reclaimed not in UI or manage list.
- Period filter includes **This quarter** (see G-5).

---

## G-5. Org leaderboard — % of quarterly goal met

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- Top organizations panel ranked by **% of quarterly goal met** using saved quarterly run target from Settings.
- Panel help text explains ranking metric.
- Shows **—** when goals not configured.

**Why:** Leadership view ties org performance to configured automation goals, not raw run counts alone.

**Where:** `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`, `dashboardSettingsUtils.ts`

**API / backend:** Metrics API must expose org-level progress vs configured quarterly target.

**Acceptance criteria:**
- Org table sorted by % of goal met when target configured.
- Em dash when no target configured.
- **This quarter** available in Period filter.

---

## G-6. Automation adoption — level name + description only

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No (UI); scorecard backend TBD

**What:**
- **Automation adoption** displays **Level N – Name** + description only — **no decimal score, no star row**.
- Level names/descriptions from Settings (`maturityUtils.ts`); displayed level from backend scorecard in product (prototype uses hardcoded `MATURITY_LEVEL` in mock).
- Dynamic “out of N” uses saved adoption level count from Settings.
- **Configure** link on adoption — out of scope for initial prototype handoff.

**Why:** GA UI shows maturity level without implying false precision; backend derives level from platform metrics.

**Where:** `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`, `maturityUtils.ts`

**Open PM questions** (from `PostGaHighlightsPrototypeNote`):
- Should adoption be a scorecard (4–6 platform metrics → 0–5 sub-scores) with level from lowest or weighted average?
- Which inputs in scope for GA (org/template activity, utilization, standardization, job reliability, governance)?
- Should level thresholds be configurable in Settings or fixed by product?

**Acceptance criteria:**
- UI shows level name + description only.
- No numeric score or star icons in GA UI.
- Level count reflects Settings row count.

---

## G-7. Settings → Dashboard — Details + Edit

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No (API/storage TBD)

**What:**

**Nav:** **Settings → Automation Analytics → Dashboard** (`/settings/automation-analytics/dashboard`, Edit at `/edit`).

**Nav label and page title:** **Dashboard** (not "Dashboard Settings") — grouped Settings pattern like Automation Execution → System.

**Details:**
- `PageFormGrid` + read-only `PageFormGroup` (not `PageDetails`).
- `PageFormSection` for **Automation goals** and **Adoption levels**.
- Pinned **Edit** action in header.
- One-line intro under **Adoption levels** on Details.
- Adoption help popover adds: “Levels increase as automation becomes more consistent, standardized, and measured.”
- `PrototypeNote` on Details and Edit (design notes only in prototype — see G-9).

**Edit:**
- `PlatformPageForm` + `PageFormSection`.
- **Automation goals:** quarterly run target + monthly savings target (`PageFormTextInput`; `$` display — no currency picker in prototype).
- **Adoption levels:** name + description rows with add/delete; minimum five rows; `post-ga-adoption-level-row` layout (name ~1 col, description ~2 cols).
- **Reset to defaults** secondary action — see G-8.
- Section description copy under **Automation goals** and **Adoption levels** headers on Edit only.

**Persist:** gateway/settings API in product (prototype uses `localStorage` via `dashboardSettingsUtils.ts`).

**Why:** Admins configure org-specific goals and CMMI-style adoption levels before dashboard gamification surfaces show meaningful data.

**Where:**
- `platform/settings/AutomationDashboardSettingsDetails.tsx`
- `platform/settings/AutomationDashboardSettingsEdit.tsx`
- `platform/settings/GatewaySettingsCategories.tsx`
- `platform/main/usePlatformNavigation.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils.ts`
- `frontend/awx/analytics/automation-dashboard/post-ga/maturityUtils.ts`

**Components:** `PlatformPageForm`, `PageFormGrid`, `PageFormSection`, `PageFormTextInput`, `PageFormGroup`.

**RBAC:** Platform Admin (or per gateway settings pattern).

**Open PM questions:**
- Settings storage on metrics service vs gateway API?
- Currency selector scope with settings payload?

---

## G-8. Settings defaults — empty goals, reset, section copy

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- Goal fields start **empty** on Edit (no silent 15000 / $5000 defaults).
- **Reset to defaults** clears goal fields and restores **five CMMI-style adoption level rows** (industry-standard names/descriptions).
- Factory defaults for adoption levels only; goals have no vendor benchmark defaults.

**Why:** Org-specific KPIs should not ship with misleading pre-filled targets.

**Where:** `AutomationDashboardSettingsEdit.tsx`, `dashboardSettingsUtils.ts`

**Acceptance criteria:**
- New org / first Edit shows empty quarterly run and monthly savings fields.
- Reset restores five adoption rows and clears goals.
- Details read-only reflects saved values.

**Open PM question:** Confirm empty factory defaults preferred over suggested/pre-filled targets (Aug 10 PM sync).

---

## G-9. Prototype-only — do not implement

**Jira:** N/A — UX demo only  
**Prototype-only:** Yes

**Do not ship to product:**

| Item | Location | Purpose |
|------|----------|---------|
| **Goals preview toggle** (Empty vs Populated) | `GoalsPreviewControl.tsx`, `AutomationDashboardPostGA.tsx` headerActions, `sessionStorage` | Demo empty vs populated without clearing Settings |
| **PrototypeNote** | `platform/common/PrototypeNote.tsx`, `PostGaPrototypeNotes.tsx` on Dashboard/Highlights/Settings | Design review callouts |
| **localStorage** persistence | `dashboardSettingsUtils.ts`, `maturityUtils.ts` | Replace with settings API |
| **MSW mock handlers** | `platform/src/mocks/demo/handlers/` | GitLab Pages demo only |
| **Report actions icon divergence** | See [CHANGES-GA-Dashboard.md GA-7](CHANGES-GA-Dashboard.md) | PM decision before dev |
| **Cost toolbar Checkbox + 3-col grid** | See [CHANGES-GA-Dashboard.md GA-2](CHANGES-GA-Dashboard.md) | Partially prototype delta vs devel |

**Why:** Keeps prototype flexible for UX review without committing demo mechanics to product.

---

## G-10. Help popover copy — PatternFly content guidelines (Post-GA files)

**Jira:** Create new under ANSTRAT-1976 or link to GA-8 pass  
**Prototype-only:** No

**What:** Same PF content guidelines as [CHANGES-GA-Dashboard.md GA-8](CHANGES-GA-Dashboard.md) — 1–3 sentences, second person, no marketing tone. Update popover **body** only.

**Scope (Post-GA / Settings):**
- **Page header:** `AutomationDashboardPostGA.tsx` — `titleHelp`
- **Goals card:** `DashboardGoalsCard.tsx` — Quarterly automation goal, Cost savings section helps
- **Automation at a glance:** `DashboardAtAGlanceCard.tsx` — Adoption intro; Success streak (full sentences, not `Green = …` fragments)
- **Dashboard tab KPIs/charts:** `AutomationDashboardPostGADashboardTab.tsx` — Successful jobs, Failed jobs, Hosts automated, Hours of automation, both chart cards
- **Highlights rankings:** `AutomationDashboardLeaderboards.tsx` — panel helps where not already compliant
- **Settings → Dashboard:** `AutomationDashboardSettingsDetails.tsx`, `AutomationDashboardSettingsEdit.tsx` — page `titleHelp`, goal field `labelHelp`

**Do not change:** Adoption **Levels** list inside adoption popover (formatted reference). Single-sentence compliant leaderboard helps unless copy-editing for consistency in same pass.

**Where:** Files listed above; framework `Help` component.

---

## Cross-links to GA handoff

Shared components improved on devel — do not duplicate Jira specs here:

| Topic | GA section |
|-------|------------|
| Cost toolbar NumberInput, grid, validation | GA-2 |
| Export CSV in card header | GA-1 |
| Nested cost KPI typography | GA-3 |
| No success toasts on inline save | GA-4 |
| Report actions PR #3439 | GA-5 |
| Report menu descriptions | GA-6 |
| Cost nested KPI + toolbar help copy | GA-8 |

---

## Do not combine

- **AAP-85988** (UX prototype refresh) with **AAP-85053** (GA NumberInput) — different audiences.
- **Gamification Settings (G-7)** with **GA cost toolbar (GA-2)** — different surfaces and components.
