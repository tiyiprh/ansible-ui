# GA Automation Dashboard — UX handoff (devel improvements)

Improvements to the **shipping** Automation Dashboard on `devel`. Handoff sections below (GA-1, GA-2, …) are **doc section IDs only** — not Jira issue keys.

**Feature:** [ANSTRAT-2377](https://issues.redhat.com/browse/ANSTRAT-2377) Post-GA Improvements  
**Sub-epics:** [AAP-86671](https://issues.redhat.com/browse/AAP-86671) UI/UX Polish · [AAP-86672](https://issues.redhat.com/browse/AAP-86672) Reports & Saved Views · [AAP-86673](https://issues.redhat.com/browse/AAP-86673) Charts, Cost & ROI  
**Route:** Analytics → Automation Dashboard (GA path)  
**Label:** `DashboardPostGA` on related stories

Gamification / Post-GA feature work: see [CHANGES-Gamification.md](CHANGES-Gamification.md).

---

## Jira mapping — existing tickets

| Section | Jira | Parent epic | PR / status |
|---------|------|-------------|-------------|
| GA-1 | [AAP-85062](https://issues.redhat.com/browse/AAP-85062) Export CSV in card header | AAP-86671 | [PR #3435](https://github.com/ansible/ansible-ui/pull/3435) Review |
| GA-2 | [AAP-85053](https://issues.redhat.com/browse/AAP-85053) NumberInput + toolbar layout | AAP-86671 | Backlog — UX handoff updated Aug 2026 |
| GA-3 | [AAP-85859](https://issues.redhat.com/browse/AAP-85859) Nested KPI typography | AAP-86673 | New — comment added |
| GA-4 | [AAP-85060](https://issues.redhat.com/browse/AAP-85060) Remove success toast — toolbar + table row autosaves | AAP-86671 | Backlog — UX handoff updated |
| GA-5 | [AAP-85025](https://issues.redhat.com/browse/AAP-85025) Report actions Create/Update/Delete | AAP-86672 | [PR #3439](https://github.com/ansible/ansible-ui/pull/3439) Review |
| GA-9 | [AAP-85061](https://issues.redhat.com/browse/AAP-85061) Remove page header description | AAP-86671 | Backlog — UX handoff updated |
| GA-10 | [AAP-85051](https://issues.redhat.com/browse/AAP-85051) Disabled control tooltips | AAP-86671 | Backlog — scope unchanged |
| GA-11 | [AAP-85046](https://issues.redhat.com/browse/AAP-85046) Persist selected report on refresh | AAP-86672 | Backlog — scope unchanged |

## Jira mapping — new tickets (created Aug 2026)

| Section | Jira | Parent epic | Related |
|---------|------|-------------|---------|
| GA-6 | [AAP-87097](https://issues.redhat.com/browse/AAP-87097) Report actions — menu item descriptions | AAP-86672 | AAP-85025 |
| GA-7 | [AAP-87098](https://issues.redhat.com/browse/AAP-87098) Report actions — no icon on dropdown (decided) | AAP-86672 | AAP-85025 |
| GA-8 | [AAP-87099](https://issues.redhat.com/browse/AAP-87099) Help popover copy — PF guidelines (GA files) | AAP-86671 | AAP-85859 |

**Open decision (no separate ticket):** Checkbox vs Switch for “Include automation creation time” — tracked on [AAP-85053](https://issues.redhat.com/browse/AAP-85053).

---

## GA-1. Cost calculation — Export CSV in card header

**Jira:** [AAP-85062](https://issues.redhat.com/browse/AAP-85062) · PR [#3435](https://github.com/ansible/ansible-ui/pull/3435)  
**Prototype-only:** No

**What:** Move **Export CSV** from the Cost calculation toolbar into the `PageDashboardCard` header via `headerControls`, using `DashboardExportButton`. Toolbar holds subscription-cost fields only.

**Why:** Separates data export from inline edit controls; matches card-level action pattern used elsewhere in analytics.

**Where:** `frontend/awx/analytics/automation-dashboard/components/DashboardMainTableCard.tsx` — `PageDashboardCard` `title` + `headerControls` + reduced body top padding (`paddingBlockStart: 0`) between header and toolbar.

**Components:** `PageDashboardCard`, `DashboardExportButton` (existing).

**Acceptance criteria:**
- Export CSV appears in Cost calculation card header, not in toolbar row.
- Export behavior unchanged (same CSV payload and filename).
- Card body padding keeps toolbar visually grouped under header.

**Upstream baseline:** `origin/devel` places Export in toolbar, not header.

---

## GA-2. Cost calculation toolbar — NumberInput, grid layout, validation

**Jira:** [AAP-85053](https://issues.redhat.com/browse/AAP-85053)  
**Prototype-only:** Partial — 3-column grid and Checkbox are prototype deltas; NumberInput and `reserveErrorSpace` are the dev target.

**What:**
- Subscription-cost toolbar uses a **3-column grid** matching framework `PageFormGrid` breakpoints: `GridItem` `sm={12}`, `md={6}`, `lg={6}`, `xl={6}`, `xl2={4}`.
- **Hourly rate** and **Monthly AAP cost:** PF [`NumberInput`](https://www.patternfly.org/components/number-input/) with `FormGroup` label above, +/- steppers, existing ~600ms debounced `putRequest` to `metricsAPI` subscription_costs. Wrap each field in `Form` with `onSubmit` preventDefault (NumberInput nests a form). Pass **`reserveErrorSpace`** on both fields so helper-text row height is fixed when valid — inline validation must not shift the row.
- **Include automation creation time:** prototype uses inline **Checkbox** (label + `Help` on one line) in the third column. **`origin/devel` uses `Switch`** with a longer label — **PM/UX decision required** before dev lands (see open decision below).
- **Alignment:** grid `align-items: stretch`; checkbox column uses CSS padding to bracket label + error rows and vertically center on the **NumberInput control band only** (not label or error rows). CSS variables: `--post-ga-cost-toolbar-label-offset`, `--post-ga-cost-toolbar-error-offset`, class `.post-ga-cost-toolbar-checkbox-cell` in `postGa.css` — move to shared dashboard CSS or co-located module when landing on devel.
- **Table cells:** per-row **Time taken to manually execute** stays **`TextInput` `type="number"`** via `DashboardTableInputField` `inputVariant="textInput"` — PF guidance for dense table cells, not NumberInput.

**Why:** NumberInput matches PF form-field pattern for subscription costs; reserved error space prevents layout jump on validation; table vs toolbar input types follow PF density guidance.

**Where:**
- `frontend/awx/analytics/automation-dashboard/components/DashboardTableInputField.tsx` — `inputVariant` (`numberInput` | `textInput`), `reserveErrorSpace`
- `frontend/awx/analytics/automation-dashboard/components/DashboardTableToolbarRow.tsx` — 3-column grid + checkbox/switch column
- `frontend/awx/analytics/automation-dashboard/post-ga/postGa.css` — alignment classes (relocate on devel merge)
- `frontend/awx/analytics/automation-dashboard/types/index.ts` — `reserveErrorSpace` on props

**Components:** PF `NumberInput`, `FormGroup`, `Help`, `Grid`/`GridItem`, `Checkbox` or `Switch`, framework debounced save pattern.

**Acceptance criteria:**
- Hourly rate and monthly AAP cost use NumberInput with steppers in toolbar.
- Validation errors display inline without shifting checkbox or sibling fields (`reserveErrorSpace`).
- Debounced PUT to subscription_costs unchanged.
- Table row manual-execution time remains TextInput, not NumberInput.
- Checkbox/Switch control matches PM decision once recorded.

**Upstream baseline:** `origin/devel` — Flex row (content-width), Switch (not Checkbox), no equal 3-column grid, Export in toolbar.

**Open decision:** Checkbox (prototype) vs Switch (devel) for “Include automation creation time” — decision tracked on [AAP-85053](https://issues.redhat.com/browse/AAP-85053); no separate ticket.

---

## GA-3. Cost calculation — nested KPI typography

**Jira:** [AAP-85859](https://issues.redhat.com/browse/AAP-85859)  
**Prototype-only:** No

**What:** Four nested KPI cards inside the Cost calculation card use **section-level titles**, not full card-title level. Pass `titleVariant="section"` on nested `DashboardValueCard` / `PageDashboardCard` instances.

**Why:** Visual hierarchy — nested metrics read as sections under the Cost calculation card title, not as peer top-level cards.

**Where:**
- `frontend/awx/analytics/automation-dashboard/components/DashboardValueCard.tsx` — support `titleVariant="section"`
- `frontend/awx/analytics/automation-dashboard/components/DashboardMainTableCard.tsx` — pass `titleVariant="section"` on nested cards

**Components:** `DashboardValueCard`, `PageDashboardCard`, PF `Title` h4 lg equivalent for section titles.

**Acceptance criteria:**
- Nested cost KPI titles render at section heading level (h4 lg + Help pattern).
- Cost calculation card title remains h3 xl.
- Typography table: Card title = `Title h3 xl`; section title = `Title h4 lg` + Help.

---

## GA-4. Inline autosave — remove success toasts

**Jira:** [AAP-85060](https://issues.redhat.com/browse/AAP-85060)  
**Prototype-only:** No

**What:** Remove success toasts after successful inline saves for:
- Subscription-cost toolbar fields (hourly rate, monthly AAP cost, include-creation-time toggle)
- Per-row template metadata saves in the Cost calculation table (`DashboardMainTableCard.tsx`)

Keep **error toasts** and **refresh-failure toasts**. Field values update inline only on success.

**Why:** Frequent autosave toasts are noisy; inline update is sufficient feedback for successful saves.

**Where:**
- `frontend/awx/analytics/automation-dashboard/components/DashboardTableToolbarRow.tsx`
- `frontend/awx/analytics/automation-dashboard/components/DashboardMainTableCard.tsx`

**Acceptance criteria:**
- No success toast on subscription-cost PUT success.
- No success toast on template row metadata PUT success.
- Error and data-refresh failure toasts still appear.

---

## GA-5. Report actions — PR #3439 parity (Create / Update / Delete)

**Jira:** [AAP-85025](https://issues.redhat.com/browse/AAP-85025) · PR [#3439](https://github.com/ansible/ansible-ui/pull/3439)  
**Prototype-only:** No (dev PR owns implementation)

**What:** Match open PR #3439 — no design beyond that PR.

- **Report actions** dropdown label; sub-actions **Create new report**, **Update report**, **Delete report** (replaces Save as report / Save report / Rename report).
- **Update report** enabled on default filter state; **Create new report** disabled until filters differ from default or custom date range is invalid. Separate disabled tooltips for create vs update paths.
- **Create/Update report dialog:** titles **Create new report** / **Update report**; modal description text; submit **Create report** / **Save changes**.
- **Period filter:** `ToolbarDateRangeFilter` derives custom dates from `filterValues` (saved reports load correctly); clear end-date button; remembers custom range when switching presets. `DashboardToolbar` seeds custom start date to 7 days ago on first Custom selection.
- **`queryString`:** stricter custom date validation (start ≤ end; start ≤ today for partial range).

**Why:** Align shipping dashboard with in-flight upstream UX fixes before GA polish ships.

**Where:**
- `framework/PageToolbar/PageToolbarFilters/ToolbarDateRangeFilter.tsx`
- `frontend/awx/analytics/automation-dashboard/common/useAutomationDashboardToolbarActions.tsx`
- `frontend/awx/analytics/automation-dashboard/common/useCreateEditToolbarFilterSetDialog.tsx`
- `frontend/awx/analytics/automation-dashboard/components/DashboardToolbar.tsx`
- `frontend/awx/analytics/automation-dashboard/utils/queryString.ts`
- Matching test files

**Acceptance criteria:** Behavior matches merged #3439; prototype used as visual reference only.

---

## GA-6. Report actions — menu item descriptions

**Jira:** **[AAP-87097](https://issues.redhat.com/browse/AAP-87097)** (parent: AAP-86672) · Related: AAP-85025  
**Prototype-only:** No (if shipped)

**What:** Extend Report actions dropdown with secondary description text under Create and Update items (mirror `SelectOption` description pattern in `PageSingleSelect`):

| Menu item | Description |
|-----------|-------------|
| Create new report | Save the current filter set as a new report |
| Update report | Replace this report's saved filters with the current view |

**Delete report** has no description. **Divider** (`PageActionType.Seperator`) separates Delete from Create/Update.

Disabled **Create new report** tooltip when on default filters: **Change filters to save as a new report** (tooltip only — not duplicated in menu description).

**Why:** Clarifies Create vs Update at menu open; #3439 covers tooltips and modal copy only, not menu item descriptions.

**Where:**
- `framework/PageActions/PageAction.tsx` — optional `description` on `IPageAction`
- `framework/PageActions/PageActionDropdown.tsx` — wire to PF `DropdownItem`
- `frontend/awx/analytics/automation-dashboard/common/useAutomationDashboardToolbarActions.tsx`

**Acceptance criteria:**
- Create and Update menu items show secondary description text when enabled.
- Delete separated by divider; no description on Delete.
- Disabled create tooltip unchanged from GA-5.

---

## GA-7. Report actions — dropdown trigger icon (saved report selected)

**Jira:** **[AAP-87098](https://issues.redhat.com/browse/AAP-87098)** (parent: AAP-86672) · Related: AAP-85025  
**Prototype-only:** No — **UX decision confirmed Aug 2026: ship prototype behavior**

**What:**

| Topic | Upstream / #3439 | **Ship (prototype)** |
|-------|------------------|----------------------|
| Report actions dropdown (saved report selected) | `PlusCircleIcon` on dropdown | **No icon** — text-only **Report actions** |
| Standalone Create new report (no saved report) | — | `PlusCircleIcon` retained |

**Why:** Icon on the dropdown reads as “create only” when Update and Delete are also in the menu.

**Where:** `frontend/awx/analytics/automation-dashboard/common/useAutomationDashboardToolbarActions.tsx`

**Acceptance criteria:**
- When a saved report is selected, **Report actions** dropdown trigger has **no icon** — label text only
- When no saved report is selected, standalone **Create new report** retains `PlusCircleIcon`
- Menu behavior unchanged from AAP-85025 / PR #3439

**Note for dev:** Deliberate divergence from #3439 icon on the Report actions dropdown trigger.

---

## GA-8. Help popover copy — PatternFly content guidelines (GA files)

**Jira:** **[AAP-87099](https://issues.redhat.com/browse/AAP-87099)** (parent: AAP-86671) · Related: AAP-85859  
**Prototype-only:** No

**What:** Revise `Help` popover body text in **GA dashboard shared components** to follow [PatternFly popover content guidelines](https://www.patternfly.org/components/popover/design-guidelines): 1–3 concise sentences, full sentences with punctuation, second person (“you/your”), no title repetition, no marketing tone. Update popover body only — not labels, titles, or tooltips.

**Scope (GA / shared):**
- **Cost calculation nested KPIs:** `DashboardMainTableCard.tsx` — four nested cost KPI help strings
- **Cost toolbar:** `DashboardTableToolbarRow.tsx` — Include automation creation time help
- **GA page header** (if applicable on `AutomationDashboard.tsx`): `titleHelp` — practical 2-sentence summary

**Do not change:** Adoption level reference lists inside popovers where formatted reference content is valid per PF.

Post-GA-only help strings (Goals, Highlights, Settings) — see [CHANGES-Gamification.md](CHANGES-Gamification.md) G-8.

**Why:** Existing help text uses semicolon fragments, impersonal tone, or marketing language.

**Where:** Files listed above; framework `Help` component (`Popover` with `headerContent={title}`).

**Acceptance criteria:**
- Each scoped help string is 1–3 full sentences, second person where applicable.
- No marketing tone; no repetition of field label in body.

---

## GA-9. Page header — remove inline description

**Jira:** [AAP-85061](https://issues.redhat.com/browse/AAP-85061)  
**Prototype-only:** No

**What:** Remove the `description` prop from the GA Automation Dashboard `PageHeader`. Retain help popover (`titleHelp` / `titleHelpTitle`) for contextual guidance.

**Why:** Long inline descriptions duplicate help popover content and clutter the header.

**Where:** `frontend/awx/analytics/automation-dashboard/AutomationDashboard.tsx` (GA route)

**Acceptance criteria:**
- No description text under page title on GA dashboard.
- Help popover remains functional.

**Note:** Post-GA page shell already uses help-only header — see Gamification doc.

---

## GA-10. Disabled cost controls — auditor tooltips

**Jira:** [AAP-85051](https://issues.redhat.com/browse/AAP-85051)  
**Prototype-only:** No

**What:** When cost calculation controls are disabled for auditor (read-only) users, show tooltips explaining why controls are disabled.

**Why:** Read-only users need feedback that lack of edit access is intentional, not a bug.

**Where:** Cost calculation toolbar and table edit paths in shared dashboard components.

**Acceptance criteria:** Disabled inputs show accessible tooltip with auditor/read-only explanation per existing ticket scope.

---

## GA-11. Saved report — persist selection on refresh

**Jira:** [AAP-85046](https://issues.redhat.com/browse/AAP-85046)  
**Prototype-only:** No

**What:** Persist the selected saved report across page refresh so users return to the same report context.

**Why:** Losing report selection on refresh breaks workflow for users monitoring saved views.

**Where:** Dashboard toolbar / report filter state (per existing ticket).

**Acceptance criteria:** Selected saved report restored after browser refresh per AAP-85046 acceptance criteria.

---

## Safe to combine (when writing dev tickets)

- **AAP-85062 + AAP-85859** — same Cost calculation card (`DashboardMainTableCard.tsx`), same PR family (#3435).
- **AAP-85060 + template row save toast** — same inline-save UX pattern, two files in one small story.

## Do not combine

- **GA-2 (NumberInput)** with **Gamification Settings forms** — settings use `PageFormTextInput`, not dashboard toolbar.
- **GA-8 (help copy)** with **GA-2 (NumberInput)** — separate string pass vs component work.
- **AAP-85988 (UX prototype)** with any GA dev story — different audiences; cross-link only.
