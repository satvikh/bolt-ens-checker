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


const registrar = new ethers.Contract(ENS_REGISTRAR_ADDRESS, ENS_REGISTRAR_ABI, alchemy);

// Async function to check expiration
export async function isENSExpired(domain) {
    try {
        
        const today = new Date();
        const label = domain.endsWith('.eth') ? domain.slice(0, -4) : domain;
        const processedLabel= keccak256(label);
        // const expirationDate = nameExpires(processedLabel);
        // const expired = expirationDate < today;
        // Return the results
        return {
            domain,
            // isExpired,
            // expirationDate: expirationDate.toISOString(),
            ////Test Functions
            label,
            today,
            // expirationDate,
            processedLabel,
            // expired
        };
    } catch (error) {
        console.error(`Error checking ENS domain (${domain}):`, error);
        return { domain, error: "Failed to check expiration" };
    }
}