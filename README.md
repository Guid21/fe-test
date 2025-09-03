Scanner Tables

Approach

I decided to store and process everything in the React Query cache so that I don’t need separate state management and can rely on a single source of truth.
To simplify access and updates, I introduced a list of keys and a map of records (pairsMap), which makes it easier to look up and edit individual pairs.

What I didn’t manage to finish in one day
	•	Filters are not stored in the query parameters (URL).
	•	Only part of the client-side filters is implemented (e.g., by age).
	•	Server-side sorting is not implemented — only client-side sorting is available.

What could objectively be improved
	•	Better design of type contracts and overall architecture between layers (API ↔ cache ↔ UI).
	•	scanner-filter should be refactored and rethought: in its current form, it’s hard to extend and maintain.
	•	Perform decomposition and some basic refactoring — for example, the filters are currently implemented poorly and need to be reworked.