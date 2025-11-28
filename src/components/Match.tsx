import React, { memo } from 'react';
import clsx from 'clsx';
import type { Match as MatchType } from '../data/mockData';

interface MatchProps {
  match: MatchType;
  roundIndex: number;
  matchIndex: number;
  totalMatches: number;
  isLastRound?: boolean;
}

export const Match: React.FC<MatchProps> = memo(({ match, matchIndex, isLastRound }) => {
  const { id, team1, team2 } = match;
  
  // Determine connector type
  // Even index in a pair: Connector goes down
  // Odd index in a pair: Connector goes up
  // This is a heuristic for binary tree brackets
  const isTop = matchIndex % 2 === 0;

  return (
    <div className={clsx("match-card-wrapper", { "has-connector": !isLastRound })}>
        <div className="match-card">
        <div className="match-card__number">{id}</div>
        <div className="match-card__content">
            <div className={clsx("team", { "team--winner": team1.isWinner, "team--loser": !team1.isWinner })}>
            <div className="team__info">
                <div className="team__logo">{team1.logo || team1.name[0]}</div>
                <span className="team__name" title={team1.name}>{team1.name}</span>
            </div>
            <div className="team__score">{team1.score}</div>
            </div>
            
            <div className={clsx("team", { "team--winner": team2.isWinner, "team--loser": !team2.isWinner })}>
            <div className="team__info">
                <div className="team__logo">{team2.logo || team2.name[0]}</div>
                <span className="team__name" title={team2.name}>{team2.name}</span>
            </div>
            <div className="team__score">{team2.score}</div>
            </div>
        </div>
        </div>
        
        {!isLastRound && (
            <div className={clsx("connector", { "connector--down": isTop, "connector--up": !isTop })}>
                <div className="connector__line-horizontal"></div>
                <div className="connector__line-vertical"></div>
            </div>
        )}
    </div>
  );
});
