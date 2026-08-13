# Automation Dashboard Gamification — UX handoff (Post-GA)

Net-new **gamification / Post-GA** feature work for [ANSTRAT-1976](https://issues.redhat.com/browse/ANSTRAT-1976). Prerequisite: Dashboard GA ([ANSTRAT-1981](https://issues.redhat.com/browse/ANSTRAT-1981)) ships first.

**Prototype tabs (Aug 2026):** Prior gamification UI is frozen on the **Gamification (concepts)** tab (`AutomationDashboardGamificationHighlights.tsx`, route `/gamification`). Active design work happens on **Highlights** (`AutomationDashboardLeaderboards.tsx`) — strip gamification there as the new direction takes shape. Both tabs may show identical UI until Highlights is edited.

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
| G-2 | Highlights — Automation health + pinned At a glance + Automation trends |
| G-3 | Empty states — Day 0 / first-quarter demo modes |
| G-4 | Manage view — four ranking panels + Highlights toolbar |
| G-5 | Org leaderboard — % of quarterly goal met |
| G-6 | ~~Automation adoption~~ — **removed from prototype scope** |
| G-11 | Automation health card — success donut, velocity, reuse, streak |
| G-12 | Achievement badges — tiered carousel in At a glance |
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

## G-2. Highlights tab — Automation health + pinned summary row

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- **Highlights tab layout** (top to bottom):
  1. Toolbar — Period + Organization filters, **Manage view** (G-4)
  2. **Automation health** card (full width) — G-11
  3. Pinned row — **Automation at a glance** + **Automation trends** side by side (`.post-ga-goals-row`, CSS grid `1fr 1fr`, stacks at 768px)
  4. Four Top 5 ranking panels (G-4)
- Pinned cards and Automation health are **not** in Manage view (always visible on Highlights).
- **Dashboard tab** keeps GA KPIs + Cost calculation only (summary cards live on Highlights).

**Automation trends** — follow `DashboardGoalsCard.tsx` (card title **Automation trends**, not Goals):
- PF `Card` + `CardHeader` (`Title h3 xl`) + `CardBody`.
- Three week-over-week comparison rows: **Job runs this week**, **Cost savings this week**, **Hosts managed** — each `DashboardSectionHeading` (h4 lg + `Help`) → current value (`Title h2 3xl`) → delta (`ArrowUpIcon` / `ArrowDownIcon` / `MinusIcon` + % vs previous week) → previous period label.
- Day 0 demo: `EmptyStateNoData` (“No trend data yet”). First-quarter demo: rows show without week-over-week deltas (“No previous period data yet”).
- Mock data scaled by Highlights period + org filters (`PostGaHighlightsFilterContext`).

**Automation at a glance** — follow `DashboardAtAGlanceCard.tsx`:
- Same Card shell as Automation trends.
- Top row: 3 equal columns (`GridItem span={4}`), centered metrics with vertical dividers: orgs active %, templates in use %, runs in selected period.
- **Achievements** section below metrics — horizontal badge carousel with prev/next arrows (G-12). No success streak heat strip here (moved to Automation health).
- Day 0 demo: `EmptyStateNoData` (“No automation activity yet”).

**Why:** Highlights groups health metrics, executive summary, achievements, and rankings; Dashboard stays focused on GA operational KPIs.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationHealthCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AchievementBadges.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardMetricText.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardSectionHeading.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css`

**Typography hierarchy (updated Aug 13, 2026 — see dated entry below):**

Highlights sits under a page title deliberately shrunk to `xl` (`AutomationDashboardPostGA.tsx` `titleHeadingLevel="h2"`, part of the smaller-page-title direction from `ux-filter-designs`). To avoid the card title colliding with the page title, every level below it drops one step from the original scale.

| Level | PF | Examples |
|-------|-----|----------|
| Card title | `Title h3 lg` | Automation streak, Automation dimensions, Milestone badges, Top 10 organizations/users, Automation at a glance |
| Section title | `DashboardSectionHeading` `size="md"` (`Title h4 md` + Help) | Enterprise streak, Volume/Breadth/Consistency, Your badges/Your org's badges, KPI labels |
| Metric value | `Title h2 2xl` / `3xl` | Run counts, $ amounts, percentages — intentionally left as the largest/boldest element in each card (data-emphasis, not a heading rung) |
| Helper | `Content component="small"` | Rank text, "No active streak", sync timestamp |

**Not changed:** GA Dashboard's card titles (`PageDashboardCard`, `h3 xl`) and the nested Cost calculation KPI titles (AAP-85859, `DashboardSectionHeading` default `size="lg"`) — GA's page title is still the un-shrunk `2xl` default, so its existing `xl`/`lg` ladder is already correctly proportioned.

**Acceptance criteria:**
- Automation health + pinned At a glance / Automation trends render on Highlights only.
- Cards not reorderable via Manage view.
- Responsive stack at 768px.
- Achievements carousel accessible (arrow buttons, keyboard).

---

## G-3. Empty states — Day 0 / first-quarter modes

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** Partial (demo toggle in G-9)

**What:**
- **Automation trends:** Day 0 → `EmptyStateNoData` (“No trend data yet”). First-quarter demo → comparison rows without week-over-week delta.
- **Automation at a glance:** Day 0 → `EmptyStateNoData` (“No automation activity yet”). Populated → metrics + achievements carousel.
- **Automation health:** Day 0 → compact empty state; populated → donut, sparkline, reuse, heat strip.
- Prototype **Goals preview** sidebar toggle switches Day 0 / empty (first quarter) / populated demo — see G-9.
- `GoalsConfigureEmptyState.tsx` (Configure goals → Settings Edit) remains in codebase for handoff reference but is **not** wired on Highlights cards in the current prototype. Product may still gate org leaderboard (G-5) on configured quarterly targets.

**Why:** New platforms need clear empty states before automation data exists; first period may lack prior-week comparison data.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationHealthCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/GoalsConfigureEmptyState.tsx`

**Components:** `EmptyStateNoData` (framework).

**Acceptance criteria:**
- Day 0 shows appropriate empty states on summary cards and health card.
- Populated state shows metrics when data exists.
- Week-over-week deltas hidden when no previous period (first quarter).

**Open PM questions:** Should org % / template % / runs show before quarterly goals are configured in Settings (metrics-only, no goal targets)? Prototype does not gate At a glance on Settings.

---

## G-4. Manage view — four ranking panels + Highlights toolbar

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No

**What:**
- **Manage view** modal lists **four** Top 5 ranking panels only: organizations, templates, projects, users.
- Remove **Human hours reclaimed** panel and placeholder panels from mock data and UI.
- Framework `useManageItems` + `ReorderItems` (Overview pattern).
- Ranking panels below pinned summary row: **two table cards per row** — PF `Grid` + `GridItem md={6}`; stack below `md`.
- Toolbar filters on Highlights (`usePostGaHighlightsToolbar.tsx`): PF `Toolbar` + `PageToolbarFilters` — pinned **Period** (synced with Dashboard tab via `PostGADashboardFilterContext`) and **Organization** **MultiSelect** (prototype org names from `FILTER_ORGANIZATIONS`). **Not** the full Dashboard filter set (no project, template, or label filters on Highlights).
- `PostGaHighlightsFilterProvider` scales mock cards (health, at a glance, trends, achievements, mock org/template rows) when period or org selection changes. Live API panels (projects, users, templates) use **period only**.
- Each panel: PF `Card` + compact PF `Table` (or `EmptyState`); ~320px card height.
- **Rank display:** positions #1–#3 use PF `Label variant="outline"` + `CrownIcon` with tier colors (gold / silver / bronze) — shared CSS classes with achievement badge tiers (`post-ga-tier--gold/silver/bronze`).
- **Column header:** **Total no. of jobs** — maps to metrics-service `execution_count` (GA `DashboardTableCard` parity).

**Why:** Focus rankings on actionable Top 5 lists; org filter scopes mock executive summary without duplicating full Dashboard drill-down filters.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/usePostGaHighlightsToolbar.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/PostGaHighlightsFilterContext.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaHighlightsFilterUtils.ts`
- `frontend/awx/analytics/automation-dashboard/post-ga/useManagedLeaderboardPanels.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaMockData.ts`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css`

**Acceptance criteria:**
- Manage view shows exactly four panels; reorder persists per product storage pattern.
- Human hours reclaimed not in UI or manage list.
- Period filter includes **This quarter** (see G-5).
- Organization filter is multi-select on Highlights toolbar.
- Projects and users panels load from `GET …/dashboard_reports/report/details/` (`top_projects`, `top_users`) when available.

---

## G-5. Org leaderboard — % of quarterly goal met

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No (product intent); **prototype delta** below

**What (product):**
- Top organizations panel ranked by **% of quarterly goal met** using saved quarterly run target from Settings.
- Panel help text explains ranking metric.
- Shows **—** when goals not configured.

**Prototype delta:** Organizations panel currently uses **mock data** ranked by `execution_count` with column **Total no. of jobs** — same label as projects/users for GA parity demo. Switch to % of goal met when `top_organizations` API exists and Settings targets are wired.

**Why:** Leadership view ties org performance to configured automation goals, not raw run counts alone.

**Where:** `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx`, `dashboardSettingsUtils.ts`

**API / backend:** Metrics API must expose org-level progress vs configured quarterly target (`top_organizations` on details endpoint).

**Acceptance criteria:**
- Org table sorted by % of goal met when target configured.
- Em dash when no target configured.
- **This quarter** available in Period filter.

**Open PM question:** Confirm % of quarterly goal met vs execution_count for GA org leaderboard (prototype shows execution_count).

---

## G-6. Automation adoption — removed from prototype scope

**Jira:** N/A unless product reintroduces adoption scorecard  
**Prototype-only:** Was explored; **removed** from Highlights and Settings in current prototype

**What (historical):** CMMI-style adoption level (name + description, no decimal score) was considered for At a glance and Settings. **Not in current prototype.** Leftover mock constants (`MATURITY_LEVEL`, `AUTOMATION_MATURITY_LEVELS` in `postGaMockData.ts`, `maturityUtils.ts`) are unused — safe to delete in a cleanup pass.

**If product revives this:** Backend scorecard required; UI would show level name + description only; configurable level rows were previously sketched in Settings (see `CHANGES-archive.md`).

**Do not implement** from current prototype unless PM reopens scope.

---

---

## G-11. Automation health card

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** Mock data; API wiring TBD

**What:**
- Full-width **Automation health** card on Highlights (`AutomationHealthCard.tsx`), below toolbar, above pinned At a glance / Automation trends row.
- Four sections in a responsive grid:
  1. **Job success rate** — `@patternfly/react-charts` `ChartDonut` inside `PageChartContainer`; legend for successful / failed / error / canceled using `pfSuccess`, `pfDanger`, `pfWarning`, `pfInfo`.
  2. **Automation velocity** — `ChartLine` sparkline + week-over-week delta (`ArrowUpIcon` / `ArrowDownIcon`).
  3. **Template reuse** — percentage metric with help popover.
  4. **Success streak** — 30-day heat strip (custom `.streak-heat-cell` divs + PF `Tooltip` per day); streak length label uses `FireIcon`; milestone labels may use `TrophyIcon`.
- Day 0: compact `EmptyStateNoData`. Mock metrics scaled by Highlights period + org filters.
- Replaces earlier placement of success streak on At a glance card.

**Why:** Operators need at-a-glance health signals (reliability, momentum, reuse, consistency) before diving into leaderboards.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationHealthCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaMockData.ts` (`JOB_SUCCESS_BREAKDOWN`, `AUTOMATION_VELOCITY`, `TEMPLATE_REUSE`, streak helpers)
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaHighlightsFilterUtils.ts`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css`

**Components:** PF `Card`, `ChartDonut`, `ChartLine`, `PageChartContainer`, `Help`, `Tooltip`.

**Acceptance criteria:**
- Donut and sparkline use PF charts (not custom SVG).
- Heat strip shows 30 days with accessible tooltips.
- Card respects period filter; org filter scopes mock data in prototype.

---

## G-12. Achievement badges

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** Mock tier logic; API TBD

**What:**
- **Achievements** subsection inside **Automation at a glance** — horizontal carousel (`AchievementBadges.tsx`) with previous/next arrow buttons.
- **Eight badges**, each with bronze / silver / gold tiers (0–3 PF `StarIcon` on earned badges).
- **Sort order:** earned badges left (gold → silver → bronze by tier rank), locked badges right.
- **Visual design:** tier border and icon tint use PF nonstatus yellow / gray / orange tokens — same palette as leaderboard rank crowns (`achievement-badge--tier-gold/silver/bronze` in `postGa.css`).
- **Icons:** PF icons per badge (e.g. `FireIcon` Daily Streak, `TrophyIcon` 10K Runs).
- **Tooltip:** description + Gold/Silver/Bronze tier legend (colored dot + requirement text); use **org** abbreviation in tier lines where space is tight (e.g. “50% of orgs active”).
- **Locked state:** muted icon, tier stars hidden, tooltip still shows requirements.
- Mock inputs: `ACHIEVEMENT_METRICS` in `postGaMockData.ts`; demo tuned so at least one gold-tier earned badge is visible by default.

**Why:** Gamification motivates adoption and surfaces platform health signals without duplicating raw KPI tables.

**Where:**
- `frontend/awx/analytics/automation-dashboard/post-ga/AchievementBadges.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGaMockData.ts`
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css`

**Open PM questions** (from `PostGaPrototypeNotes`):
- Remove **Org Adoption** and **Daily Streak** badges (overlap At a glance org % and Automation health streak)?
- Day 0: locked badge row vs placeholder text vs hidden until first job?
- Per-badge threshold confirmation (Recovery, Clean week, Run distribution, Execution balance).

**Acceptance criteria:**
- Carousel keyboard-accessible; badges expose name and tier via tooltip.
- Earned-first sort; tier colors match crown tokens in light and dark theme.
- No inline `border` shorthand that overrides tier `border-color` (borders defined in CSS).

---

## G-7. Settings → Dashboard — Details + Edit

**Jira:** Create new (ANSTRAT-1976)  
**Prototype-only:** No (API/storage TBD)

**What:**

**Nav:** **Settings → Automation Analytics → Dashboard** (`/settings/automation-analytics/dashboard`, Edit at `/edit`).

**Nav label and page title:** **Dashboard** (not "Dashboard Settings") — grouped Settings pattern like Automation Execution → System.

**Details:**
- `PageFormGrid` + read-only `PageFormGroup` (not `PageDetails`).
- `PageFormSection` for **Automation goals** only (quarterly run target + monthly savings target).
- Pinned **Edit** action in header.
- `PrototypeNote` on Details and Edit (design notes only in prototype — see G-9).

**Edit:**
- `PlatformPageForm` + `PageFormSection`.
- **Automation goals:** quarterly run target + monthly savings target (`PageFormTextInput`; `$` display — no currency picker in prototype).
- **Reset to defaults** secondary action — see G-8.
- Section description copy under **Automation goals** header on Edit only.

**Persist:** gateway/settings API in product (prototype uses `localStorage` via `dashboardSettingsUtils.ts`).

**Why:** Admins configure org-specific quarterly run and monthly savings targets for goal-based leaderboard ranking (G-5).

**Where:**
- `platform/settings/AutomationDashboardSettingsDetails.tsx`
- `platform/settings/AutomationDashboardSettingsEdit.tsx`
- `platform/settings/GatewaySettingsCategories.tsx`
- `platform/main/usePlatformNavigation.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils.ts`

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
- **Reset to defaults** clears goal fields (empty quarterly run and monthly savings).
- No vendor benchmark defaults for goals.

**Why:** Org-specific KPIs should not ship with misleading pre-filled targets.

**Where:** `AutomationDashboardSettingsEdit.tsx`, `dashboardSettingsUtils.ts`

**Acceptance criteria:**
- New org / first Edit shows empty quarterly run and monthly savings fields.
- Reset clears goals.
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
| **PostGaHighlightsFilterContext** + utils | `PostGaHighlightsFilterContext.tsx`, `postGaHighlightsFilterUtils.ts` | Prototype org/period scaling for mock cards |
| **Gamification (concepts) tab** | `AutomationDashboardGamificationHighlights.tsx`, `AutomationDashboardPostGAGamificationTab.tsx` | Frozen prior direction; hide tab from nav or deploy when no longer needed for review |
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
- **Automation trends:** `DashboardGoalsCard.tsx` — Job runs, Cost savings, Hosts managed section helps
- **Automation at a glance:** `DashboardAtAGlanceCard.tsx` — metric helps; Achievements intro if needed
- **Automation health:** `AutomationHealthCard.tsx` — success rate, velocity, template reuse, success streak helps
- **Dashboard tab KPIs/charts:** `AutomationDashboardPostGADashboardTab.tsx` — Successful jobs, Failed jobs, Hosts automated, Hours of automation, both chart cards
- **Highlights rankings:** `AutomationDashboardLeaderboards.tsx` — panel helps where not already compliant
- **Settings → Dashboard:** `AutomationDashboardSettingsDetails.tsx`, `AutomationDashboardSettingsEdit.tsx` — page `titleHelp`, goal field `labelHelp`

**Do not change:** Single-sentence compliant leaderboard helps unless copy-editing for consistency in same pass.

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

---

## [Aug 12, 2026] Highlights prototype refresh — health, trends, achievements

**What:** Highlights tab layout updated: toolbar (period + organization multi-select) → **Automation health** card → pinned **Automation at a glance** + **Automation trends** → four Top 5 leaderboards. Achievement badges, PF charts, org filter on mock data. **Automation adoption scorecard removed** from prototype (Highlights + Settings). Quarterly goals progress UI replaced by Automation trends on Highlights.

**Why:** Align prototype with PM/design review: separate health metrics from summary KPIs, add gamification badges, simplify Highlights filters vs full Dashboard, use PF charts/icons.

**Where:** `AutomationDashboardLeaderboards.tsx`, `AutomationHealthCard.tsx`, `DashboardGoalsCard.tsx`, `DashboardAtAGlanceCard.tsx`, `AchievementBadges.tsx`, `usePostGaHighlightsToolbar.tsx`, `PostGaHighlightsFilterContext.tsx`, `postGaHighlightsFilterUtils.ts`, `postGaMockData.ts`, `postGa.css`, `PostGaPrototypeNotes.tsx`, `CHANGES-Gamification.md` (G-2–G-6, G-11, G-12).

---

## [Aug 13, 2026] Highlights typography — drop card/section titles one step so they don't collide with the page title

**What:** Highlights' page title renders at `xl` (an intentionally smaller, experimental page-title scale — see `AutomationDashboardPostGA.tsx`), which was the same visual size as every card title (`h3 xl`) on the tab. Rescaled the whole Highlights ladder down one step so page > card > section stays a clear, distinct hierarchy: card titles `h3 xl` → `h3 lg` (Automation streak, Automation dimensions, Milestone badges, Top 10 organizations/Top 10 users leaderboard panels, Automation at a glance), and section titles `h4 lg` → `h4 md` (Enterprise streak legend, Volume/Breadth/Consistency, Your badges/Your org's badges, at-a-glance KPI labels). `AtAGlanceKpiMetric` also swapped its ad-hoc `Title h2 xl` metric value for the shared `MetricValue` component (`h2 2xl`) to match the documented metric-value tier. `HighlightsSyncTimestamp` swapped `Content component="p"` + inline font-size override for `Content component="small"` to match the documented helper tier. Metric values and helper text are unchanged in size — they sit outside the heading ladder by design. GA Dashboard is untouched: its page title is still the default `2xl`, so its existing `h3 xl` card / `h4 lg` section ladder (and the AAP-85859 nested Cost calculation KPI titles) remains correctly proportioned.
**Why:** A card title matching the page title breaks the page > card > section visual hierarchy and reads as a design bug. Since the smaller Highlights page title is an intentional experiment (not a mistake), the fix is to cascade every level below it down one step rather than reverting the page title.
**Where:** `DashboardSectionHeading.tsx` (new optional `size?: 'lg' | 'md'` prop, default `'lg'` so GA/AAP-85859 usages are unaffected); `HighlightsAtAGlanceCard.tsx`, `AutomationDimensionsCard.tsx`, `AutomationStreakCard.tsx`, `LeaderboardPanelCard.tsx`, `MilestoneBadgesCard.tsx` (card title `xl` → `lg`); `AutomationDimensionsCard.tsx`, `AtAGlanceKpiMetric.tsx`, `MilestoneBadgesCard.tsx`, `AutomationStreakCard.tsx` (`DashboardSectionHeading` now passed `size="md"`); `AtAGlanceKpiMetric.tsx` (metric value switched to `MetricValue`); `HighlightsSyncTimestamp.tsx` (helper text switched to `Content component="small"`); `CHANGES-Gamification.md` (G-2 typography hierarchy table).
