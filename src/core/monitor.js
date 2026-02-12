import TinyQueue from 'tinyqueue';
import { getCsvColumnValues, batchIsENSSnipeable, calculateDateForPrice, netRegPrice } from '../utils/boltensutils.js';
import { config } from '../../config/config.js';

let monitorInterval = null;
let isRunning = false;
<<<<<<< HEAD
=======
let allAvailableDomains = []; // Store all domains that are past grace period
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)

// Min-heap to store domains, prioritized by the next time to check their price.
const domainHeap = new TinyQueue([], (a, b) => a.checkAt - b.checkAt);

const processHeap = () => {
    const now = new Date();
    while (domainHeap.length > 0 && domainHeap.peek().checkAt <= now) {
        const domainInfo = domainHeap.pop();
        const currentPrice = netRegPrice(domainInfo.domain, domainInfo.graceEnd);

        console.log(
<<<<<<< HEAD
            `
---------------------------------
` +
            `Domain Available: ${domainInfo.domain}
` +
            `---------------------------------
` +
            `Registration Price: ~$${currentPrice.toFixed(2)} USD
` +
            `Target price was: $${config.autocheck.priceThreshold} USD.` +
            `
---------------------------------
`
=======
            `\n---------------------------------\n` +
            `Domain Available: ${domainInfo.domain}\n` +
            `---------------------------------\n` +
            `Registration Price: ~$${currentPrice.toFixed(2)} USD\n` +
            `Target price was: $${config.autocheck.priceThreshold} USD.` +
            `\n---------------------------------\n`
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
        );
    }
};

<<<<<<< HEAD
=======
const repopulateHeap = () => {
    // Clear the existing heap by popping all items
    while (domainHeap.length) {
        domainHeap.pop();
    }

    const priceThreshold = config.autocheck.priceThreshold;

    for (const domain of allAvailableDomains) {
        if (domain.price > priceThreshold) {
            const checkAt = calculateDateForPrice(domain.graceEnd, priceThreshold);
            domainHeap.push({
                domain: domain.domain,
                graceEnd: domain.graceEnd,
                checkAt: checkAt,
            });
        }
    }
    console.log(`Heap repopulated. ${domainHeap.length} domains are now scheduled for monitoring.`);
};

>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
export const initialize = async () => {
    try {
        console.log("Initializing monitor...");
        const csvColumn = config.csvColumn;
        const filePath = config.domainFile;
        let tempDomains = await getCsvColumnValues(filePath, csvColumn);

        let cleanedDomains = tempDomains.map(value => `${value.toLowerCase()}.eth`);
<<<<<<< HEAD
        
=======
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
        console.log(`Loaded ${cleanedDomains.length} domains from ${filePath}.`);

        console.log("Fetching initial domain data (this may take a while)...");
        const initialDomainData = await batchIsENSSnipeable(cleanedDomains);
        
<<<<<<< HEAD
        const availableDomains = initialDomainData.filter(d => d.snipeable && !d.error);
        console.log(`Found ${availableDomains.length} domains that are past the grace period.`);

        const priceThreshold = config.autocheck.priceThreshold;

        for (const domain of availableDomains) {
            if (domain.price <= priceThreshold) {
                console.log(
                    `
---------------------------------
` +
                    `Domain Available: ${domain.domain}
` +
                    `---------------------------------
` +
                    `Registration Price: ~$${domain.price.toFixed(2)} USD
` +
                    `Target price was: $${config.autocheck.priceThreshold} USD.` +
                    `
---------------------------------
`
                );
            } else {
                const checkAt = calculateDateForPrice(domain.graceEnd, priceThreshold);
                domainHeap.push({
                    domain: domain.domain,
                    graceEnd: domain.graceEnd,
                    checkAt: checkAt,
                });
            }
        }
        console.log(`Initialization complete. ${domainHeap.length} domains are scheduled for monitoring.`);
=======
        allAvailableDomains = initialDomainData.filter(d => d.snipeable && !d.error);
        console.log(`Found ${allAvailableDomains.length} domains that are past the grace period.`);
        
        repopulateHeap(); // Initial population of the heap
        
        console.log(`Initialization complete.`);
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
        return true;
    } catch (error) {
        console.error("Error during initialization:", error);
        return false;
    }
};

export const start = () => {
    if (isRunning) {
        console.log("Monitor is already running.");
        return;
    }
    console.log("Starting monitor...");
<<<<<<< HEAD
    monitorInterval = setInterval(processHeap, 1000);
    isRunning = true;
    console.log("Monitor started.");
=======
    // Use the value from config, with a fallback
    const interval = config.autocheck.interval || 60000;
    monitorInterval = setInterval(processHeap, interval);
    isRunning = true;
    console.log(`Monitor started. Checking every ${interval / 1000} seconds.`);
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
};

export const stop = () => {
    if (!isRunning) {
        console.log("Monitor is not running.");
        return;
    }
    console.log("Stopping monitor...");
    clearInterval(monitorInterval);
<<<<<<< HEAD
=======
    monitorInterval = null;
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
    isRunning = false;
    console.log("Monitor stopped.");
};

export const getStatus = () => {
    if (!isRunning) {
        console.log("Monitor is currently stopped.");
    } else {
<<<<<<< HEAD
        console.log("Monitor is running.");
    }
    
=======
        console.log(`Monitor is running. Checking every ${config.autocheck.interval / 1000} seconds.`);
    }
    
    console.log(`Price Threshold: $${config.autocheck.priceThreshold}`);
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
    console.log(`Domains in monitoring queue: ${domainHeap.length}`);
    
    if (domainHeap.length > 0) {
        const nextDomain = domainHeap.peek();
        console.log(`Next check: ${nextDomain.domain} at ${nextDomain.checkAt.toLocaleString()}`);
    } else {
        console.log("No domains in the monitoring queue.");
    }
};
<<<<<<< HEAD
=======

export const listDomains = () => {
    if (domainHeap.length === 0) {
        return "No domains currently in the monitoring queue.";
    }
    // Sort by checkAt date before displaying
    const sortedDomains = [...domainHeap.data].sort((a,b) => a.checkAt - b.checkAt);

    let list = "Domains in monitoring queue:\n";
    sortedDomains.forEach((d, index) => {
        const currentPrice = netRegPrice(d.domain, d.graceEnd);
        list += `  ${index + 1}. ${d.domain} | Current Price: ~$${currentPrice.toFixed(2)} | (Check at: ${d.checkAt.toLocaleString()})\n`;
    });
    return list;
};

export const setThreshold = (price) => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) {
        console.log("Invalid price. Please provide a non-negative number.");
        return;
    }
    config.autocheck.priceThreshold = newPrice;
    console.log(`Price threshold set to: $${newPrice}.`);
    console.log("Recalculating domain check times...");
    repopulateHeap();
};

export const setIntervalValue = (ms) => {
    const newInterval = parseInt(ms, 10);
    if (isNaN(newInterval) || newInterval < 1000) {
        console.log("Invalid interval. Please provide a number in milliseconds (>= 1000).");
        return;
    }
    config.autocheck.interval = newInterval;
    console.log(`Check interval set to ${newInterval / 1000} seconds.`);
    if (isRunning) {
        console.log("Restarting monitor to apply new interval...");
        stop();
        start();
    }
};
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
