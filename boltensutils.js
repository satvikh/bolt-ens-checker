import { ethers, keccak256 } from "ethers";
import { Network, Alchemy } from 'alchemy-sdk';
import fs from "fs";
import dotenv from "dotenv";



// Load environment variables from .env file
dotenv.config(); 


//setting up alchemy
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const provider =new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/" + settings.apiKey);



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
            today,
            expirationDate,
            graceEnd,
            isSnipeable: snipeable ? "Y" : "N",
            //processedLabel,
            // expired
        };
    } catch (error) {
        console.error(`Error checking ENS domain (${domain}):`, error);
        return { domain, error: "Failed to check expiration" };
    }
}