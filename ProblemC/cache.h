// cache.h
/*
Task:
Generate documentation for cache_get that is helpful for API consumers (callers), especially around side effects and safety.
*/
struct Cache;
struct Key;
struct Value;

/**
 * @brief Retrieves the cached value associated with the specified key.
 * Contract:
 * - May perform network I/O if the entry is missing or stale and requires refresh.
 * - May enqueue background work for asynchronous refresh operations.
 * - May take locks internally to ensure thread safety during access.
 */
bool cache_get(Cache* c, const Key& k, Value* out);
