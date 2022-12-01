# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Love how clearly written this is, nice work!

Assumptions:

1. We will assume for now that users will still have the db table id available, and will not need to use employee id for lookup; thus we will not add a column index for `client_override_id` at this time
2. I'm assuming here that we will want backwards compatibility, (i.e., the feature is opt in, and reports will remain the same for non-participating facilities) 
   1. This will help us accommodate different customer needs, in addition to being safer to implement incrementally.
3. I'm assuming the custom ID is used for 3rd party information systems, and that when this feature is turned on, the presence of this ID should be enforced, as it may cause errors in other systems if absent
   1. Migration may be tricky-- I'm also assuming that clients will want '<NO ID>' shown if an agent is missing an ID after migration, and allowing for manual incremental migration, rather than disallowing them from migrating until every client_override_id is assigned

Tickets: 
1. Migrate database and backend ORM to accommodate client_override_id - 1-2 Day(s)
   1. Add a  column `client_override_id` to `agents`, w/ `unique` indexing. 
       1. type guuid or int depending on existing db pattern
   2. Add a column `uses_client_override_ids` column to table `facilities`
   3. Add db comments (and ORM comments) on the original ID to make it clear that it's a 'table_id'
   4. Update backend ORM to include new fields, add model validation to ensure that facilities where `uses_override_id=true`
   5. Update tests to check that new validators will prevent agent creation and update where custom_id is not present
2. Implement `PUT /facilities/toggle-custom-ids` endpoint - 1 Day
   1. We need to be able to turn custom ids on
   2. Merely flips the bool in `facilities`
   3. Endpoint test
3. Update agent creation/update endpoints to reject with proper messaging - 1 Day
   1. Send sensible error messages in REST endpoints which modify the user, and make sure they handle errors where no `client_override_id` was provided for 
   2. Unit test the message
4. Implement an endpoint to fetch users who are missing custom ids - 1 Day
   1. Should be quick, just copy the existing GET agents endpoint with an additional 'WHERE' clause
   2. Consider making another ticket to do the converse FE/BE; filter agents OUT who are missing `client_override_id`
   3. Test the endpoint to make sure it gets all users w/ missing ids and none without.
5. Send `client_override_id` where appropriate - 1 day
   1. `getShiftsByFacility` and `generateReports` should include `client_override_id` iff `facilities.uses_client_override_ids=true`
      1. We will later use this
   2. Write endpoint unit test to confirm that these are being sent
6. Update agent modification/creation forms - 2 days
   1. Existing means of updating agents will need to be augmented to handle new validation errors and conditionally show an editable ID field 
   2. Make sure to include inline validation, and to avoid showing the field if the facility toggle is not turned on
7. Feature toggle and migration pages - 1 week
   1. Create a new button item in the facilities configuration page with an obvious tooltip or proximal annotation
   2. Pressing the button should open a modal explaining the feature to users
   3. When pressed we should see a link that will bring us to a migration page, as well as an explanation that this migration page can be accessed from the facilities setting page at any time
      1. Possibly add a conditionally rendered link to the migration page from the agent management table if such a thing exists
   4. Migration page
      1. Show all users without custom ids and allow ids to be quickly updated inline
   1. Show a badge on the settings page to let admins know that they have users without ids 
   1. Include e2e tests to ensure that this entire flow works
8. Present existing reports with custom ids - 3 days
   1. I'm putting both reports in the same ticket so that whoever is designing it can make sure the pattern they design is appropriate for all FE usecases. 
   2. Make a custom function `GetReportDisplayID(Model)` (part of a FE model if such a thing exists, or just a typesafe/ducktyped method)
      1. This function will use `client_override_id` if it is sent (see assumption 3), otherwise it will use `table_id`
   3. Replace all instances where we display the model id with `GetReportDisplayID(Model)`
   4. IMPORTANT: Please pull in all relevant FE team on PR to make sure we aren't missing anywhere else in the app where agent ID may be shown

- Ticket 1 must be completed first
- Tickets (2, 3, 4, 5) depend on ticket 1. They can be parallelized to be worked on by different engineers, but 4 should be given priority as it blocks ticket 5
- 6 depends on 3, 7 depends on 4, 8 depends on 5
  - Thus, prioritize 1->4->7, since it's the most likely to be critical path/delay release.
