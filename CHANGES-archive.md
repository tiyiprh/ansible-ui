# CHANGES.md archive

Original chronological log — superseded Aug 10, 2026. Living specs: **CHANGES-GA-Dashboard.md** + **CHANGES-Gamification.md**.

---

## [Aug 10, 2026] Post-GA dashboard polish — Highlights tab, empty states, settings defaults

**What:**
- Rename **Leaderboards** tab label to **Highlights** (`dataCy`: `post-ga-highlights-tab`); route path stays `/leaderboards`.
- Move **Goals** and **Automation at a glance** cards from Dashboard tab to Highlights tab (pinned, side-by-side `.post-ga-goals-row` below Period/Organization filters and **Manage view**); Dashboard tab keeps GA KPIs + Cost calculation only.
- When goals are not configured, both cards show framework `EmptyStateCustom` (`variant="sm"`) with primary **Configure goals** → Settings Edit; header preview toggle still switches Empty vs Populated demo data. **Automation adoption** shows **Level N – Name** + description only (no decimal score or star row); mock uses `MATURITY_LEVEL`.
- **Manage view** modal lists only four Top 5 ranking panels (orgs, templates, projects, users); remove Human hours reclaimed panel and placeholder panels from mock data and UI.
- Cost toolbar uses a **3-column grid** matching framework `PageFormGrid` breakpoints (`sm=12`, `md/lg/xl=6`, `xl2=4`): PF **NumberInput** for hourly rate and monthly AAP cost with **reserved helper-text space** (`reserveErrorSpace`) so inline validation does not shift the row; **Include automation creation time** **Checkbox** + Help in the third column, vertically centered on the NumberInput control band (padding brackets label + error rows). Per-row **Time taken to manually execute** uses **TextInput** `type="number"` via `DashboardTableInputField` `inputVariant` prop. **Export CSV** stays in the card header only (not in toolbar). **No success toasts** on subscription-cost or template-metadata saves (inline update only; error and refresh-failure toasts remain).
- **Settings → Dashboard Edit:** goal fields start empty (no silent 15000 / $5000 defaults); **Reset to defaults** clears goals and restores five CMMI-style adoption levels; section description copy under **Automation goals** and **Adoption levels** headers on Edit only; minimum five adoption rows. **Details:** one-line intro under **Adoption levels**; adoption help popover adds “Levels increase as automation becomes more consistent, standardized, and measured.”
- **PrototypeNote** (`platform/common/PrototypeNote.tsx`): collapsed by default, full-width dashed header with chevron, no emoji pill. Design notes on Settings **Details and Edit**, Highlights (empty states + preview toggle), and Dashboard tab (report actions + cost toolbar). Open PM questions: empty vs pre-populated goal defaults; adoption scorecard inputs and aggregation.

**Why:** Align prototype with UX review — Highlights tab groups summary cards + rankings, empty states guide admins to configure goals, settings defaults reflect org-specific KPIs (not vendor benchmarks), and table vs toolbar inputs follow PatternFly guidance for dense cells vs form fields.

**Where:** `platform/common/PrototypeNote.tsx`; `platform/settings/AutomationDashboardSettingsEdit.tsx`, `AutomationDashboardSettingsDetails.tsx`; `frontend/awx/analytics/automation-dashboard/AutomationDashboardPostGA.tsx`; `post-ga/AutomationDashboardPostGADashboardTab.tsx`, `AutomationDashboardPostGALeaderboardsTab.tsx`, `AutomationDashboardLeaderboards.tsx`, `DashboardGoalsCard.tsx`, `DashboardAtAGlanceCard.tsx`, `GoalsConfigureEmptyState.tsx`, `dashboardSettingsUtils.ts`, `postGaMockData.ts`, `useManagedLeaderboardPanels.tsx`, `PostGaPrototypeNotes.tsx`, `postGa.css`; `components/DashboardTableInputField.tsx`, `DashboardTableToolbarRow.tsx`, `DashboardMainTableCard.tsx`, `types/index.ts`.

## [Aug 6, 2026] Help popover copy — PatternFly content guidelines (new Jira required)

**What:** Revise `Help` / `PageHeader` `titleHelp` / `PageFormGroup` `labelHelp` popover copy across Post-GA Automation Dashboard and related Settings to follow [PatternFly popover content guidelines](https://www.patternfly.org/components/popover/design-guidelines): 1–3 concise sentences, full sentences with punctuation, second person (“you/your”), no title repetition, no marketing tone.

**Scope — update popover body text only (not labels, titles, or tooltips):**
- **Page header:** `AutomationDashboardPostGA.tsx` — `titleHelp` (replace long marketing description with practical 2-sentence summary).
- **Goals card:** `DashboardGoalsCard.tsx` — Quarterly automation goal, Cost savings this month section helps.
- **Automation at a glance:** `DashboardAtAGlanceCard.tsx` — Automation adoption intro paragraph; Success streak (replace `Green = …` / `gray = …` fragments with full sentences).
- **Dashboard tab KPIs and charts:** `AutomationDashboardPostGADashboardTab.tsx` — Successful jobs, Failed jobs, Hosts automated, Hours of automation, both chart cards (trim to 2 sentences each; second person where applicable).
- **Leaderboards:** `AutomationDashboardLeaderboards.tsx` — Top 5 users, Human hours reclaimed panel helps.
- **Cost calculation nested KPIs:** `DashboardMainTableCard.tsx` — four nested cost KPI help strings (convert phrase fragments to full sentences with periods).
- **Cost toolbar checkbox:** `DashboardTableToolbarRow.tsx` — Include automation creation time help.
- **Settings → Dashboard:** `AutomationDashboardSettingsDetails.tsx`, `AutomationDashboardSettingsEdit.tsx` — page `titleHelp`, Quarterly run target and Monthly savings target `labelHelp`.

**Do not change:** Automation adoption **Levels** list inside the adoption popover (formatted reference content is valid per PF popover pattern). Leaderboard panels with already-compliant single-sentence helps (orgs, templates, projects) unless copy-edited for consistency in the same pass.

**Why:** Existing help text predates PF content review — some strings used semicolon fragments, impersonal tone, or marketing language on the page header. Aligns with PF sentence-structure guidance (second person, active voice) before dev handoff.

**Where:** Files listed above under Scope. Uses framework `Help` component (`Popover` with `headerContent={title}`).

## [Aug 6, 2026] Cost calculation toolbar — NumberInput and 3-column form layout ([AAP-85053](https://issues.redhat.com/browse/AAP-85053))

**What:** Cost calculation card subscription-cost toolbar uses a 3-column grid matching framework `PageFormGrid` breakpoints (`GridItem sm=12`, `md/lg/xl=6`, `xl2=4`):
- **Hourly rate** and **Monthly AAP cost**: PF [`NumberInput`](https://www.patternfly.org/components/number-input/) with `FormGroup` label above, +/- steppers, existing 600ms debounced save via `putRequest` to `metricsAPI` subscription_costs. Wrap each field in `Form` with `onSubmit` preventDefault (NumberInput uses a nested form). Pass `reserveErrorSpace` so helper-text row height is fixed when valid.
- **Include automation creation time**: inline **Checkbox** (label + Help on one line), not upstream Switch.
- Alignment: grid `align-items: stretch`; checkbox column pads past label + error rows and vertically centers on the NumberInput band; `reserveErrorSpace` on number fields prevents row-height jump on validation.
- Card body keeps reduced top padding (`paddingBlockStart: 0`) between Export CSV header and toolbar fields.

**Why:** Match PF number-input pattern for cost fields and align toolbar layout with Settings form rhythm for Post-GA demo review ([AAP-85053](https://issues.redhat.com/browse/AAP-85053)).

**Where:** `frontend/awx/analytics/automation-dashboard/components/DashboardTableInputField.tsx` — NumberInput + `reserveErrorSpace`; `components/DashboardTableToolbarRow.tsx` — 3-column grid + checkbox; `post-ga/postGa.css` — alignment classes; `components/DashboardMainTableCard.tsx` — header Export + body padding (from PR #3435).

## [Aug 5, 2026] Post GA Automation Dashboard (AAP-85988)

**What:**

Post-GA Automation Dashboard under Analytics — tabbed page with **Dashboard** (default) and **Leaderboards**.

**Page shell**
- Route: Analytics → Automation Dashboard (post-GA demo path `automation-dashboard/post-ga/dashboard`).
- Use `PageLayout` + `PageHeader` with help popover only (`titleHelp` / `titleHelpTitle`) — **no** `description` prop, **no** Export PDF, **no** Sync data in header. Smaller header title sizing is deferred to a future platform-wide change.
- Tabs: framework `PageRoutedTabs` with `insetSm`, child routes (`/dashboard`, `/leaderboards`), `<Outlet />` for tab content — same pattern as org/detail pages, not local `Tabs` state.
- `DashboardToolbar` on Dashboard tab only (filters from existing `useAutomationDashboardToolbar`).

**Dashboard tab — top summary row (custom PF `Card` layout, not `PageDashboardCard`)**

Side-by-side row via `.post-ga-goals-row` in `post-ga/postGa.css` (CSS grid `1fr 1fr`, stacks at 768px), wired in `AutomationDashboardPostGADashboardTab.tsx` above the GA KPI grid.

**Goals card** — follow `DashboardGoalsCard.tsx`:
- PF `Card` + `CardHeader` (`Title h3 xl`) + `CardBody`.
- Two sections, each: `DashboardSectionHeading` (h4 lg + framework `Help`) → `MetricValue` / `MetricLabel` (`DashboardMetricText.tsx`) → PF `Progress` (`measureLocation="outside"`).
- Sections: **Quarterly automation goal**, **Cost savings this month**.
- **Targets** (denominator / goal amounts): read from Settings via `dashboardSettingsUtils.ts`.
- **Current progress values** (numerator): wired to metrics/dashboard API in product.
- **Empty state:** em-dash placeholders + **Configure goals** primary button → Settings Edit (when targets unset).
- **Quarterly countdown:** helper under progress bar (`{{days}} days left in quarter`).

**Automation at a glance** — follow `DashboardAtAGlanceCard.tsx`:
- Same Card shell pattern as Goals.
- **Top row:** 3 equal columns (`GridItem span={4}`), centered metrics with vertical dividers (`.post-ga-at-a-glance-metric-col`): orgs active %, templates in use %, runs this month.
- **Automation adoption:** `DashboardSectionHeading` + score + star icons + level name/description; levels loaded from Settings (`maturityUtils.ts`); dynamic “out of N”.
- **Success streak:** `DashboardSectionHeading` + 30-day heat strip — custom `div` cells (`.streak-heat-cell`, success/empty classes), PF `Tooltip` per day; **no** PF heat-map component.

**Dashboard tab — GA dashboard body (reuse existing components)**
- Four KPI value cards: Successful jobs, Failed jobs, Hosts automated, Hours of automation (`DashboardValueCard` / `PageDashboardCard`).
- Two chart cards: hosts over time, job runs over time (`DashboardChartCard`).
- **Cost calculation** card (`DashboardMainTableCard`): four nested KPI cards with **section-level titles**; template-level table below. Nested KPI titles use section heading level, not full card-title level. Subscription-cost toolbar — see Aug 6 entry ([AAP-85053](https://issues.redhat.com/browse/AAP-85053)).
- Remove Top 5 projects / Top 5 users from Dashboard tab (moved to Leaderboards).

**Leaderboards tab**
- Ranking panels: Top organizations, templates, projects, users, human hours saved (metrics API in product).
- **Layout: two table cards per row** — PF `Grid` + `GridItem md={6}`; stack to one column below `md`.
- **Toolbar filters:** PF `Toolbar` + framework `PageToolbarFilters` with two pinned `SingleSelect` filters — labels **Period** and **Organization** beside `PageSingleSelect`; same pattern as Dashboard tab toolbar.
- **Manage view** using framework `useManageItems` + `ReorderItems` (Overview pattern).
- Each panel: PF `Card` + compact PF `Table` (or `EmptyState` when no data); ~320px card height.

**Typography hierarchy (standardize across Post GA + nested cost KPIs)**

| Level | PF | Examples |
|-------|-----|----------|
| Card title | `Title h3 xl` + Help | Goals, At a glance, Successful jobs, Cost calculation |
| Section title | `Title h4 lg` + Help (`DashboardSectionHeading`) | Quarterly goal, Cost savings, Automation adoption, Success streak, nested cost KPI titles |
| Metric value | `Title h2 2xl` or existing value-card span | Run counts, $ amounts, percentages |
| Helper | `Content component="small"` | "runs to go", "Last 30 days", level description |

**Why:** Post-GA dashboard extends GA analytics with goals, adoption maturity, success streak, and leaderboards so operators and leadership can track automation ROI and team performance in one place (AAP-85988).

**Where:**
- `frontend/awx/analytics/automation-dashboard/AutomationDashboardPostGA.tsx` — page shell, `PageRoutedTabs`
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardPostGADashboardTab.tsx` — Dashboard tab
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardPostGALeaderboardsTab.tsx` — Leaderboards tab
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx` — Goals card
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx` — At a glance + adoption + streak
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardMetricText.tsx` — shared metric value/label typography
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardSectionHeading.tsx` — shared section heading
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css` — goals row, at-a-glance, cost toolbar alignment
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx` — Leaderboards content
- `frontend/awx/analytics/automation-dashboard/post-ga/useManagedLeaderboardPanels.tsx` — Manage view
- `frontend/awx/analytics/automation-dashboard/components/DashboardValueCard.tsx` — `titleVariant="section"` for nested cost KPIs
- `frontend/awx/analytics/automation-dashboard/components/DashboardMainTableCard.tsx` — pass `titleVariant="section"` on nested cards
- `frontend/awx/main/AwxRoutes.tsx` — route enum entries for dashboard + leaderboards child routes
- `frontend/awx/main/useAwxNavigation.tsx` — nested routes under post-ga

## [Aug 5, 2026] Automation Dashboard — PR #3439 parity + Report actions menu descriptions

**Upstream parity (PR #3439 / AAP-85025):** Ported open PR changes into the prototype demo. Matches [PR #3439](https://github.com/ansible/ansible-ui/pull/3439) — no new design beyond that PR.

- **Report actions:** Dropdown label **Report actions**; sub-actions **Create new report**, **Update report**, **Delete report** (was Save as report / Save report / Rename report). **Update report** stays enabled on default filter state; **Create new report** disabled until filters differ from default or custom date range is invalid. Separate disabled tooltips for create vs update paths.
- **Create/Update report dialog:** Titles **Create new report** / **Update report**; modal description text; submit **Create report** / **Save changes**.
- **Period filter:** `ToolbarDateRangeFilter` derives custom dates from `filterValues` (saved reports load correctly); clear end-date button; remembers custom range when switching presets. `DashboardToolbar` seeds custom start date to 7 days ago on first Custom selection.
- **`queryString`:** Stricter custom date validation (start ≤ end; start ≤ today for partial range).

**Where (upstream parity):** `framework/PageToolbar/PageToolbarFilters/ToolbarDateRangeFilter.tsx`, `frontend/awx/analytics/automation-dashboard/common/useAutomationDashboardToolbarActions.tsx`, `useCreateEditToolbarFilterSetDialog.tsx`, `components/DashboardToolbar.tsx`, `utils/queryString.ts`, and matching test files.

**Adds on to PR #3439 (requires new Jira issue):** #3439 uses tooltips + modal descriptions only; it does **not** add menu item descriptions. This prototype extends Report actions with secondary description text under each dropdown item (mirror `SelectOption` in `PageSingleSelect`):

| Menu item | Description |
|-----------|-------------|
| Create new report | Save the current filter set as a new report |
| Update report | Replace this report's saved filters with the current view |

**Delete report** has no description; a **divider** (`PageActionType.Seperator`) separates it from Create/Update (standard AAP pattern for destructive dropdown actions).

Disabled **Create new report** tooltip when on default filters: **Change filters to save as a new report** (tooltip only — not duplicated in menu description).

**Framework:** Optional `description` on `IPageAction` wired through `PageActionDropdown` → PF `DropdownItem`.

**Where (enhancement):** `framework/PageActions/PageAction.tsx`, `PageActionDropdown.tsx`, `useAutomationDashboardToolbarActions.tsx`.

**Prototype-only — divergences from `origin/devel` (Report actions):**

| Topic | Upstream (`origin/devel`) | This prototype |
|-------|---------------------------|----------------|
| Report actions dropdown trigger | `PlusCircleIcon` on dropdown | **No icon** on **Report actions** trigger when a saved report is selected; `PlusCircleIcon` on standalone **Create new report** only |

Cost calculation toolbar divergences (NumberInput, Checkbox, layout, Export CSV) — see Aug 6 entry ([AAP-85053](https://issues.redhat.com/browse/AAP-85053)).

**Why:** Align prototype with in-flight upstream UX fixes (#3439); clarify Create vs Update at menu open.

## [Aug 5, 2026] ANSTRAT-1976 gamification parity — Settings, goals empty state, leaderboards

**What:**

**Settings → Automation Analytics → Dashboard** (Gateway Settings pattern):
- Nav path: **Settings → Automation Analytics → Dashboard** (`/settings/automation-analytics/dashboard`, Edit at `/edit`).
- **Nav label and page title:** **Dashboard** (not "Dashboard Settings" or "Automation Dashboard Settings") — follows grouped Settings pattern (Automation Execution → System / Job / Logging); top-level "[Name] Settings" pattern applies only to items like Subscription Settings.
- Split into read-only **Details** and **Edit** routes — follow `GatewaySettingsDetails.tsx` / `GatewaySettingsEdit.tsx`.
- **Details:** `PageFormGrid` + read-only `PageFormGroup` (not `PageDetails`); `PageFormSection` for **Automation goals** and **Adoption levels**; pinned Edit action in header.
- **Automation goals** (Details): read-only values in 3-column form rhythm (`PageFormGrid`).
- **Adoption levels** (Details): each level row uses `post-ga-adoption-level-row` (name ~1 col, description ~2 cols) with `FormGroup` label-above read-only text — same structure as Edit minus inputs and add/delete buttons.
- **Edit:** `PlatformPageForm` + `PageFormSection`; quarterly run target + monthly savings target (`PageFormTextInput`, `$` display — no currency picker); adoption level name + description rows with add/delete; **Reset to defaults** secondary action.
- Persist goals and adoption levels via settings API in product (prototype uses localStorage via shared utils).

**Dashboard — Goals card:**
- Reads saved goal **targets** from Settings; current progress from metrics/dashboard API in product.
- **Empty state** when goals not configured: em-dash placeholders on metrics + **Configure goals** button → Settings Edit.
- **Quarterly countdown:** helper text "{{days}} days left in quarter" under progress bar.
- **Prototype control** (demo only): yellow dashed **Prototype** chrome in page header top-right — **Goals: Empty state | Populated** (default **Empty state**); `sessionStorage` override for demo without clearing Settings.

**Dashboard — Automation at a glance:**
- **Configure** link on Automation adoption — **out of scope** for this prototype.
- **Out of N** uses saved adoption level count from Settings (not hardcoded 5).
- Remove double divider under top metrics row; PF token spacing cleanup.

**Leaderboards:**
- Add **This quarter** period filter.
- Org panel help text: ranked by **% of goal met**; % column uses saved quarterly run target from Settings.

**Where:**
- `platform/settings/AutomationDashboardSettingsDetails.tsx`, `AutomationDashboardSettingsEdit.tsx` — page title **Dashboard** on Details + Edit; Settings Details + Edit layout
- `platform/main/usePlatformNavigation.tsx` — nested Settings → Automation Analytics → Dashboard routes
- `frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils.ts` — goals storage, preview mode, countdown helper
- `frontend/awx/analytics/automation-dashboard/post-ga/maturityUtils.ts` — `saveMaturityLevels()`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx` — empty/populated states, countdown
- `frontend/awx/analytics/automation-dashboard/post-ga/GoalsPreviewControl.tsx`, `platform/common/PrototypeDemoControl.tsx` — demo header control
- `frontend/awx/analytics/automation-dashboard/AutomationDashboardPostGA.tsx` — headerActions preview control
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx` — out-of-N, divider/spacing
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx` — This quarter filter, goal target wiring, help text

**Why:** Align Post GA gamification with ANSTRAT-1976 kickoff decisions: configurable goals + adoption levels in Settings, first-time goals setup empty state, leaderboards period filter, and AAP UI patterns for settings and empty states.
