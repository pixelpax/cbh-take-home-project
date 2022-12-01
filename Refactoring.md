# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here


- The biggest thing was just that the branching logic was messy, I like to situational narrowing by using return statements as soon as possible.
  - The most contingent logic was around explicitly specified partitioning keys, so that's where I kept it-- everywhere else could be greatly simplified
  - For example, checking length and stringifying input without partitionKey is redundant, since it would've been hashed and stringified already anyways
- Because of the above, 'candidate' was holding onto values that could've been immediately returned, rather than having to weave through several conditional branches on reading
  - I'm generally a fan of avoiding indirection where possible, i.e. just say "input.partitionKey" a few times, rather than creating an alias (unless naming it adds semantic clarity)
- I'm not sure what 'event' or 'candidate' meant here, but since this is a pretty generalizable algorithm, we're going to use more general names (e.g. 'input') 
- Encapsulate stringifying and hashing
  - I'm pretty sure JSON.stringify isn't idempotent, but I couldn't remember. Just to be sure, I wrapped it
