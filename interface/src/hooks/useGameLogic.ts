import { useState, useEffect, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, CoinClient } from "aptos";
import { message } from 'antd';
import { GameState, GameEvent, Achievement } from '../types/types';
import * as apiUtils from '../utils/apiUtils';

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
  const [resourceBalance, setResourceBalance] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [isAchievementsLoading, setIsAchievementsLoading] = useState(false);
  const [playerBalance, setPlayerBalance] = useState<number | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Array<{ type: string, amount: number, timestamp: number }>>([]);
  const [recentRewards, setRecentRewards] = useState<Array<{ id: number, amount: number, timestamp: number }>>([]);



  const fetchClaimedRewards = useCallback(async () => {
    if (!account) return;
    try {
      const fetchedClaimedRewards = await apiUtils.fetchClaimedRewards(client, account);
      setClaimedRewards(fetchedClaimedRewards);
      localStorage.setItem('claimedRewards', JSON.stringify(fetchedClaimedRewards));
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  }, [account]);

  const initializeGameState = useCallback(async () => {
    if (connected && account) {
      await apiUtils.checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading);
      await getGameHistory();
      await fetchAchievementsWithTimeout();
      await fetchClaimedRewards();
      await apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance);
      await fetchPlayerBalance();
    } else {
      setIsLoading(false);
      setIsGameInitialized(false);
      setGameState(null);
      setHistory([]);
      setAchievements([]);
      setClaimedRewards([]);
    }
  }, [connected, account]);

  useEffect(() => {
    initializeGameState();
  }, [initializeGameState]);

  const getGameHistory = useCallback(async () => {
    if (!account) return;
    const fetchedHistory = await apiUtils.fetchGameHistory(client, account);
    setHistory(fetchedHistory);
  }, [account]);



  const fetchAchievementsWithTimeout = useCallback(async () => {
    setIsAchievementsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Achievement fetch timeout')), 10000)
      );
      await Promise.race([
        apiUtils.fetchAchievements(client, account!, setAchievements),
        timeoutPromise
      ]);
      const storedClaimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
      setClaimedRewards(storedClaimedRewards);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setIsAchievementsLoading(false);
    }
  }, [account]);

  const handleInitializeGame = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      await apiUtils.initializeGame(signAndSubmitTransaction, client);
      message.success("Game initialized successfully!");
      await initializeGameState();
    } catch (error) {
      console.error("Error initializing game:", error);
      message.error("Failed to initialize game");
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, initializeGameState]);

  const handlePlayMove = useCallback(async (moveIndex: number) => {
    if (!account || !isGameInitialized) return;
    setIsLoading(true);
    try {
      const result = await apiUtils.playMove(signAndSubmitTransaction, client, account, moveIndex);
      setLastResult(result);
      setIsModalVisible(true);
      
      if (result?.result === "You Win! 🎉") {
        const rewardAmount = 0.02; // 0.02 APT
        setPlayerBalance((prevBalance) => (prevBalance || 0) + rewardAmount);
        setResourceBalance((prevBalance) => (prevBalance || 0) - rewardAmount);
        setRecentTransactions(prev => [...prev, { type: 'Win Reward', amount: rewardAmount, timestamp: Date.now() }]);
        message.success(`You won ${rewardAmount} APT!`);
      } else if (result?.result === "AI Wins 🤖") {
        const penaltyAmount = 0.01; // 0.01 APT
        setPlayerBalance((prevBalance) => (prevBalance || 0) - penaltyAmount);
        setResourceBalance((prevBalance) => (prevBalance || 0) + penaltyAmount);
        setRecentTransactions(prev => [...prev, { type: 'Loss Penalty', amount: -penaltyAmount, timestamp: Date.now() }]);
        message.warning(`You lost ${penaltyAmount} APT.`);
      }
      
      await initializeGameState();
    } catch (error) {
      console.error("Error playing game:", error);
      message.error("Failed to submit move");
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized, initializeGameState]);

  const handleFundGame = useCallback(async () => {
    if (!account || !connected) return;
    setIsLoading(true);
    try {
      await apiUtils.fundGame(signAndSubmitTransaction, client, coinClient, account, fundAmount);
      message.success(`Successfully funded ${fundAmount} APT to the game!`);
      setRecentTransactions(prev => [...prev, { type: 'Fund', amount: Number(fundAmount), timestamp: Date.now() }]);
      setFundAmount('');
      await apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance);
      await fetchPlayerBalance();
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
      const rewardAmount = await apiUtils.claimReward(signAndSubmitTransaction, client, achievementId);
      setRecentRewards(prev => [...prev, { id: achievementId, amount: rewardAmount, timestamp: Date.now() }]);
      
      // Update local state
      setAchievements(prevAchievements =>
        prevAchievements.map(ach =>
          ach.id === achievementId ? { ...ach, claimed: true } : ach
        )
      );
      setClaimedRewards(prev => {
        const newClaimedRewards = [...prev, achievementId];
        localStorage.setItem('claimedRewards', JSON.stringify(newClaimedRewards));
        return newClaimedRewards;
      });

      await apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance);
      await fetchPlayerBalance();
      message.success(`Reward of ${rewardAmount / 100000000} APT claimed successfully!`);
    } catch (error) {
      console.error("Error claiming reward:", error);
      message.error("Failed to claim reward: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized]);

  useEffect(() => {
    initializeGameState();
  }, [initializeGameState]);

  const fetchPlayerBalance = useCallback(async () => {
    if (!account) return;
    const balance = await coinClient.checkBalance(account.address);
    setPlayerBalance(Number(balance) / 100000000); // Convert from Octas to APT
  }, [account]);

  
  return {
    gameState,
    history,
    achievements,
    isModalVisible,
    lastResult,
    isLoading,
    isGameInitialized,
    claimedRewards,
    resourceBalance,
    fundAmount,
    playerBalance,
    recentTransactions,
    recentRewards,
    isAchievementsLoading,
    setIsModalVisible,
    setFundAmount,
    handleInitializeGame,
    handlePlayMove,
    handleClaimReward,
    handleFundGame,
    getGameHistory,
    getRewardAmount: apiUtils.getRewardAmount,
  };
};

export default useGameLogic;