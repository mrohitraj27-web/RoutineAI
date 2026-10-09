# RoutineAI — Workflow Intelligence

A responsive React dashboard prototype for exploring agent workflow analysis, optimization previews, and safety review. All workflow metrics, chart values, validation results, and history entries are simulated examples. There is no connected AI agent, live execution, or measured accuracy.

## Run in VS Code

1. Open this project folder in VS Code.
2. In the integrated terminal, run `npm install` to install the dependencies already declared in `package.json`.
3. Run `npm run dev`.
4. Open the URL printed by Vite. It opens `/dashboard.html`; this keeps the existing standalone `index.html` prototype intact.

To create a production build, run `npm run build`. The React dashboard is emitted from `dashboard.html`.

## Dashboard features

- Dashboard with sample task, tool-call, efficiency, time, and validation metrics.
- Workflow analyzer with a task form, simulated workflow map, loading state, and input validation.
- Optimization comparison charts with sample before-and-after estimates.
- Searchable and filterable sample history table with CSV export.
- Safety and accuracy disclosures, review guidance, and expandable validation details.
- Interactive threshold and safety-policy settings, plus responsive mobile navigation.

Icons and charts use inline SVG, React, and CSS. No additional UI or chart packages are required.
