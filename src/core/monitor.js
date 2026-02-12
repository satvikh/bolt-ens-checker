import TinyQueue from 'tinyqueue';
import { getCsvColumnValues, batchIsENSSnipeable, calculateDateForPrice, netRegPrice } from '../utils/boltensutils.js';
import { config } from '../../config/config.js';

let monitorInterval = null;
let isRunning = false;

// Min-heap to store domains, prioritized by the next time to check their price.
const domainHeap = new TinyQueue([], (a, b) => a.checkAt - b.checkAt);

const processHeap = () => {
    const now = new Date();
    while (domainHeap.length > 0 && domainHeap.peek().checkAt <= now) {
        const domainInfo = domainHeap.pop();
        const currentPrice = netRegPrice(domainInfo.domain, domainInfo.graceEnd);

        console.log(
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
        );
    }
};

export const initialize = async () => {
    try {
        console.log("Initializing monitor...");
        const csvColumn = config.csvColumn;
        const filePath = config.domainFile;
        let tempDomains = await getCsvColumnValues(filePath, csvColumn);

        let cleanedDomains = tempDomains.map(value => `${value.toLowerCase()}.eth`);
        
        console.log(`Loaded ${cleanedDomains.length} domains from ${filePath}.`);

        console.log("Fetching initial domain data (this may take a while)...");
        const initialDomainData = await batchIsENSSnipeable(cleanedDomains);
        
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
    monitorInterval = setInterval(processHeap, 1000);
    isRunning = true;
    console.log("Monitor started.");
};

export const stop = () => {
    if (!isRunning) {
        console.log("Monitor is not running.");
        return;
    }
    console.log("Stopping monitor...");
    clearInterval(monitorInterval);
    isRunning = false;
    console.log("Monitor stopped.");
};

export const getStatus = () => {
    if (!isRunning) {
        console.log("Monitor is currently stopped.");
    } else {
        console.log("Monitor is running.");
    }
    
    console.log(`Domains in monitoring queue: ${domainHeap.length}`);
    
    if (domainHeap.length > 0) {
        const nextDomain = domainHeap.peek();
        console.log(`Next check: ${nextDomain.domain} at ${nextDomain.checkAt.toLocaleString()}`);
    } else {
        console.log("No domains in the monitoring queue.");
    }
};
