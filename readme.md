![Platform](https://img.shields.io/badge/platform-ENS-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
# Bolt ENS Checker

Bolt ENS Checker is a command-line tool designed to verify the availability of Ethereum Name Service (ENS) domain names. It streamlines the process of checking multiple ENS names, making it particularly useful for developers and domain investors.

## Features

- **Batch Processing**: Check the availability of multiple ENS names simultaneously.
- **CSV Support**: Import ENS names from a CSV file for bulk checking.
- **Detailed Output**: Receive comprehensive results indicating the availability status of each ENS name.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/satvikh/bolt-ens-checker.git
   cd bolt-ens-checker
   ```

2. **Install Dependencies**:

   Ensure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```

3. **Set Up the Environment File**:

   Create a `.env` file in the root directory of the project and include your API keys. Example:

   ```plaintext
   INFURA_API_KEY=your_infura_api_key
   FLASHBOTS_PRIVATE_KEY=your_private_key
   ```

## Usage

1. **Configure ENS Names**:

   - Modify the configuration area in the script to include the ENS names you wish to check and any other parameters.

2. **Run the Checker**:

   To execute the checker, use one of the following commands:

   ```bash
   node src/scripts/bolt_checker.js
   ```

   or

   ```bash
   node src/scripts/recalculate_premium.js
   ```

   The specific script to use depends on whether you are checking ENS availability or recalculating premium domains.

   Both scripts rely on your configuration and will process the ENS names accordingly.

## Sniping Features

The ENS sniping features of this tool are private due to their proprietary nature. These advanced functionalities are not included in the public release of this repository.

### How the Sniping Tool Works

The sniping tool is designed to acquire premium ENS domains quickly and efficiently. Here's how it operates:

1. **Price Setting**: Users can set a maximum price threshold for sniping a premium ENS domain.
2. **WebSocket Scanning**: The tool utilizes WebSockets to monitor domain registration events in real-time, ensuring immediate detection of available or dropped domains.
3. **Flashbots Transactions**: When a target domain is detected, the tool submits transactions through Flashbots, a system that ensures private and efficient transaction execution, bypassing the public mempool to avoid front-running.

These features provide a high level of precision and reliability for acquiring premium ENS domains.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to enhance the functionality of this tool.

## Acknowledgments

Special thanks to the Ethereum Name Service community for their ongoing development and support.

---

*Note: This tool is intended for educational and informational purposes only. Always ensure you have the necessary permissions when interacting with domain services.*

