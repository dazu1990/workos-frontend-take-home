# Assessment Notes

## How to install + run 
note : first set up the server. Follow instructions on `../server/README.md`
1. `npm install`
2. `npm run dev`

## What I would do with more time

- Aquire the missing font - The Figma file has the font labeled as "untitledfont" so I would request the font to import from design
- Set up tests for hooks and components
- further refactor and componentize shared UI elements like 
  - bottom pagination row
  - Search bar
  - Actions button
  - Edit Dialog
  - reconsider folder structure
- further familiarize myself with Radix (my first time using it, and quite a bit of time was spent reading docs)
  - the edit Dialog should use the Form
- Move the cache clearing from the component to the hook.
- implement edit users on user row table actions. The same actions should be available to both tables
- allow editing of role description (currently commented out)
- Pagination implementation

note: I opted to mostly work on the main branch for the purposes of time and the assignment but in production I would have done individual PRs and branchs for each feature requirement