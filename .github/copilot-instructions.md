# Repository instructions

## Build, lint, and test

- Use the Node version in `.nvmrc` (15.14.0); `package.json` requires Node 15 or newer.
- Install dependencies with `npm install`.
- Create `.env` from `.env.example` and configure the API endpoint, API version, and Mapbox token. `VUE_APP_END_YEAR` is also required by `scripts/process-config.js`.
- `npm run dev` processes configuration, runs both linters, and starts the Vue CLI server on port 3000.
- `npm run build` processes configuration and builds the production app.
- `npm run lint` runs JavaScript/Vue linting and SCSS linting. To lint one file, use `npx vue-cli-service lint --no-fix src/components/SomeComponent/SomeComponent.vue` or `npx stylelint src/components/SomeComponent/SomeComponent.scss`.
- `npm run fix` runs the configured auto-fixers; `npm run fix:js` and `npm run fix:scss` run them separately.
- There is no test script or test runner configured in `package.json`.

## Architecture

This is a Vue 2 single-page application. `src/main.js` registers the router, Vuex store, Vuetify, and plugins; `src/App.vue` hosts the shared map shell, while `src/views/Home.vue` composes the data/filter panels, location details, exports, and chart dialogs around the map.

The application state is split into namespaced Vuex modules in `src/store/modules`: `filters` holds the selected map type, particle, time, and geographic filters; `locations` loads FEWS locations and derives their relations; `layers` selects and transforms configured service data into Mapbox layers and legends; and `charts` fetches and prepares chart data. Components dispatch module actions and consume module state/getters. API requests use the shared Axios instance in `src/plugins/axios.js`; reusable data and GeoJSON transformations live in `src/lib`.

`src/config/services.template.json` is the central configuration for map types, particles, services, layers, legends, and chart request parameters. The layers and chart modules interpret its IDs and chart keys, so keep those names and data shapes consistent with their consumers. Edit the template, not generated `services.json`; `scripts/process-config.js` replaces environment placeholders and generates `services.json`, `reports.json`, and `timespan.json` before `npm run dev` or `npm run build`. These generated files are ignored by Git. See `src/config/SERVICES_TEMPLATE_README.md` for the service and chart schema.

## Code conventions

- Vue components are Vue 2 single-file components using the Options API. Keep shared selection and data-fetching state in the existing namespaced Vuex modules rather than duplicating it across views.
- Use the `~` alias for imports from `src` (configured in `vue.config.js`); existing code also uses `@` for `src`.
- Keep service-specific map/chart behavior data-driven in `services.template.json`; when changing a config key or shape, update the corresponding consumers in `src/store/modules/layers` or `src/store/modules/charts`.
- JavaScript/Vue formatting and rules are defined in `.eslintrc.js` (including single quotes and no semicolons); SCSS rules and property ordering are defined in `.stylelintrc`.


## General Editing Philosophy

- Make the smallest possible change that satisfies the request.
- Prefer modifying existing code over introducing new abstractions.
- Preserve the project's existing coding style and architecture.
- Do not perform unrelated refactoring.
- Do not rename files, modules, classes or functions unless explicitly requested.
- Reuse existing utilities, helper functions and patterns whenever possible.
- If multiple implementations already exist, follow the established project convention rather than introducing a new one.


## Explanation and Code Change Communication

### 1. Explain Planned Changes Before Implementation

Whenever a prompt explicitly asks for a plan, or a task involves significant changes to the codebase, explain the intended changes before implementing them.

Before making significant changes, include the following:

1. **Summary:** Explain the proposed approach and the problem it solves.
2. **Planned codebase changes:** List the files, modules, components, or services that will be created, modified, or removed.
3. **Changes per file:** Explain what will change in each relevant file and why.
4. **Architecture and dependencies:** Describe any changes to data flow, interfaces, APIs, dependencies, database schemas, or interactions between components.
5. **Implementation steps:** Present the order in which the changes will be made.
6. **Assumptions and risks:** Highlight important assumptions, potential breaking changes, and decisions that may need confirmation.
7. **Codebase:** Show codebase that will be affected by the planned changes, including relevant snippets and context.

Use a table for planned changes whenever multiple files or components are involved.

Example:

| File / component | Planned change | Reason |
|---|---|---|
| `src/api/client.py` | Add a reusable API client | Centralize HTTP requests |
| `src/services/data.py` | Replace direct HTTP calls with the client | Avoid duplicated logic |
| `tests/test_data.py` | Add tests for success and error responses | Verify the new behavior |

For large tasks, include a proposed file tree when it helps explain the new structure.

Do not list files that have not been identified or reasonably inferred from the repository. Mark uncertain file paths or implementation details as tentative.

For explicitly requested plans, present the plan without implementing it unless implementation is also requested.

For other tasks, provide a concise plan before implementation when the changes are substantial. For small, localized changes, proceed directly without unnecessary planning.

If implementation reveals that the original plan needs to change, explain the important deviation and why it is necessary.

### 2. Explain How Code Works Using Actual Code

Whenever I ask questions such as "How does this work?", "Please explain how this works", or "Walk me through this implementation", include relevant code snippets as part of the explanation.

Do not rely exclusively on conceptual descriptions, analogies, or bullet points. Connect the explanation directly to the actual implementation in the repository whenever the relevant source code is available.

Follow this structure where appropriate:

1. **Overview:** Explain the purpose of the component or mechanism.
2. **Relevant code:** Show the actual code responsible for the behavior, using syntax-highlighted Markdown code blocks.
3. **Step-by-step walkthrough:** Explain what the code does, in execution order.
4. **Data flow and interactions:** Show how data moves between functions, modules, services, or components.
5. **Concrete example:** Demonstrate the behavior with a small input/output example or execution scenario when useful.
6. **Key takeaways:** Summarize the most important concepts.

Use the following conventions:

- Include the relevant file path above each code snippet.
- Show the smallest useful code excerpt that explains the behavior.
- Explain important lines, function calls, parameters, return values, and control flow.
- Use actual repository code when available rather than inventing a simplified implementation.
- If the actual code is too long, extract the relevant portions