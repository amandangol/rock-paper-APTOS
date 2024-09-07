# Aptos Rock Paper Scissors Game

Welcome to the Aptos-based Rock Paper Scissors game! This project demonstrates the integration of blockchain technology with a classic game, showcasing the potential of decentralized applications (dApps) on the Aptos network.

## Introduction

Aptos is a Layer 1 blockchain that offers high throughput and low transaction costs. This project leverages Aptos to create a blockchain-based version of Rock Paper Scissors, targeting developers, blockchain enthusiasts, and casual gamers interested in Web3 technologies.

## Features

- **Blockchain Integration**: Secure game state management on Aptos.
- **Interactive UI**: User-friendly React-based interface.
- **Wallet Connection**: Seamless Aptos wallet integration.
- **Real-time Gameplay**: Instant move submission and result calculation.
- **Game History**: Comprehensive record of past games.
- **Statistics**: Dynamic player performance tracking.
- **Achievements System**: Blockchain-verified accomplishments.
- **Reward Claiming**: Token-based incentives for gameplay.
- **Game Funding**: Players can contribute funds to the prize pool.
- **Player Balance**: Real-time display of player's APT balance.
- **Recent Transactions**: Track recent game fundings and reward claims.
- **Resource Balance**: View the current balance of the game's resource account.

## New Features

1. **Player Balance Component**:

   - Real-time display of the player's APT balance.
   - Updates automatically after transactions.

2. **Game Funding System**:

   - Players can contribute APT to the game's prize pool.
   - Enhances engagement and increases potential rewards.

3. **Recent Transactions Tracking**:

   - Displays recent game fundings and reward claims.
   - Provides transparency and a history of player interactions.

4. **Resource Account Balance**:

   - Shows the current balance of the game's resource account.
   - Allows players to see the total available rewards.

5. **Enhanced Error Handling**:
   - Improved error messages for better user experience.
   - Timeout handling for achievement fetching to prevent UI freezes.

## Getting Started

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/aptos-rock-paper-scissors.git
   ```
2. **Install dependencies**:
   ```
   npm install
   ```
3. **Set up your Aptos account**:
   - Install the Aptos CLI
   - Run `aptos init` and choose `testnet` when prompted
4. **Compile and publish the Move module**:
   ```
   aptos move compile
   aptos move publish
   ```
5. **Start the React app**:
   ```
   npm start
   ```

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Aptos CLI (v1.0.0 or higher)
- Aptos-compatible wallet (e.g., Petra)
- Aptos SDK (v1.3.16 or higher)

## Technologies Used

- React.js for the frontend
- styled-components for styling
- @aptos-labs/wallet-adapter-react for wallet connection
- Aptos SDK for interacting with the blockchain
- Ant Design for UI components

## Future Improvements

- Multiplayer mode
- Additional game modes (e.g., Rock Paper Scissors Lizard Spock)
- Leaderboard system
- Social features (e.g., friend challenges, tournaments)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
