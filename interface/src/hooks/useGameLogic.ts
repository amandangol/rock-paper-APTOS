import { useState, useEffect, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, CoinClient } from "aptos";
import { message } from 'antd';
import { GameState, GameEvent, Achievement } from '../types/types';
import { checkGameInitialization, initializeGame, fetchGameHistory, playMove, fetchAchievements, claimReward, fetchClaimedRewards, fetchWalletBalance, fetchResourceBalance, fundGame } from '../utils/apiUtils';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
const coinClient = new CoinClient(client);

export const useGameLogic = () => {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lastResult, setLastResult] = useState<{
    playerMove: string;
    aiMove: string;
    result: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameInitialized, setIsGameInitialized] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [resourceBalance, setResourceBalance] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [isAchievementsLoading, setIsAchievementsLoading] = useState(false);
  const [playerBalance, setPlayerBalance] = useState<number | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Array<{ type: string, amount: number, timestamp: number }>>([]);
  const [recentRewards, setRecentRewards] = useState<Array<{ id: number, amount: number, timestamp: number }>>([]);
  



  useEffect(() => {
    if (connected && account) {
      checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading);
      getGameHistory(); // Fetch initial game history
    } else {
      setIsLoading(false);
      setIsGameInitialized(false);
      setGameState(null);
      setHistory([]); // Clear history when disconnected
    }
  }, [connected, account]);


  useEffect(() => {
    if (connected && account) {
      fetchClaimedRewards(client, account, setClaimedRewards);
      fetchWalletBalance(coinClient, account, setWalletBalance);
    }
  }, [connected, account]);

  const handleInitializeGame = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      await initializeGame(signAndSubmitTransaction, client);
      message.success("Game initialized successfully!");
      await checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading);
    } catch (error) {
      console.error("Error initializing game:", error);
      message.error("Failed to initialize game");
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  const getGameHistory = useCallback(async () => {
    if (!account) return;
    const fetchedHistory = await fetchGameHistory(client, account);
    setHistory(fetchedHistory);
  }, [account]);

  const fetchAchievementsWithTimeout = useCallback(async () => {
    setIsAchievementsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Achievement fetch timeout')), 10000)
      );
      await Promise.race([
        fetchAchievements(client, account!, setAchievements),
        timeoutPromise
      ]);
      // Load claimed rewards from local storage
      const storedClaimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
      setClaimedRewards(storedClaimedRewards);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setIsAchievementsLoading(false);
    }
  }, [account]);
  
  useEffect(() => {
    if (connected && account) {
      checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading);
      getGameHistory();
      fetchAchievementsWithTimeout();
    } else {
      setIsLoading(false);
      setIsGameInitialized(false);
      setGameState(null);
      setHistory([]);
      setAchievements([]);
    }
  }, [connected, account, fetchAchievementsWithTimeout]);

  const handlePlayMove = useCallback(async (moveIndex: number) => {
    if (!account || !isGameInitialized) return;
    setIsLoading(true);
    try {
      const result = await playMove(signAndSubmitTransaction, client, account, moveIndex);
      setLastResult(result);
      setIsModalVisible(true);
      await checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading);
      await fetchAchievements(client, account, setAchievements);
      await getGameHistory(); // Update history immediately after a move
    } catch (error) {
      console.error("Error playing game:", error);
      message.error("Failed to submit move");
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized, getGameHistory]);


  useEffect(() => {
    if (connected && account) {
      fetchResourceBalance(client, coinClient, setResourceBalance);
    }
  }, [connected, account]);

  const fetchPlayerBalance = useCallback(async () => {
    if (!account) return;
    const balance = await coinClient.checkBalance(account.address);
    setPlayerBalance(Number(balance) / 100000000); // Convert from Octas to APT
  }, [account, coinClient]);

  const handleFundGame = useCallback(async () => {
    if (!account || !connected) return;
    setIsLoading(true);
    try {
      await fundGame(signAndSubmitTransaction, client, coinClient, account, fundAmount);
      message.success(`Successfully funded ${fundAmount} APT to the game!`);
      setRecentTransactions(prev => [...prev, { type: 'Fund', amount: Number(fundAmount), timestamp: Date.now() }]);
      setFundAmount('');
      await fetchResourceBalance(client, coinClient, setResourceBalance);
    } catch (error) {
      console.error("Error funding game:", error);
      message.error("Failed to fund game");
    } finally {
      setIsLoading(false);
    }
  }, [account, connected, signAndSubmitTransaction, fundAmount]);

  const handleClaimReward = useCallback(async (achievementId: number) => {
    if (!account || !isGameInitialized) return;
    setIsLoading(true);
    try {
      const rewardAmount = await claimReward(signAndSubmitTransaction, client, achievementId);
      setRecentRewards(prev => [...prev, { id: achievementId, amount: rewardAmount, timestamp: Date.now() }]);
      setAchievements(prevAchievements =>
        prevAchievements.map(ach =>
          ach.id === achievementId ? { ...ach, claimed: true } : ach
        )
      );
      setClaimedRewards(prev => [...prev, achievementId]);
      await fetchResourceBalance(client, coinClient, setResourceBalance);
      await fetchPlayerBalance();
      message.success(`Reward of ${rewardAmount} APT claimed successfully!`);
    } catch (error) {
      console.error("Error claiming reward:", error);
      message.error("Failed to claim reward: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized, client, coinClient]);  useEffect(() => {
    if (connected && account) {
      fetchPlayerBalance();
    }
  }, [connected, account, fetchPlayerBalance]);


  return {
    gameState,
    history,
    achievements,
    isModalVisible,
    lastResult,
    isLoading,
    isGameInitialized,
    claimedRewards,
    walletBalance,
    resourceBalance,
    fundAmount,
    setIsModalVisible,
    setFundAmount,
    handleInitializeGame,
    handlePlayMove,
    handleClaimReward,
    handleFundGame,
    getGameHistory,
    isAchievementsLoading,
    playerBalance,
    recentTransactions,
    recentRewards,

  };
};

export default useGameLogic;
function getRewardAmount(achievementId: number) {
  throw new Error('Function not implemented.');
}

