# Neosmic RPS: Aptos Rock Paper Scissors Game

This repository contains an enhanced implementation of a Rock Paper Scissors game built on the Aptos blockchain, featuring a sleek React frontend. The project demonstrates the use of Aptos Move for creating a simple yet engaging on-chain game with additional features and improvements, coupled with a modern, responsive user interface.

## Features

1. **Game State Tracking**: The game keeps track of overall statistics including games played, player wins, AI wins, and draws.

2. **Event Emission**: The game emits events for each play, allowing for easy tracking and potential integration with front-end applications.

3. **Improved Randomness**: The AI's choice is generated using a simple randomness mechanism based on the current timestamp.

4. **View Functions**: Added view functions to easily retrieve the current game state and statistics.

5. **React Frontend**: A modern, responsive user interface built with React and Ant Design components.

6. **Wallet Integration**: Seamless integration with Aptos wallets using `@aptos-labs/wallet-adapter-react`.

7. **Game History**: Keeps track of recent games and displays them in the UI.

8. **Real-time Updates**: The UI updates in real-time after each game, showing the latest statistics and game results.

## Frontend Components

- **WalletSelector**: Allows users to connect their Aptos wallet.
- **Game Board**: Interactive buttons for selecting moves (Rock, Paper, Scissors).
- **Statistics Display**: Shows current game stats including scores, games played, and win rate.
- **Recent Games List**: Displays the history of recent games.
- **Result Modal**: A pop-up that shows the result of each game round.

## How It Works

1. **Wallet Connection**: Users connect their Aptos wallet to interact with the game.
2. **Game Initialization**: Players initialize their game state using the `initialize_game` function.
3. **Playing a Game**: Users select their move (Rock, Paper, or Scissors) and submit it.
4. **Result Calculation**: The smart contract determines the winner and updates the game state.
5. **UI Update**: The frontend fetches the updated game state and displays the result in a modal.

## Technologies Used

- Aptos Move: For the smart contract implementation.
- React: For building the user interface.
- Ant Design: For UI components and styling.
- @aptos-labs/wallet-adapter-react: For Aptos wallet integration.

## Getting Started

To run this project locally:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Update the `moduleAddress` in the React code to match your deployed Aptos module address.
4. Start the development server with `npm start`.

## Deployment

1. Deploy the Aptos Move module to your Aptos account.
2. Build the React app for production with `npm run build`.
3. Deploy the built frontend to your preferred hosting service.

## License

This project is open source and available under the [MIT License](LICENSE).
