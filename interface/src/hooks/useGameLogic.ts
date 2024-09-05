import { useState, useEffect, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, CoinClient } from "aptos";
import { message } from 'antd';
import { GameState, GameEvent, Achievement } from '../types/types';
import { MODULE_ADDRESS } from '../constants/gameConstants';
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
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setIsAchievementsLoading(false);
    }
  }, [account, client]);

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

  const handleClaimReward = useCallback(async (achievementId: number) => {
    if (!account || !isGameInitialized) return;
    setIsLoading(true);
    try {
      await claimReward(signAndSubmitTransaction, client, achievementId);
      setAchievements(prevAchievements => 
        prevAchievements.map(ach => 
          ach.id === achievementId ? {...ach, claimed: true} : ach
        )
      );
      setClaimedRewards(prev => [...prev, achievementId]);
      await fetchWalletBalance(coinClient, account, setWalletBalance);
      message.success(`Reward claimed successfully!`);
    } catch (error) {
      console.error("Error claiming reward:", error);
      message.error("Failed to claim reward: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, isGameInitialized]);

  const handleFundGame = useCallback(async () => {
    if (!account || !connected) return;
    setIsLoading(true);
    try {
        await fundGame(signAndSubmitTransaction, client, coinClient, account, fundAmount);
        message.success(`Successfully funded ${fundAmount} APT to the game!`);
        setFundAmount('');
        await fetchResourceBalance(client, coinClient, setResourceBalance);
        await fetchWalletBalance(coinClient, account, setWalletBalance);
      } catch (error) {
        console.error("Error funding game:", error);
        message.error("Failed to fund game: " + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    }, [account, connected, signAndSubmitTransaction, fundAmount]);

   
  
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

    };
  };