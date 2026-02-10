// cache.h
struct Cache;
struct Key;
struct Value;

/**
 * If entry is missing or stale, may enqueue an async refresh.
 * Refresh can perform network I/O and may take locks internally.
 */
bool cache_get(Cache* c, const Key& k, Value* out);
