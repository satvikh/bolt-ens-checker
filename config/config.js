export const config = {
    outputFile: "./checked_domains/10kclub.json",



    //input settings
    domainFile:"./category_lists/10kClub.csv",
    csvColumn: "Number",
    batchSize: 40,
    maxClean: true,

    // request/concurrency/retry settings
    // Maximum concurrent requests within a batch to reduce rate limiting
    perBatchConcurrency: 5,
    // Retry attempts for transient/rate-limited errors
    retryMaxAttempts: 5,
    // Initial delay before first retry (ms)
    retryInitialDelayMs: 500,
    // Exponential backoff multiplier per attempt
    retryBackoffFactor: 2,
    // Random jitter added/subtracted to backoff (ms)
    retryJitterMs: 250
};