// import { ethers } from "ethers";
// import { Network, Alchemy } from 'alchemy-sdk';
// import fs from "fs";
// import dotenv from "dotenv";
// import { isENSSnipeable, batchIsENSSnipeable } from "./boltensutils.js";
// import config from "./config.js";


// //domains = JSON.parse(fs.readFileSync("domains.json"))

// const tempDomains = [];
// const freeDomains = [];





// for (let i = 0; i <= 9999; i++) {
//     const temp= i.toString().padStart(4, '0')+ ".eth";
//     tempDomains.push(temp);
// }

// const domains = tempDomains;


// (async () => {


//     for (const domain of domains) {
//         const result = await isENSSnipeable(domain);

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







// // tester
// (async () => {
//     const result= await isENSSnipeable("9999.eth");
//     console.log(result);

//     const result2= await isENSSnipeable("0215.eth");
//     console.log(result2);
// })();

//batchTester
// (async () => {
//     const domains = ["9999.eth", "example.eth", "test.eth"];
//     const results = await batchIsENSSnipeable(domains);
//     console.log(results);
// })();