import { ethers } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";
import { isENSExpired } from "./boltensutils.js";



//domains = JSON.parse(fs.readFileSync("domains.json"))

const tempDomains = [];
const freeDomains = [];





for (let i = 0; i <= 9999; i++) {
    const temp= i.toString().padStart(4, '0')+ ".eth";
    tempDomains.push(temp);
}

const domains = tempDomains;
(async () => {
    const result= await isENSExpired("9999.eth");
    console.log(result);
})();

// (async () => {


//     for (const domain of domains) {
//         const result = await isENSExpired(domain);

//         if (result.error) {
//             continue;
//         }

//         if (result.isExpired) {
//             console.log(`Domain expired: ${result.domain}`);
//             freeDomains.push(result.domain);
//         }
//     }

//     console.log("Free domains:", freeDomains);
// })();



