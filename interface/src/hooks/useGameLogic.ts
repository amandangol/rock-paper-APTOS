import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, CoinClient } from "aptos";
import { message } from 'antd';
import { GameState, GameEvent, Achievement } from '../types/types';
import * as apiUtils from '../utils/apiUtils';

const TESTNET_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const APT_DECIMALS = 100000000;

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
  const [claimingReward, setClaimingReward] = useState<number | null>(null);

  const client = useMemo(() => new AptosClient(TESTNET_URL), []);
  const coinClient = useMemo(() => new CoinClient(client), [client]);

  const fetchClaimedRewards = useCallback(async () => {
    if (!account) return;
    try {
      const fetchedClaimedRewards = await apiUtils.fetchClaimedRewards(client, account);
      setClaimedRewards(fetchedClaimedRewards);
      localStorage.setItem('claimedRewards', JSON.stringify(fetchedClaimedRewards));
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  }, [account, client]);

  const fetchPlayerBalance = useCallback(async () => {
    if (!account) return;
    try {
      const balance = await coinClient.checkBalance(account.address);
      setPlayerBalance(Number(balance) / APT_DECIMALS);
    } catch (error) {
      console.error("Error fetching player balance:", error);
    }
  }, [account, coinClient]);

  const fetchAchievements = useCallback(async () => {
    if (!account) return;
    setIsAchievementsLoading(true);
    try {
      await Promise.race([
        apiUtils.fetchAchievements(client, account, setAchievements),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Achievement fetch timeout')), 10000))
      ]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setIsAchievementsLoading(false);
    }
  }, [account, client]);

  const initializeGameState = useCallback(async () => {
    if (!connected || !account) {
      setIsLoading(false);
      setIsGameInitialized(false);
      setGameState(null);
      setHistory([]);
      setAchievements([]);
      setClaimedRewards([]);
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all([
        apiUtils.checkGameInitialization(client, account, setGameState, setIsGameInitialized, setIsLoading),
        apiUtils.fetchGameHistory(client, account).then(setHistory),
        fetchAchievements(),
        fetchClaimedRewards(),
        apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance),
        fetchPlayerBalance(),
      ]);
    } catch (error) {
      console.error("Error initializing game state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, client, coinClient, fetchAchievements, fetchClaimedRewards, fetchPlayerBalance]);

  useEffect(() => {
    initializeGameState();
  }, [initializeGameState]);

  useEffect(() => {
    const storedClaimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
    setClaimedRewards(storedClaimedRewards);
  }, []);

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
  }, [account, signAndSubmitTransaction, client, initializeGameState]);

  const handlePlayMove = useCallback(async (moveIndex: number) => {
    if (!account || !isGameInitialized) return;
    setIsLoading(true);
    try {
      const result = await apiUtils.playMove(signAndSubmitTransaction, client, account, moveIndex);
      setLastResult(result);
      setIsModalVisible(true);
      
      const rewardAmount = result.result === "You Win! 🎉" ? 0.02 : result.result === "AI Wins 🤖" ? -0.01 : 0;
      if (rewardAmount !== 0) {
        setPlayerBalance((prevBalance) => (prevBalance || 0) + rewardAmount);
        setResourceBalance((prevBalance) => (prevBalance || 0) - rewardAmount);
        setRecentTransactions(prev => [...prev, { 
          type: rewardAmount > 0 ? 'Win Reward' : 'Loss Penalty', 
          amount: rewardAmount, 
          timestamp: Date.now() 
        }]);
        message.info(`You ${rewardAmount > 0 ? 'won' : 'lost'} ${Math.abs(rewardAmount)} APT!`);
      }
      
      await initializeGameState();
    } catch (error) {
      console.error("Error playing game:", error);
      message.error("Failed to submit move or retrieve result. Please try again.");
      setLastResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized, client, initializeGameState]);

  const handleFundGame = useCallback(async () => {
    if (!account || !connected) return;
    setIsLoading(true);
    try {
      await apiUtils.fundGame(signAndSubmitTransaction, client, coinClient, account, fundAmount);
      message.success(`Successfully funded ${fundAmount} APT to the game!`);
      setRecentTransactions(prev => [...prev, { type: 'Fund', amount: Number(fundAmount), timestamp: Date.now() }]);
      setFundAmount('');
      await Promise.all([
        apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance),
        fetchPlayerBalance()
      ]);
    } catch (error) {
      console.error("Error funding game:", error);
      message.error("Failed to fund game");
    } finally {
      setIsLoading(false);
    }
  }, [account, connected, signAndSubmitTransaction, client, coinClient, fundAmount, fetchPlayerBalance]);

  const handleClaimReward = useCallback(async (achievementId: number) => {
    if (!account || !isGameInitialized || claimedRewards.includes(achievementId)) {
      message.warning('You have already claimed this reward or game is not initialized!');
      return;
    }

    setClaimingReward(achievementId);
    try {
      const rewardAmount = await apiUtils.claimReward(signAndSubmitTransaction, client, achievementId);
      setClaimedRewards(prev => [...prev, achievementId]);
      setAchievements(prevAchievements =>
        prevAchievements.map(ach =>
          ach.id === achievementId ? { ...ach, claimed: true } : ach
        )
      );
      await Promise.all([
        apiUtils.fetchResourceBalance(client, coinClient, setResourceBalance),
        fetchPlayerBalance()
      ]);
      message.success(`Reward of ${rewardAmount / APT_DECIMALS} APT claimed successfully!`);
    } catch (error) {
      console.error("Error claiming reward:", error);
      if (error instanceof Error && error.message.includes("REWARD_ALREADY_CLAIMED")) {
        message.warning("This reward has already been claimed.");
        setClaimedRewards(prev => [...prev, achievementId]);
        setAchievements(prevAchievements =>
          prevAchievements.map(ach =>
            ach.id === achievementId ? { ...ach, claimed: true } : ach
          )
        );
      } else {
        message.error("Failed to claim reward: " + (error instanceof Error ? error.message : String(error)));
      }
    } finally {
      setClaimingReward(null);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized, client, coinClient, fetchPlayerBalance, claimedRewards]);

  const getGameHistory = useCallback(async () => {
    if (!account) return;
    try {
      const fetchedHistory = await apiUtils.fetchGameHistory(client, account);
      setHistory(fetchedHistory);
    } catch (error) {
      console.error("Error fetching game history:", error);
      message.error("Failed to fetch game history");
    }
  }, [account, client]);

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
    claimingReward,
    fetchClaimedRewards,
    getGameHistory,
    getRewardAmount: apiUtils.getRewardAmount,
  };
};

export default useGameLogic;