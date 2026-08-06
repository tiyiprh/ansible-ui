## [Aug 5, 2026] Post GA Automation Dashboard (AAP-85988)

**What:**

Post-GA Automation Dashboard under Analytics — tabbed page with **Dashboard** (default) and **Leaderboards**.

**Page shell**
- Route: Analytics → Automation Dashboard (post-GA demo path `automation-dashboard/post-ga/dashboard`).
- Use `PageLayout` + `PageHeader` (`titleHeadingLevel="h2"`, help popover only — no description line).
- Tabs: framework `PageRoutedTabs` with `insetSm`, child routes (`/dashboard`, `/leaderboards`), `<Outlet />` for tab content — same pattern as org/detail pages, not local `Tabs` state.
- `DashboardToolbar` on Dashboard tab only (filters from existing `useAutomationDashboardToolbar`).

**Dashboard tab — top summary row (side-by-side, plain PF `Card`, not `PageDashboardCard`)**
- **Goals** card: Quarterly automation goal + Cost savings this month. Each section: section heading + help, metric value, PF `Progress` (outside measure), helper text. Mock data only.
- **Automation at a glance** card: three top metrics (orgs active %, templates in use %, runs this month); **Automation adoption** (score 1–5, star icons, level name + description, help popover with maturity levels); **Success streak** (30-day heat strip, green = successful run day, gray = none, tooltip per day). Heat strip is custom markup — no PF heat-map component.

**Dashboard tab — GA dashboard body (reuse existing components)**
- Four KPI value cards: Successful jobs, Failed jobs, Hosts automated, Hours of automation (`DashboardValueCard` / `PageDashboardCard`).
- Two chart cards: hosts over time, job runs over time (`DashboardChartCard`).
- **Cost calculation** card (`DashboardMainTableCard`): toolbar row for subscription cost inputs; **four nested KPI cards** with **section-level titles** (smaller than card title): Cost of manual automation, Cost of automated execution, Total savings/cost avoided, Total hours saved/avoided; template-level table below. Nested KPI titles use section heading level, not full card-title level.
- Remove Top 5 projects / Top 5 users from Dashboard tab (moved to Leaderboards).

**Leaderboards tab**
- Ranking panels: Top organizations, templates, projects, users, human hours saved (mock data).
- **Layout: two table cards per row** — PF `Grid` + `GridItem md={6}` (matches source prototype); stack to one column below `md`.
- **Toolbar filters:** PF `Toolbar` + framework `PageToolbarFilters` with two pinned `SingleSelect` filters — labels **Period** and **Organization** beside `PageSingleSelect` (rename from "View"); same pattern as Dashboard tab toolbar.
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

**Prototype-only — Cost calculation toolbar layout:**

- Switch wrapped in `FormGroup` (label above, toggle below) to match number field layout — aligns toggle with inputs, not inline switch label.
- Reduced top padding on first `CardBody` in Cost calculation card (tighter gap between title + Export and toolbar fields).

**Where:** `components/DashboardTableToolbarRow.tsx`, `components/DashboardMainTableCard.tsx`.

**Why:** Align prototype with in-flight upstream UX fixes (#3439, #3435 already on branch); clarify Create vs Update at menu open; polish Cost calculation toolbar for Post GA demo.

**Note:** PR #3435 (Export CSV in card header) was already cherry-picked on this branch — no additional #3435 work in this entry.

## [Aug 5, 2026] ANSTRAT-1976 gamification parity — Settings, goals empty state, leaderboards

**What:**

**Settings → Automation Dashboard** (Gateway pattern):
- Split into read-only **Details** (`PageDetails` + pinned Edit) and **Edit** route (`PlatformPageForm` + `PageFormSection`).
- Section **Automation goals**: quarterly run target (number), monthly savings target (number, `$` display — no currency picker).
- Section **Adoption levels**: name + description rows with add/delete; Reset to defaults on Edit.
- Persist goals and adoption levels in localStorage via shared utils.

**Dashboard — Goals card:**
- Reads saved goal **targets** from Settings; mock progress values unchanged.
- **Empty state** when goals not configured: framework `EmptyStateCustom` + **Configure goals** button → Settings Edit.
- **Quarterly countdown**: helper text "{{days}} days left in quarter" under progress bar.
- **Prototype control** (demo only): yellow dashed **Prototype** chrome in page header top-right — **Goals: Configured | Not configured** (default Configured); `sessionStorage` override for demo without clearing Settings.

**Dashboard — Automation at a glance:**
- **Configure** link (cog) on Automation adoption section → Settings.
- Fix **out of N** to use saved adoption level count (not hardcoded 5).
- Remove double divider under top metrics row; PF token spacing cleanup.

**Leaderboards:**
- Add **This quarter** period filter (mock scales row values by period).
- Org panel help text: ranked by **% of goal met**; % column uses saved quarterly run target.

**Where:**
- `platform/settings/AutomationDashboardSettingsDetails.tsx`, `AutomationDashboardSettingsEdit.tsx` — new Settings Details + Edit
- `platform/main/usePlatformNavigation.tsx` — child routes `''` + `edit`; removed inline `AutomationDashboardSettings.tsx`
- `frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils.ts` — goals storage, preview mode, countdown helper
- `frontend/awx/analytics/automation-dashboard/post-ga/maturityUtils.ts` — `saveMaturityLevels()`
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardGoalsCard.tsx` — empty/populated states, countdown
- `frontend/awx/analytics/automation-dashboard/post-ga/GoalsPreviewControl.tsx`, `platform/common/PrototypeDemoControl.tsx` — demo header control
- `frontend/awx/analytics/automation-dashboard/AutomationDashboardPostGA.tsx` — headerActions preview control
- `frontend/awx/analytics/automation-dashboard/post-ga/DashboardAtAGlanceCard.tsx` — Configure link, out-of-N, divider/spacing
- `frontend/awx/analytics/automation-dashboard/post-ga/AutomationDashboardLeaderboards.tsx` — This quarter filter, goal target wiring, help text
- Deleted `AutomationMaturityCard.tsx` (unused)

**Why:** Align Post GA gamification prototype with ANSTRAT-1976 kickoff decisions: configurable goals + adoption levels in Settings, first-time goals setup empty state, leaderboards period filter, and AAP UI patterns for settings and empty states.

## [Aug 5, 2026] Automation Dashboard Settings — Details layout parity with Edit

**What:** Fix read-only **Automation Dashboard Settings** Details page so it mirrors the Edit form layout.
- **Automation goals:** `PageDetails` with `numberOfColumns="multiple"` (3-column form rhythm); remove `disablePadding` so standard 24px padding returns.
- **Adoption levels:** each level row uses `post-ga-adoption-level-row` (name ~1 col, description ~2 cols) with `FormGroup` label-above read-only text — same structure as Edit minus inputs and add/delete buttons.

**Why:** Details had lost padding and used a 50/50 two-column `PageDetails` grid for adoption levels, which did not match the Edit page's 1+2 row layout.

**Where:** `platform/settings/AutomationDashboardSettingsDetails.tsx` — layout only
