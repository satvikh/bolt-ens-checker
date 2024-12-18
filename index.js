import { ethers } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";
import { isENSExpired } from "./utils.js";


// Load environment variables from .env file
dotenv.config();  

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};


const alchemy = new Alchemy(settings);

//load ens domain names on the list

//domains = JSON.parse(fs.readFileSync("domains.json"))

const tempDomains = [];
const freeDomains = [];
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
    },
    {
        "constant": true,
        "inputs": [{ "name": "id", "type": "uint256" }],
        "name": "available",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const registrar = new ethers.Contract(ENS_REGISTRAR_ADDRESS, ENS_REGISTRAR_ABI, alchemy);


for (let i = 0; i <= 9999; i++) {
    const temp= i.toString().padStart(4, '0')+ ".eth";
    tempDomains.push(temp);
}

const domains = tempDomains;
(async () => {
    const result= await isENSExpired("9999.eth");
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



