import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as monitor from './src/core/monitor.js';

const rl = readline.createInterface({ input, output });
let isInitialized = false;

const showHelp = () => {
    console.log(`
Available Commands:
<<<<<<< HEAD
  init      - Load domains from CSV and initialize the monitor (must be run first).
  start     - Start the monitoring process.
  stop      - Stop the monitoring process.
  status    - Show the current status of the monitor.
  help      - Display this help message.
  exit      - Exit the application.
=======
  init                  - Load domains from CSV and initialize the monitor (must be run first).
  start                 - Start the monitoring process.
  stop                  - Stop the monitoring process.
  status                - Show the current status of the monitor.
  list                  - Show all domains currently in the monitoring queue.
  set threshold <price> - Update the target price and recalculate the queue.
  set interval <ms>     - Update the check interval (in milliseconds).
  help                  - Display this help message.
  exit                  - Exit the application.
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
`);
};

const main = async () => {
    console.log("ENS Domain Monitor Manager");
    console.log("Type 'help' for a list of commands.");
<<<<<<< HEAD
    showHelp();

    while (true) {
        const answer = await rl.question('ENS-Manager > ');
        const command = answer.trim().toLowerCase();
=======
    
    while (true) {
        const answer = await rl.question('ENS-Manager > ');
        const parts = answer.trim().split(' ');
        const command = parts[0].toLowerCase();
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)

        if (!isInitialized && !['init', 'exit', 'help'].includes(command)) {
            console.log("Please run 'init' first to load the domains.");
            continue;
        }

        switch (command) {
            case 'init':
                isInitialized = await monitor.initialize();
                break;
            case 'start':
                monitor.start();
                break;
            case 'stop':
                monitor.stop();
                break;
            case 'status':
                monitor.getStatus();
                break;
<<<<<<< HEAD
=======
            case 'list':
                console.log(monitor.listDomains());
                break;
            case 'set':
                const [, subCommand, value] = parts;
                if (subCommand === 'threshold') {
                    monitor.setThreshold(value);
                } else if (subCommand === 'interval') {
                    monitor.setIntervalValue(value);
                } else {
                    console.log("Invalid 'set' command. Use 'set threshold <price>' or 'set interval <ms>'.");
                }
                break;
>>>>>>> c89a993 (feat: Implement interactive CLI manager and core logic refactor)
            case 'help':
                showHelp();
                break;
            case 'exit':
                console.log("Exiting manager.");
                monitor.stop(); // Ensure monitor is stopped before exiting
                rl.close();
                return;
            default:
                console.log("Unknown command. Type 'help' for a list of commands.");
                break;
        }
    }
};

main();
