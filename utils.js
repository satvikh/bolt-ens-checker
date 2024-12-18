import { ethers } from "ethers";

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


// Async function to check expiration
export async function isENSExpired(domain) {
    try {
        // Extract the label (name part before .eth)
        const label = domain.split(".")[0];

        // Compute the label hash (required by the contract)
        const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

        // Query the expiration timestamp
        const expirationTimestamp = await registrar.nameExpires(labelHash);

        // Convert the expiration timestamp to a readable date
        const expirationDate = new Date(expirationTimestamp * 1000);

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

        // Check if the domain is expired
        const isExpired = expirationDate < today;

        // Return the results
        return {
            domain,
            isExpired,
            expirationDate: expirationDate.toISOString(),
        };
    } catch (error) {
        console.error(`Error checking ENS domain (${domain}):`, error);
        return { domain, error: "Failed to check expiration" };
    }
}