import fs from 'fs';
import {loadExistingData, netRegPrice} from './boltensutils.js';
import {config} from './config.js';

  
  // Load the JSON file

  
    // Parse JSON data
    let jsonData = loadExistingData();
  
    // Iterate through the JSON data and update the price
    jsonData.forEach(item => {
      const graceEnd = new Date(item.graceEnd); // Convert to JavaScript Date object
      const domainName = item.domain;
      item.price = netRegPrice(domainName, graceEnd);
    });
  
    // Save the updated JSON data back to the file
    fs.writeFile(config.outputFile, JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Updated prices in data.json');
    });
