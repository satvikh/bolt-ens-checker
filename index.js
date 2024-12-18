import { ethers } from "ethers";
import fs from "fs";



const domains = JSON.parse(fs.readFileSync("domains.json")).domains;