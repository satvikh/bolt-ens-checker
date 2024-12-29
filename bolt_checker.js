import { ethers } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";
import { isENSSnipeable, batchIsENSSnipeable, saveDataToFile, loadExistingData, getCsvColumnValues } from "./boltensutils.js";
import { config } from "./config.js";

const tester = [
    'example1',
    'example2',
    'example3',
    '0215',
    'aksedhfaoiufhoirf',
    '1000',
    'AAAA',
    'aaaa',
    'mr.mime',
    'Mister..Mime',
    "1241..dfiAjo,"
    // Add more domains here
];

const main = async () => {
    try {

        
        // Step 1: Load domains from CSV file
        console.log("Step 1: Loading domains from CSV...");
        const csvColumn = config.csvColumn; // Replace with your column name
        const filePath = config.domainFile; // Replace with your CSV file path
        let tempDomains = await getCsvColumnValues(filePath, csvColumn);

        // //TEST ONLY
        // tempDomains=tester;

        let cleanedDomains=[];
        if(config.maxClean==true){
            cleanedDomains = tempDomains
            .map(value => value.toLowerCase()) // Convert to lowercase
            .map(value => value.replace(/[^a-z0-9]/g, '')) // Remove special characters and spaces
            .map(value => `${value}.eth`); // Append `.eth`
        } else {
            cleanedDomains = tempDomains.map(value => `${value.toLowerCase()}.eth`);
        }
        
        console.log("Loaded and cleaned domains:", cleanedDomains);


        // // TEST ONLY
        // cleanedDomains= tester;

        // Step 2: Check ENS domains for snipeability
        console.log("Step 2: Checking snipeability of test domains...");
        const results = await batchIsENSSnipeable(cleanedDomains);
        // console.log("Snipeability results:", results);

        // Step 3: Filter snipeable domains
        const snipeableDomains = results.filter(result => result.snipeable);
        if (snipeableDomains.length > 0) {
            console.log("Step 3: Filtering snipeable domains...");
            const existingData = loadExistingData() || [];
            // console.log("Loaded existing data:", existingData);

            // Step 4: Update and save snipeable domains
            console.log("Step 4: Updating and saving snipeable domains...");
            snipeableDomains.forEach(domain => {
                existingData.push({
                    domain: domain.domain,
                    graceEnd: domain.graceEnd.toISOString(),
                    price: domain.price
                });
            });

            saveDataToFile(existingData);
            console.log("Updated domains.json with new snipeable domains.");
        } else {
            console.log("No snipeable domains found.");
        }

    //     // ________________TEST ONLY____________________
    //     console.log("Testing specific domains...");
    //     const batchResults = await batchIsENSSnipeable(["9999.eth", "example.eth", "test.eth"]);
    //     console.log("Batch results:", batchResults);

    //     console.log("Process completed sequentially!");

    //     //______________________________________________________

    } catch (error) {
        console.error("Error during sequential execution:", error);
    }
};

// Execute the sequential process
main();









//batchTester
// (async () => {
//     const domains = ["9999.eth", "example.eth", "test.eth"];
//     const results = await batchIsENSSnipeable(domains);
//     console.log(results);
// })();