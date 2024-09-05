# Aptos Rock Paper Scissors Game

This project is an Aptos blockchain-based implementation of the classic Rock Paper Scissors game. It demonstrates the integration of blockchain technology with a simple, interactive game interface.

## Features

1. **Blockchain Integration**: Utilizes the Aptos blockchain for game state management and transactions.
2. **Interactive UI**: A user-friendly interface built with React and styled-components.
3. **Wallet Connection**: Seamless integration with Aptos wallets using @aptos-labs/wallet-adapter-react.

## Additional Features

### 1. Game Initialization

- Players can initialize their game state on the blockchain.
- This creates a new game instance tied to the player's address.

### 2. Real-time Gameplay

- Players can make moves (Rock, Paper, or Scissors) with immediate feedback.
- Moves are processed on the blockchain and results are displayed instantly.

### 3. Game History

- Keeps track of all games played, displaying moves and results.
- Players can view their entire game history in a tabular format.

### 4. Statistics

- Shows player wins, AI wins, and draws with visual progress bars.
- Statistics are updated in real-time after each game.

### 5. Achievements System

- Players can unlock various achievements based on their gameplay.
- Achievements are stored on the blockchain and can be viewed in the UI.
- Each achievement has a description and unlock status.

### 6. Reward Claiming

- Players can claim rewards for unlocked achievements.
- Claimed rewards are tracked on the blockchain to prevent double-claiming.
- The UI updates to show which rewards have been claimed.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your Aptos network settings in the code
4. Run the development server: `npm start`

## Prerequisites

- Node.js and npm
- An Aptos-compatible wallet (e.g., Petra, Martian)
- Basic knowledge of React and blockchain concepts
