function addScrapingJob(url, priority = 'normal') {
    scrapeQueue.add(
        { url },
        {
            priority: priority === 'high' ? 1 : priority === 'low' ? 3 : 2, // Bull uses 1 for highest priority
            attempts: 3, // Number of attempts to try the job before failing
            backoff: {
                type: 'fixed',
                delay: 1000, // Delay in ms between attempts
            },
        }
    );
}

// Example usage:
addScrapingJob('http://example.com', 'high');
