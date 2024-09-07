# Aptos Rock Paper Scissors Game

Welcome to the Aptos-based Rock Paper Scissors game! This project demonstrates the integration of blockchain technology with a classic game, showcasing the potential of decentralized applications (dApps) on the Aptos network.

## Introduction

Aptos is a Layer 1 blockchain that offers high throughput and low transaction costs. This project leverages Aptos to create a blockchain-based version of Rock Paper Scissors, targeting developers, blockchain enthusiasts, and casual gamers interested in Web3 technologies.

## Features

- **Blockchain Integration**: Secure game state management on Aptos.
- **Interactive UI**: User-friendly React-based interface with a sleek, modern design.
- **Wallet Connection**: Seamless Aptos wallet integration.
- **Real-time Gameplay**: Instant move submission and result calculation.
- **Game History**: Comprehensive record of past games.
- **Detailed Statistics**: Dynamic tracking of player and AI performance.
- **Achievements System**: Blockchain-verified accomplishments.
- **Reward Claiming**: Token-based incentives for gameplay.

## New Features

1. **Dynamic Reward System**:

   - Win Reward: Players gain 0.02 APT for each win.
   - Loss Penalty: Players lose 0.01 APT for each loss.
   - This creates an engaging economic model within the game.

2. **Player Balance Component**:

   - Real-time display of the player's APT balance.
   - Updates automatically after each game and reward claim.

3. **Recent Transactions Tracking**:

   - Displays recent game outcomes and their financial impact.
   - Shows win rewards and loss penalties.

4. **Achievement Reward Tracking**:

   - Displays recently claimed achievement rewards.
   - Helps players keep track of their earnings from accomplishments.

5. **Enhanced Error Handling**:

   - Improved error messages for better user experience.
   - Timeout handling for achievement fetching to prevent UI freezes.

6. **Comprehensive Game Statistics**:

   - Tracks and displays the number of wins, draws, and losses for both the player and AI.
   - Presented in an easy-to-read format for quick performance assessment.

7. **Slick and Intuitive UI**:
   - Modern, responsive design that works seamlessly across devices.
   - Animated game elements for an engaging user experience.
   - Clear visual feedback for game outcomes and balance changes.
   - Sleek stat cards displaying player and AI performance metrics.
  
## Game Demo

   https://github.com/user-attachments/assets/176278c0-1033-49a2-b507-a4c9dfe14c3a

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

## How the Reward System Works

- When a player wins a game, they receive 0.03 APT as a reward.
- When a player loses a game, they lose 0.01 APT as a penalty.
- The player's balance is updated in real-time after each game.
- Achievement rewards are additional bonuses that players can claim based on their performance.

This system creates an engaging economic model where players are incentivized to play and improve their skills, while also adding an element of risk to each game.

## Game Statistics

The game provides a comprehensive view of both player and AI performance:

- **Player Stats**: Tracks the number of wins, losses, and draws for the human player.
- **AI Stats**: Keeps count of the AI's wins.
- **Visual Representation**: Utilizes sleek, easy-to-read stat cards for quick performance assessment.
- **Real-time Updates**: Statistics are updated immediately after each game.

These statistics allow players to track their progress, analyze their performance against the AI, and strive for improvement.

## UI/UX Highlights

Our game boasts a slick and intuitive user interface designed for an optimal gaming experience:

- **Clean, Modern Design**: A visually appealing layout that's easy on the eyes.
- **Responsive Interface**: Adapts seamlessly to different screen sizes and devices.
- **Animated Elements**: Smooth animations for game moves and results enhance engagement.
- **Intuitive Controls**: Clear buttons for game moves and actions.
- **Real-time Feedback**: Instant visual updates for game outcomes and balance changes.
- **Accessible Statistics**: Prominently displayed stat cards for quick performance checks.
- **Theme Consistency**: Cohesive color scheme and design elements throughout the app.

The UI is crafted to provide a delightful user experience, making the game both fun to play and easy to navigate.

## Future Improvements

- Multiplayer mode
- Additional game modes (e.g., Rock Paper Scissors Lizard Spock)
- Leaderboard system
- Social features (e.g., friend challenges, tournaments)
