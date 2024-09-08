  import { AptosClient, CoinClient, Types} from "aptos";
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
      const isInitialized = resource && 'data' in resource;
      setGameState(isInitialized ? resource.data as GameState : null);
      setIsGameInitialized(isInitialized);
    } catch (error) {
      console.error("Error checking game initialization:", error);
      setGameState(null);
      setIsGameInitialized(false);
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
    const { hash } = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(hash);
  };

  export const fetchGameHistory = async (
    client: AptosClient,
    account: { address: string }
  ): Promise<GameEvent[]> => {
    try {
      return await client.getEventsByEventHandle(
        account.address,
        `${MODULE_ADDRESS}::rock_paper_scissors::GameEventHandle`,
        "game_events"
      ) as GameEvent[];
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
    const { hash } = await signAndSubmitTransaction(payload);
    
    // Wait for the transaction to be confirmed
    const txnResult = await client.waitForTransactionWithResult(hash);
    
    if ('success' in txnResult && txnResult.success && txnResult.vm_status === "Executed successfully") {
      // Fetch the latest event after the transaction is confirmed
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
    }
    
    throw new Error("Failed to process move or fetch result");
  };

  export const fetchAchievements = async (
    client: AptosClient,
    account: { address: string },
    setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>
  ) => {
    try {
      const resourceType = `${MODULE_ADDRESS}::rock_paper_scissors::Achievements`;
      const achievementsResource = await client.getAccountResource(
        account.address,
        resourceType
      );

      if (achievementsResource && 'data' in achievementsResource) {
        const data = achievementsResource.data as AchievementsResource;
        if (Array.isArray(data.achievements)) {
          setAchievements(data.achievements.map(ach => ({
            id: Number(ach.id),
            name: ach.name,
            title: ach.title,
            description: ach.description,
            unlocked: ach.unlocked,
            claimed: false
          })));
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

  export const getRewardAmount = (achievementId: number): number => {
    const rewardAmounts: { [key: number]: number } = {
      1: 5_000_000,  // 0.05 APT
      2: 20_000_000, // 0.2 APT
      3: 10_000_000, // 0.1 APT
      4: 1_000_000,  // 0.01 APT
      5: 5_000_000,  // 0.05 APT
      6: 10_000_000, // 0.1 APT
    };
    return rewardAmounts[achievementId] || 0;
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

    const { hash } = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(hash);

    return getRewardAmount(achievementId);
  };

  export const fetchClaimedRewards = async (
    client: AptosClient,
    account: { address: string }
  ): Promise<number[]> => {
    try {
      const resource = await client.getAccountResource(
        account.address,
        `${MODULE_ADDRESS}::rock_paper_scissors::RewardClaim`
      );
      if (resource && 'data' in resource) {
        return (resource.data as any).claimed_rewards;
      }
      return [];
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
      return [];
    }
  };

  export const fetchResourceBalance = async (
    client: AptosClient,
    coinClient: CoinClient,
    setResourceBalance: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    try {
      const [resourceAccountAddress] = await client.view({
        function: `${MODULE_ADDRESS}::rock_paper_scissors::get_resource_account_address`,
        type_arguments: [],
        arguments: []
      });
      
      if (resourceAccountAddress) {
        const [balance] = await client.view({
          function: `${MODULE_ADDRESS}::rock_paper_scissors::get_game_balance`,
          type_arguments: [],
          arguments: []
        });
        
        if (balance) {
          setResourceBalance(Number(balance) / 100000000); // Convert from Octas to APT
        } else {
          console.error("Invalid balance returned");
        }
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
    const amountInOctas = Math.floor(parseFloat(fundAmount) * 100000000); // Convert APT to Octas
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::rock_paper_scissors::fund_game`,
      type_arguments: [],
      arguments: [amountInOctas.toString()],
    };
    const { hash } = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(hash);
  };