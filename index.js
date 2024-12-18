import { ethers } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";
import { isENSSnipeable, batchIsENSSnipeable, saveDataToFile,loadExistingData } from "./boltensutils.js";



//domains = JSON.parse(fs.readFileSync("domains.json"))

const tempDomains = [];
const freeDomains = [];





for (let i = 0; i <= 9999; i++) {
    const temp= i.toString().padStart(4, '0')+ ".eth";
    tempDomains.push(temp);
}

const domains = tempDomains;
const tester = [
    'example1.eth',
    'example2.eth',
    'example3.eth',
    '0215.eth',
    'aksedhfaoiufhoirf.eth',
    '1000.eth'
    // Add more domains here
];





(async () => {
    // Example list of domains to check
    const domains = tester;

    try {
        // Call batchIsENSSnipeable to get snipeable statuses
        const results = await batchIsENSSnipeable(domains);

        // Filter snipeable domains
        const snipeableDomains = results.filter(result => result.snipeable);
        // console.log('Snipeable domains:', snipeableDomains);
        if (snipeableDomains.length > 0) {
            // Load existing data from file
            const existingData = loadExistingData() || [];

            // console.log('Existing data:', existingData);
            // Update the existing data with new snipeable domains
            snipeableDomains.forEach(domain => {
                // console.log(`Domain ${domain.domain} is snipeable.`);
                // console.log(`Grace end: ${domain.graceEnd.toISOString()}`);
                existingData.push({
                    domain: domain.domain,
                    graceEnd: domain.graceEnd.toISOString()
                });
            });

            // Save updated data back to file
            saveDataToFile(existingData);
            console.log('Updated domains.json with new snipeable domains.');
        } else {
            console.log('No snipeable domains found.');
        }
    } catch (error) {
        console.error('Error checking ENS domains:', error);
    }
})();








//batchTester
// (async () => {
//     const domains = ["9999.eth", "example.eth", "test.eth"];
//     const results = await batchIsENSSnipeable(domains);
//     console.log(results);
// })();