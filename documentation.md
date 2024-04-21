## Note entity
1. collection - Notes
2. model and Schema - Note
3. API routing


## REST and api structure

`/trips`
GET: get all trips belonged to user
POST: create new trip

`/trips/[tripId]`
GET: Get one trip
PUT: Update trip - high level props , Add(create) new section
DELETE: Delete trip

`/trips/[tripId]/[sectionId]`
PUT: Update one section; Add note ID to particular section

`/notes`
POST: Create new section -> PUT `/trips/[tripId]/[sectionId]` update section by adding note ID

`/notes/[id]`
GET: get Note
PUT: update note



## Point (start/end)
- Place
  - name,  // text input
  - address, // Autocomplete suggestions, external API - Google, etc
  - coordinates ???
- Date (departure/arrival) // Datepicker
- Time // Timepicker
- Timezone // Autocomplete
