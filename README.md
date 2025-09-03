# Scanner Tables

## Approach

I decided to store and process everything in the **React Query cache** so that I don’t need separate state management and can rely on a single source of truth.  
To simplify access and updates, I introduced a **list of keys** and a **map of records** (`pairsMap`), which makes it easier to look up and edit individual pairs.

## Subscriptions

I implemented subscriptions only for the items currently visible to the user, and unsubscribe when they go out of view.  
Because of this, a problem appeared: if an event happens while I’m unsubscribed, that pair won’t get updated until I subscribe again and wait for the next event. I’m aware of this issue and need to think about a better solution — one simple option would be to avoid unsubscribing at all.  
There are also several other issues with subscriptions that I didn’t manage to resolve within the limited time.

## What I didn’t manage to finish in one day

- Filters are not stored in the query parameters (URL).  
- Only part of the client-side filters is implemented (e.g., by age).  
- Server-side sorting is not implemented — only client-side sorting is available.  
- I didn’t have time to take on the bonus tasks because of the tight one-day deadline.  

## What could objectively be improved

- Better design of **type contracts and overall architecture** between layers (API ↔ cache ↔ UI).  
- `scanner-filter` should be refactored and rethought: in its current form, it’s hard to extend and maintain.  
- Perform decomposition and some basic refactoring — for example, the filters are currently implemented poorly and need to be reworked.  

---

## Development notes

In development mode, there are no CORS issues because a proxy is configured in vite.config.ts.


## Test task description

The original task description can be found here:  
👉 [Test Task README](https://github.com/Guid21/fe-test/blob/master/TASK_README.md)