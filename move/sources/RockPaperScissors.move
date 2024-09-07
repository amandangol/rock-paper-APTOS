module rock_paper_scissors::rock_paper_scissors {
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::vector;
    use std::string::{Self, String};

    // Constants
    const ROCK: u8 = 0;
    const PAPER: u8 = 1;
    const SCISSORS: u8 = 2;

    const PLAYER_WINS: u8 = 0;
    const AI_WINS: u8 = 1;
    const DRAW: u8 = 2;

    const REWARD_FIRST_WIN: u64 = 5_000_000; // 0.05 APT
    const REWARD_TEN_WINS: u64 = 20_000_000; // 0.2 APT
    const REWARD_WINNING_STREAK: u64 = 10_000_000; // 0.1 APT
    const REWARD_FIRST_GAME: u64 = 1_000_000; // 0.01 APT
    const REWARD_FIVE_GAMES: u64 = 5_000_000; // 0.05 APT
    const REWARD_TEN_GAMES: u64 = 10_000_000; // 0.1 APT
    const REWARD_PER_WIN: u64 = 3_000_000; // 0.02 APT
    const PENALTY_PER_LOSS: u64 = 1_000_000; // 0.01 APT


    const E_INVALID_CHOICE: u64 = 1;
    const E_REWARD_CLAIM_NOT_EXISTS: u64 = 2;
    const E_ACHIEVEMENT_NOT_UNLOCKED: u64 = 3;
    const E_REWARD_ALREADY_CLAIMED: u64 = 4;
    const E_APTOS_COIN_NOT_REGISTERED: u64 = 5;
    const E_INSUFFICIENT_PLAYER_BALANCE: u64 = 6;
    const E_INSUFFICIENT_GAME_BALANCE: u64 = 8;
    const E_INSUFFICIENT_FUNDING_AMOUNT: u64 = 7;

    const ACHIEVEMENT_FIRST_WIN: u64 = 1;
    const ACHIEVEMENT_TEN_WINS: u64 = 2;
    const ACHIEVEMENT_WINNING_STREAK: u64 = 3;
    const ACHIEVEMENT_FIRST_GAME: u64 = 4;
    const ACHIEVEMENT_FIVE_GAMES: u64 = 5;
    const ACHIEVEMENT_TEN_GAMES: u64 = 6;


    // Structs
    struct GameResult has store, drop, copy {
        player_choice: u8,
        ai_choice: u8,
        result: u8,
        timestamp: u64,
    }

    struct RewardClaim has key {
        claimed_rewards: vector<u64>,
    }

    struct RewardEvent has drop, store {
        player_address: address,
        achievement_id: u64,
        amount: u64,
        timestamp: u64,
    }

    struct RewardEventHandle has key {
        reward_events: event::EventHandle<RewardEvent>,
    }

    struct GameState has key {
        games_played: u64,
        player_wins: u64,
        ai_wins: u64,
        draws: u64,
        recent_games: vector<GameResult>,
        current_streak: u64,
        last_timestamp: u64,
    }

    struct GameEvent has drop, store {
        player_address: address,
        player_choice: u8,
        ai_choice: u8,
        result: u8,
        timestamp: u64,
    }

    struct GameEventHandle has key {
        game_events: event::EventHandle<GameEvent>,
    }

    struct Achievement has store, drop, copy {
        id: u64,
        name: String,
        description: String,
        unlocked: bool,
    }

    struct Achievements has key {
        achievements: vector<Achievement>,
    }

    struct GameResources has key {
        balance: coin::Coin<AptosCoin>,
    }

    // Module initialization
    fun init_module(account: &signer) {
        move_to(account, GameResources {
            balance: coin::zero<AptosCoin>(),
        });
    }

    // Public functions
    public entry fun initialize_game(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<GameState>(account_addr)) {
            move_to(account, GameState {
                games_played: 0,
                player_wins: 0,
                ai_wins: 0,
                draws: 0,
                recent_games: vector::empty(),
                current_streak: 0,
                last_timestamp: 0,
            });
            move_to(account, GameEventHandle {
                game_events: account::new_event_handle<GameEvent>(account),
            });
            move_to(account, Achievements {
                achievements: vector[
                    Achievement { id: ACHIEVEMENT_FIRST_WIN, name: string::utf8(b"First Victory"), description: string::utf8(b"Win your first game"), unlocked: false },
                    Achievement { id: ACHIEVEMENT_TEN_WINS, name: string::utf8(b"Decathlon"), description: string::utf8(b"Win 10 games"), unlocked: false },
                    Achievement { id: ACHIEVEMENT_WINNING_STREAK, name: string::utf8(b"On Fire"), description: string::utf8(b"Win 5 games in a row"), unlocked: false },
                    Achievement { id: ACHIEVEMENT_FIRST_GAME, name: string::utf8(b"Newcomer"), description: string::utf8(b"Play your first game"), unlocked: false },
                    Achievement { id: ACHIEVEMENT_FIVE_GAMES, name: string::utf8(b"Dedicated Player"), description: string::utf8(b"Play 5 games"), unlocked: false },
                    Achievement { id: ACHIEVEMENT_TEN_GAMES, name: string::utf8(b"Veteran"), description: string::utf8(b"Play 10 games"), unlocked: false },
                ],
            });
            move_to(account, RewardClaim {
                claimed_rewards: vector::empty(),
            });
            move_to(account, RewardEventHandle {
                reward_events: account::new_event_handle<RewardEvent>(account),
            });
        };
    }

   public entry fun claim_reward(account: &signer, achievement_id: u64) acquires RewardClaim, Achievements, RewardEventHandle, GameResources {
        let account_addr = signer::address_of(account);
        
        assert!(exists<RewardClaim>(account_addr), E_REWARD_CLAIM_NOT_EXISTS);
        
        let reward_claim = borrow_global_mut<RewardClaim>(account_addr);
        let achievements = borrow_global<Achievements>(account_addr);
        
        assert!(is_achievement_unlocked(achievements, achievement_id), E_ACHIEVEMENT_NOT_UNLOCKED);
        assert!(!vector::contains(&reward_claim.claimed_rewards, &achievement_id), E_REWARD_ALREADY_CLAIMED);
        
        let reward_amount = get_reward_amount(achievement_id);

        assert!(coin::is_account_registered<AptosCoin>(account_addr), E_APTOS_COIN_NOT_REGISTERED);

        let game_resources = borrow_global_mut<GameResources>(@rock_paper_scissors);
        assert!(coin::value(&game_resources.balance) >= reward_amount, E_INSUFFICIENT_GAME_BALANCE);
        
        let coins = coin::extract(&mut game_resources.balance, reward_amount);
        coin::deposit(account_addr, coins);
        
        vector::push_back(&mut reward_claim.claimed_rewards, achievement_id);
        
        let reward_event_handle = borrow_global_mut<RewardEventHandle>(account_addr);
        event::emit_event(&mut reward_event_handle.reward_events, RewardEvent {
            player_address: account_addr,
            achievement_id,
            amount: reward_amount,
            timestamp: timestamp::now_microseconds(),
        });
    }

  public entry fun fund_game(funder: &signer, amount: u64) acquires GameResources {
        assert!(amount > 0, E_INSUFFICIENT_FUNDING_AMOUNT);
        let game_resources = borrow_global_mut<GameResources>(@rock_paper_scissors);
        let coins = coin::withdraw<AptosCoin>(funder, amount);
        coin::merge(&mut game_resources.balance, coins);
    }

      public entry fun play_game(account: &signer, player_choice: u8) acquires GameState, GameEventHandle, Achievements, GameResources {
        let account_addr = signer::address_of(account);
        
        if (!exists<GameState>(account_addr)) {
            initialize_game(account);
        };
        
        assert!(player_choice <= 2, E_INVALID_CHOICE);

        let game_state = borrow_global_mut<GameState>(account_addr);
        
        let ai_choice = generate_ai_choice(game_state);
        let result = determine_winner(player_choice, ai_choice);
        let current_timestamp = timestamp::now_microseconds();

        game_state.games_played = game_state.games_played + 1;
        
        if (result == PLAYER_WINS) {
            game_state.player_wins = game_state.player_wins + 1;
            game_state.current_streak = game_state.current_streak + 1;
            transfer_win_reward(account);
        } else if (result == AI_WINS) {
            game_state.ai_wins = game_state.ai_wins + 1;
            game_state.current_streak = 0;
            transfer_loss_penalty(account);
        } else {
            game_state.draws = game_state.draws + 1;
        };

        let game_result = GameResult {
            player_choice,
            ai_choice,
            result,
            timestamp: current_timestamp,
        };

        if (vector::length(&game_state.recent_games) == 10) {
            vector::remove(&mut game_state.recent_games, 0);
        };
        vector::push_back(&mut game_state.recent_games, game_result);

        let game_event_handle = borrow_global_mut<GameEventHandle>(account_addr);
        event::emit_event(&mut game_event_handle.game_events, GameEvent {
            player_address: account_addr,
            player_choice,
            ai_choice,
            result,
            timestamp: current_timestamp,
        });

        game_state.last_timestamp = current_timestamp;

        check_and_update_achievements(account_addr);
    }

    fun transfer_win_reward(account: &signer) acquires GameResources {
        let account_addr = signer::address_of(account);
        let game_resources = borrow_global_mut<GameResources>(@rock_paper_scissors);
        
        assert!(coin::value(&game_resources.balance) >= REWARD_PER_WIN, E_INSUFFICIENT_GAME_BALANCE);
        
        let coins = coin::extract(&mut game_resources.balance, REWARD_PER_WIN);
        coin::deposit(account_addr, coins);
    }

    fun transfer_loss_penalty(account: &signer) acquires GameResources {
        let account_addr = signer::address_of(account);
        let game_resources = borrow_global_mut<GameResources>(@rock_paper_scissors);
        
        assert!(coin::balance<AptosCoin>(account_addr) >= PENALTY_PER_LOSS, E_INSUFFICIENT_PLAYER_BALANCE);
        
        let coins = coin::withdraw<AptosCoin>(account, PENALTY_PER_LOSS);
        coin::merge(&mut game_resources.balance, coins);
    }


    // View functions
    #[view]
    public fun get_game_address(): address {
        @rock_paper_scissors
    }

    #[view]
    public fun get_game_balance(): u64 acquires GameResources {
        let game_resources = borrow_global<GameResources>(@rock_paper_scissors);
        coin::value(&game_resources.balance)
    }

    #[view]
    public fun get_game_state(account_addr: address): (u64, u64, u64, u64, vector<GameResult>, u64) acquires GameState {
        let game_state = borrow_global<GameState>(account_addr);
        (
            game_state.games_played,
            game_state.player_wins,
            game_state.ai_wins,
            game_state.draws,
            game_state.recent_games,
            game_state.current_streak
        )
    }

    #[view]
    public fun get_achievements(account_addr: address): vector<Achievement> acquires Achievements {
        *&borrow_global<Achievements>(account_addr).achievements
    }

    #[view]
    public fun get_claimed_rewards(account_addr: address): vector<u64> acquires RewardClaim {
        *&borrow_global<RewardClaim>(account_addr).claimed_rewards
    }

    // Add this new view function
    #[view]
    public fun get_resource_account_address(): address {
        @rock_paper_scissors
    }

    // Private helper functions
    fun is_achievement_unlocked(achievements: &Achievements, achievement_id: u64): bool {
        let i = 0;
        let len = vector::length(&achievements.achievements);
        while (i < len) {
            let achievement = vector::borrow(&achievements.achievements, i);
            if (achievement.id == achievement_id && achievement.unlocked) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun get_reward_amount(achievement_id: u64): u64 {
        if (achievement_id == ACHIEVEMENT_FIRST_WIN) {
            REWARD_FIRST_WIN
        } else if (achievement_id == ACHIEVEMENT_TEN_WINS) {
            REWARD_TEN_WINS
        } else if (achievement_id == ACHIEVEMENT_WINNING_STREAK) {
            REWARD_WINNING_STREAK
        } else if (achievement_id == ACHIEVEMENT_FIRST_GAME) {
            REWARD_FIRST_GAME
        } else if (achievement_id == ACHIEVEMENT_FIVE_GAMES) {
            REWARD_FIVE_GAMES
        } else if (achievement_id == ACHIEVEMENT_TEN_GAMES) {
            REWARD_TEN_GAMES
        } else {
            0
        }
    }

    fun generate_ai_choice(game_state: &GameState): u8 {
        let random_value = (timestamp::now_microseconds() ^ game_state.last_timestamp) % 3;
        (random_value as u8)
    }

    fun determine_winner(player_choice: u8, ai_choice: u8): u8 {
        if (player_choice == ai_choice) {
            DRAW
        } else if (
            (player_choice == ROCK && ai_choice == SCISSORS) ||
            (player_choice == PAPER && ai_choice == ROCK) ||
            (player_choice == SCISSORS && ai_choice == PAPER)
        ) {
            PLAYER_WINS
        } else {
            AI_WINS
        }
    }

    fun check_and_update_achievements(account_addr: address) acquires GameState, Achievements {
        let game_state = borrow_global_mut<GameState>(account_addr);
        let achievements = borrow_global_mut<Achievements>(account_addr);

        let i = 0;
        let len = vector::length(&achievements.achievements);
        while (i < len) {
            let achievement = vector::borrow_mut(&mut achievements.achievements, i);
            if (!achievement.unlocked) {
                if (achievement.id == ACHIEVEMENT_FIRST_WIN && game_state.player_wins == 1) {
                    achievement.unlocked = true;
                } else if (achievement.id == ACHIEVEMENT_TEN_WINS && game_state.player_wins == 10) {
                    achievement.unlocked = true;
                } else if (achievement.id == ACHIEVEMENT_WINNING_STREAK && game_state.current_streak == 5) {
                    achievement.unlocked = true;
                } else if (achievement.id == ACHIEVEMENT_FIRST_GAME && game_state.games_played == 1) {
                    achievement.unlocked = true;
                } else if (achievement.id == ACHIEVEMENT_FIVE_GAMES && game_state.games_played == 5) {
                    achievement.unlocked = true;
                } else if (achievement.id == ACHIEVEMENT_TEN_GAMES && game_state.games_played == 10) {
                    achievement.unlocked = true;
                };
            };
            i = i + 1;
        };
    }
}