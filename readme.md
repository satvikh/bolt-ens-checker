# Bolt ENS Auto-Checker

Bolt ENS Auto-Checker is an interactive CLI tool designed to monitor recently expired ENS (Ethereum Name Service) domains. It identifies domains that are past their 90-day grace period and tracks their price as it decays from $100 million over a 21-day period, notifying you when a domain's registration price drops to your target threshold.

## Features

- **Interactive CLI Manager**: A powerful command-line interface to manage the monitoring process.
- **Dynamic Configuration**: Set and adjust the price threshold and check interval on the fly without restarting.
- **Efficient Monitoring**: Uses a Min-Heap data structure to efficiently schedule checks only when a domain is near its target price.
- **CSV Input**: Load a list of domains to monitor from a CSV file.
- **Live Status Checks**: View the number of domains being monitored and see which one is next in the queue.

## Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/satvikh/bolt-ens-checker.git
    cd bolt-ens-checker
    ```

2.  **Install Dependencies**:
    Ensure you have [Node.js](https://nodejs.org/) installed, then run:
    ```bash
    npm install
    ```

3.  **Set Up Environment File**:
    Create a file named `.env` in the root of the project and add your Alchemy API key.
    ```
    # .env file
    ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY_HERE"
    ```

## Configuration

All core settings are located in `config/config.js`.

-   `domainFile`: The path to your input CSV file (e.g., `./category_lists/10kclub.csv`).
-   `outputFile`: The path for any generated JSON output files.
-   `csvColumn`: The name of the header column in your CSV that contains the domain names.
-   `batchSize`: The number of domains to process in a single batch of requests to the blockchain.
-   `batchDelayMs`: The delay in milliseconds between each batch to help avoid rate-limiting.
-   `autocheck.priceThreshold`: The target registration price (in USD). The monitor will notify you when a domain's price drops to this level.
-   `autocheck.interval`: The interval in milliseconds at which the monitor checks if any domains have hit their target price.

## Usage

To start the application, run the interactive manager:

```bash
node manager.js
```

The manager will start, and you can begin issuing commands.

### Workflow

1.  First, run the `init` command to load the domains from your CSV file and populate the monitoring queue.
2.  Next, run the `start` command to begin the monitoring process.
3.  Use commands like `status` or `list` to check on the monitor's progress.

### Available Commands

-   `init`: Loads domains from the CSV specified in `config.js` and prepares them for monitoring. **Must be run first.**
-   `start`: Starts the live monitoring process.
-   `stop`: Stops the monitoring process.
-   `status`: Shows the current status, including running state, price threshold, and the next domain to be checked.
-   `list`: Displays the complete list of all domains currently in the monitoring queue, their current price, and their next scheduled check time.
-   `set threshold <price>`: Updates the target price threshold and dynamically recalculates the monitoring queue.
-   `set interval <ms>`: Updates the checking interval in milliseconds and restarts the monitor to apply it.
-   `help`: Displays the list of available commands.
-   `exit`: Stops the monitor and exits the application.
