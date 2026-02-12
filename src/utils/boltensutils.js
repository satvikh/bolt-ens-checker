import { ethers, keccak256 } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import { config } from '../../config/config.js';
import { start } from "repl";
import { parse } from "csv-parse";

// Load environment variables from .env file
dotenv.config(); 


//setting up alchemy
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const provider =new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/" + settings.apiKey);

const ALCHEMY_API_URL= "https://eth-mainnet.g.alchemy.com/v2/" + settings.apiKey;

// ENS Registrar contract address and ABI
const ENS_REGISTRAR_ADDRESS = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
const ENS_REGISTRAR_ABI = [
    {
        "constant": true,
        "inputs": [{ "name": "id", "type": "uint256" }],
        "name": "nameExpires",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const registrar = new ethers.Contract(ENS_REGISTRAR_ADDRESS, ENS_REGISTRAR_ABI, provider);
const outputFile = config.outputFile;

// Function to get column values from a CSV file
export const getCsvColumnValues = (filePath, columnName) => {
    return new Promise((resolve, reject) => {
        const values = [];

        // Create a readable stream for the CSV file
        const parser = fs.createReadStream(filePath).pipe(
            parse({
                columns: true, // Parse header row
                trim: true,    // Trim whitespace
            })
        );

        parser.on('data', (row) => {
            if (row[columnName] !== undefined) {
                values.push(row[columnName]);
            }
        });

        parser.on('end', () => resolve(values));
        parser.on('error', (error) => reject(error));
    });
};



// Function to save data to the JSON file
export const saveDataToFile = (data) => {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
};




// Function to load existing data from the JSON file
export function loadExistingData() {
    try {
        const data = fs.readFileSync(config.outputFile, "utf-8");
        return JSON.parse(data) || []; // Return an empty array if the file contains invalid JSON
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return an empty array
            return [];
        }
        throw error; // Re-throw other errors
    }
}


// Function to convert a UTF-8 string to a Keccak-256 hash
const utf8ToKeccak = (utf8String) => {
    // console.log(ethers);
    
    const bytes = ethers.toUtf8Bytes(utf8String); // Convert UTF-8 string to bytes
    const keccakHash = ethers.keccak256(bytes);  // Compute Keccak-256 hash
    return keccakHash;
};


// Async function to check expiration
export async function isENSSnipeable(domain) {
    try {
        
        const today = new Date();
        const label = domain.endsWith('.eth') ? domain.slice(0, -4) : domain;
        const keccakLabel= utf8ToKeccak(label);
        const expirationTimestamp = await registrar.nameExpires(keccakLabel);
        const expirationDate = new Date(Number(expirationTimestamp) * 1000);
        const graceEnd = new Date(expirationDate);
        graceEnd.setDate(graceEnd.getDate() + 90);
        const snipeable= today > graceEnd;
        // const expired = expirationDate < today;
        // Return the results
        return {
            domain,
            // isExpired,
            // expirationDate: expirationDate.toISOString(),
            ////Test Functions
            // processedLabel,
            expirationDate,
            graceEnd,
            snipeable,
            price: (netRegPrice(label,graceEnd)),
            //processedLabel,
            // expired
        };
    } catch (error) {
        console.error(`Error checking ENS domain (${domain}):`, error);
        return { domain, error: "Failed to check expiration" };
    }
}




export async function batchIsENSSnipeable(domains) {
    try {
        // Validate input
        if (!Array.isArray(domains) || domains.length === 0) {
            throw new Error("Invalid input: 'domains' must be a non-empty array.");
        }

        const today = new Date();

        // Utility to introduce a delay
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const processBatch = async (batch) => {
            // Construct batch requests
            const requests = batch.map((domain) => {
                const label = domain.endsWith(".eth") ? domain.slice(0, -4) : domain;
                const keccakLabel = utf8ToKeccak(label);
                return { domain, keccakLabel };
            });

            // Fetch expiration timestamps in parallel
            const responses = await Promise.all(
                requests.map(async (req) => {
                    try {
                        const expirationTimestamp = await registrar.nameExpires(req.keccakLabel);
                        return { domain: req.domain, expirationTimestamp };
                    } catch (error) {
                        console.error(`Error fetching expiration for ${req.domain}:`, error);
                        return { domain: req.domain, error: "Failed to fetch expiration" };
                    }
                })
            );

            // Process responses
            return responses.map((res) => {
                if (res.error) {
                    return { domain: res.domain, error: res.error };
                }

                try {
                    const expirationDate = new Date(Number(res.expirationTimestamp) * 1000);
                    const graceEnd = new Date(expirationDate);
                    graceEnd.setDate(graceEnd.getDate() + 90);
                    const snipeable = today > graceEnd;

                    return {
                        domain: res.domain,
                        expirationDate,
                        graceEnd,
                        snipeable,
                        price: netRegPrice(res.domain, graceEnd),
                    };
                } catch (error) {
                    console.error(`Error processing response for ${res.domain}:`, error);
                    return { domain: res.domain, error: "Processing error" };
                }
            });
        };

        // Split domains into batches of x
        const batchSize = config.batchSize;
        const batches = [];
        for (let i = 0; i < domains.length; i += batchSize) {
            batches.push(domains.slice(i, i + batchSize));
        }

        // Process each batch sequentially with a 1-second timeout
        let results = [];
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const batchResults = await processBatch(batch);
            results = results.concat(batchResults);

            // Log completed batch information
            const startIdx = i * batchSize + 1;
            const endIdx = Math.min((i + 1) * batchSize, domains.length);
            console.log(`Completed batch ${i + 1}/${batches.length} — processed domains ${startIdx}-${endIdx} (${batch.length} in this batch)`);
            console.log('Batch domains:', batch);
            // Introduce a configurable timeout
            await delay(config.batchDelayMs || 1000);
        }

        return results;
    } catch (error) {
        console.error("Error in batchIsENSSnipeable:", error);
        throw new Error("Failed to process ENS domains.");
    }
}

    


export function premiumPrice(graceEnd) {
    const PREMIUM_PERIOD_DAYS = 21;
    const START_PRICE = 100000000;
    
    const now = new Date();
    const graceEndDate = new Date(graceEnd);

    const timeDifference = now - graceEndDate;

    // If the grace period has not ended, there is no premium.
    if (timeDifference < 0) {
        return -1000000; // Using a large negative number to indicate not available.
    }

    const daysPassed = timeDifference / (1000 * 60 * 60 * 24);

    // If the 21-day premium period is over, the premium is $0.
    if (daysPassed > PREMIUM_PERIOD_DAYS) {
        return 0;
    }

    // Calculate the premium price using the exponential decay formula.
    const premium = START_PRICE * (0.5) ** daysPassed;

    return premium;
}

export function regPrice(domain, days=30){
    const length = domain.length-4;
    let price=0;
    switch (true) {
        case length >= 5:
            price = 5/365;
            break;
        case length === 4:
            price = 160/365;
            break;
        case length <= 3:
            price = 640/365;
            break;

    }
    return price*days;
}


export function netRegPrice(domain, graceEnd) {
    const netprice=premiumPrice(graceEnd)+regPrice(domain);
    return netprice;
}

export function calculateDateForPrice(graceEnd, targetPrice) {
    const PREMIUM_PERIOD_DAYS = 21;
    const START_PRICE = 100000000;
    const graceEndDate = new Date(graceEnd);

    // If target price is higher than start price, it's available at that price once the grace period ends.
    if (targetPrice >= START_PRICE) {
        return graceEndDate;
    }
    
    // Date when the 21-day premium period ends.
    const premiumEndDate = new Date(graceEndDate.getTime());
    premiumEndDate.setTime(premiumEndDate.getTime() + (PREMIUM_PERIOD_DAYS * 24 * 60 * 60 * 1000));

    // If target price is $0, it will be available when the premium period ends.
    if (targetPrice <= 0) {
        return premiumEndDate;
    }

    // Calculate how many days it takes for the price to drop to the target.
    // targetPrice = START_PRICE * (0.5) ^ daysPassed
    const daysPassed = Math.log(targetPrice / START_PRICE) / Math.log(0.5);

    // If the calculated time is beyond the 21-day premium period, 
    // the name will become available at its base registration fee at the end of the 21 days.
    if (daysPassed > PREMIUM_PERIOD_DAYS) {
        return premiumEndDate;
    }

    // Calculate the exact future date when the price will hit the target.
    const futureDate = new Date(graceEndDate.getTime());
    futureDate.setTime(futureDate.getTime() + (daysPassed * 24 * 60 * 60 * 1000));

    return futureDate;
}



// convertToEth = async (usd) => {
//     const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`);
//     const data = await response.json();
//     const ethPrice = data.ethereum.usd;
//     return usd / ethPrice;
// }