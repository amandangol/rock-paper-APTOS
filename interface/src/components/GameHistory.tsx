import React, { useEffect } from 'react';
import { Table } from 'antd';
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
  ];

  const tableData = history.map((item: GameEvent, index: number) => ({
    key: index,
    game: index + 1,
    playerMove: Number(item.data.player_choice),
    aiMove: Number(item.data.ai_choice),
    result: Number(item.data.result),
  })).reverse();

  return (
    <StyledTable 
      columns={columns} 
      dataSource={tableData} 
      pagination={{ pageSize: 5 }}
    />
  );
};

export default GameHistory;