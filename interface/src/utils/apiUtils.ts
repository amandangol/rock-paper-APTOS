import { AptosClient, CoinClient, Types } from "aptos";
import { GameState, GameEvent, Achievement, AchievementsResource } from '../types/types';
import { MODULE_ADDRESS, MOVES, RESULTS } from '../constants/gameConstants';

export const checkGameInitialization = async (
  client: AptosClient,
  account: { address: string },
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>,
  setIsGameInitialized: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const resource = await client.getAccountResource(
      account.address,
      `${MODULE_ADDRESS}::rock_paper_scissors::GameState`
    );
    if (resource && 'data' in resource) {
      setGameState(resource.data as GameState);
      setIsGameInitialized(true);
    } else {
      setIsGameInitialized(false);
      setGameState(null);
    }
  } catch (error) {
    console.error("Error checking game initialization:", error);
    setIsGameInitialized(false);
    setGameState(null);
  } finally {
    setIsLoading(false);
  }
};

export const initializeGame = async (
  signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
  client: AptosClient
) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::rock_paper_scissors::initialize_game`,
    type_arguments: [],
    arguments: [],
  };
  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);
};

export const fetchGameHistory = async (
  client: AptosClient,
  account: { address: string }
): Promise<GameEvent[]> => {
  try {
    const events = await client.getEventsByEventHandle(
      account.address,
      `${MODULE_ADDRESS}::rock_paper_scissors::GameEventHandle`,
      "game_events"
    );
    return events as GameEvent[];
  } catch (error) {
    console.error("Error fetching game history:", error);
    return [];
  }
};

export const playMove = async (
  signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
  client: AptosClient,
  account: { address: string },
  moveIndex: number
) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::rock_paper_scissors::play_game`,
    type_arguments: [],
    arguments: [moveIndex],
  };
  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);

  const events = await client.getEventsByEventHandle(
    account.address,
    `${MODULE_ADDRESS}::rock_paper_scissors::GameEventHandle`,
    "game_events"
  );
  
  if (events.length > 0) {
    const latestEvent = events[events.length - 1] as GameEvent;
    return {
      playerMove: MOVES[Number(latestEvent.data.player_choice)],
      aiMove: MOVES[Number(latestEvent.data.ai_choice)],
      result: RESULTS[Number(latestEvent.data.result)],
    };
  }
  return null;
};

export const fetchAchievements = async (
  client: AptosClient,
  account: { address: string },
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>
) => {
  console.log("Fetching achievements for account:", account.address);
  try {
    const resourceType = `${MODULE_ADDRESS}::rock_paper_scissors::Achievements`;
    console.log("Querying resource type:", resourceType);
    
    const achievementsResource = await client.getAccountResource(
      account.address,
      resourceType
    );
    console.log("Raw achievements resource:", achievementsResource);

    if (achievementsResource && 'data' in achievementsResource) {
      const data = achievementsResource.data as AchievementsResource;
      console.log("Achievements data:", data);

      if (Array.isArray(data.achievements)) {
        const formattedAchievements = data.achievements.map(ach => ({
          id: ach.id,
          name: ach.name,
          description: ach.description,
          unlocked: ach.unlocked,
          claimed: false
        }));
        console.log("Formatted achievements:", formattedAchievements);
        setAchievements(formattedAchievements);
      } else {
        console.error("Achievements data is not an array:", data.achievements);
        setAchievements([]);
      }
    } else {
      console.error("No achievements data found in resource");
      setAchievements([]);
    }
  } catch (error) {
    console.error("Error fetching achievements:", error);
    setAchievements([]);
  }
};

export const claimReward = async (
  signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
  client: AptosClient,
  achievementId: number
) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::rock_paper_scissors::claim_reward`,
    type_arguments: [],
    arguments: [achievementId],
  };
  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);
};

export const fetchClaimedRewards = async (
  client: AptosClient,
  account: { address: string },
  setClaimedRewards: React.Dispatch<React.SetStateAction<number[]>>
) => {
  try {
    const resource = await client.getAccountResource(
      account.address,
      `${MODULE_ADDRESS}::rock_paper_scissors::RewardClaim`
    );
    if (resource && 'data' in resource) {
      setClaimedRewards((resource.data as any).claimed_rewards);
    }
  } catch (error) {
    console.error("Error fetching claimed rewards:", error);
  }
};

export const fetchWalletBalance = async (
  coinClient: CoinClient,
  account: { address: string },
  setWalletBalance: React.Dispatch<React.SetStateAction<number | null>>
) => {
  try {
    const balance = await coinClient.checkBalance(account.address);
    setWalletBalance(Number(balance));
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
  }
};

export const fetchResourceBalance = async (
  client: AptosClient,
  coinClient: CoinClient,
  setResourceBalance: React.Dispatch<React.SetStateAction<number | null>>
) => {
  try {
    const resourceAccountAddress = await client.view({
      function: `${MODULE_ADDRESS}::rock_paper_scissors::get_resource_account_address`,
      type_arguments: [],
      arguments: []
    });
    
    if (resourceAccountAddress && resourceAccountAddress.length > 0) {
      const balance = await coinClient.checkBalance(resourceAccountAddress[0] as string);
      setResourceBalance(Number(balance));
    } else {
      console.error("Invalid resource account address returned");
    }
  } catch (error) {
    console.error("Error fetching resource balance:", error);
  }
};

export const fundGame = async (
  signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
  client: AptosClient,
  coinClient: CoinClient,
  account: { address: string },
  fundAmount: string
) => {
  const amountInOctas = Math.floor(parseFloat(fundAmount) * 100000000);
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::rock_paper_scissors::fund_game`,
    type_arguments: [],
    arguments: [amountInOctas.toString()],
  };
  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);
};