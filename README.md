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

## Smart Contract Overview

The Move smart contract manages core game logic, achievements, rewards, and funding. Below are the key elements:

### 1. Game Initialization

The contract allows each player to initialize their game state on the Aptos blockchain.

```move
public entry fun initialize_game(account: &signer) {
    let account_addr = signer::address_of(account);
    // Initializes game state, achievements, and reward structures
}
```

### 2. Real-time Gameplay

Players choose Rock, Paper, or Scissors, and the contract determines the result against an AI opponent.

```move
public entry fun play_game(account: &signer, player_choice: u8) {
    // Validates player choice and determines the winner
}
```

### 3. Game History

All games are recorded on-chain, providing transparency and verifiability of results.

```move
#[view]
public fun get_game_state(account_addr: address): (u64, u64, u64, u64, vector<GameResult>, u64) {
    // Returns the game state for the specified player
}
```

### 4. Achievements System

Players can unlock achievements based on their performance, which are tracked on-chain.

Achievements include:

- First Win
- Win 10 Games
- 5-game Winning Streak
- Play 5 or 10 Games

```move
fun check_and_update_achievements(account_addr: address) {
    // Checks if the player qualifies for new achievements and unlocks them
}
```

### 5. Rewards

Players can claim rewards in AptosCoin (APT) for unlocking achievements, with specific reward amounts based on the achievement type.

Achievements and rewards:

- **First Win**: 0.05 APT
- **Ten Wins**: 0.2 APT
- **Winning Streak**: 0.1 APT
- **First Game**: 0.01 APT
- **Five Games**: 0.05 APT
- **Ten Games**: 0.1 APT

```move
public entry fun claim_reward(account: &signer, achievement_id: u64) {
    // Transfers reward to the player after they unlock an achievement
}
```

### 6. Game Funding

Players can contribute AptosCoins (APT) to the game’s prize pool using the `fund_game` function.

```move
public entry fun fund_game(funder: &signer, amount: u64) {
    // Adds funds to the global prize pool
}
```

### 7. Random AI Moves

The contract generates AI moves using timestamp-based randomness.

```move
fun generate_ai_choice(game_state: &GameState): u8 {
    // Generates a random AI choice (Rock, Paper, or Scissors)
}
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/aptos-rock-paper-scissors.git
   ```
2. **Install dependencies**:
   ```
   npm install
   ```
3. **Generate your module address and initialize your account**:

   ```
   aptos init
   ```

   Choose `testnet` when prompted.

4. **Compile the Move module**:
   ```
   aptos move compile
   ```
5. **Publish the module**:

   ```
   aptos move publish
   ```

   Confirm the transaction when prompted.

6. Note the account address output during initialization. You'll use this as your `MODULE_ADDRESS` and `rock_paper_scissors`.

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

## Future Improvements

- Multiplayer mode
- Additional game modes (e.g., Rock Paper Scissors Lizard Spock)

## Troubleshooting

- Ensure your wallet is connected to the correct network.
- Verify you have enough APT for transaction fees.
- Clear the browser cache if issues persist.

We hope you enjoy the game!
