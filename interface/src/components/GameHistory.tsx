import React, { useEffect } from 'react';
import { GameEvent } from '../types/types';
import { MOVES, RESULTS } from '../constants/gameConstants';
import { StyledTable } from '../styles/StyledComponents';

type GameHistoryProps = {
  history: GameEvent[];
  getGameHistory: () => Promise<void>;
};

const GameHistory: React.FC<GameHistoryProps> = ({ history, getGameHistory }) => {
  useEffect(() => {
    getGameHistory();
  }, [getGameHistory]);

  const columns = [
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
    },
    {
      title: 'Player Move',
      dataIndex: 'playerMove',
      key: 'playerMove',
      render: (move: number) => MOVES[move],
    },
    {
      title: 'AI Move',
      dataIndex: 'aiMove',
      key: 'aiMove',
      render: (move: number) => MOVES[move],
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (result: number) => RESULTS[result],
    },
    {
      title: 'Balance Change',
      dataIndex: 'balanceChange',
      key: 'balanceChange',
      render: (balanceChange: number) => {
        // const formattedChange = balanceChange.toFixed(2);
        const color = balanceChange > 0 ? 'green' : balanceChange < 0 ? 'red' : 'black';
        const sign = balanceChange > 0 ? '+' : balanceChange < 0 ? '-' : '';
        return <span style={{ color }}>{sign}{Math.abs(balanceChange)} APT</span>;
      },
    },
  ];

  const tableData = history.map((item: GameEvent, index: number) => {
    let balanceChange = 0;
    if (Number(item.data.result) === 0) { // Player wins
      balanceChange = 0.03;
    } else if (Number(item.data.result) === 1) { // AI wins
      balanceChange = -0.01;
    }
    // For draws (result === 2), balanceChange remains 0

    return {
      key: index,
      game: index + 1,
      playerMove: Number(item.data.player_choice),
      aiMove: Number(item.data.ai_choice),
      result: Number(item.data.result),
      balanceChange: balanceChange,
    };
  }).reverse();

  return (
    <StyledTable 
      columns={columns} 
      dataSource={tableData} 
      pagination={{ pageSize: 5 }}
    />
  );
};

export default GameHistory;