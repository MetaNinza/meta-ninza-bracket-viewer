import React, { useMemo, memo } from 'react';
import { upperBracket, lowerBracket, type BracketSection } from '../data/mockData';
import { Match } from './Match';
import { useDragScroll } from '../hooks/useDragScroll';
import '../styles/bracket.scss';

// Constants for layout
const ROW_HEIGHT = 120; // Spacing unit (Match Height 82 + Gap)

// Memoized helper to get Y position for Upper Bracket (Binary Tree)
// Cache results to avoid recalculations
const yPositionCache = new Map<string, number>();

const getYPosition = (roundIndex: number, matchIndex: number): number => {
  const cacheKey = `${roundIndex}-${matchIndex}`;
  if (yPositionCache.has(cacheKey)) {
    return yPositionCache.get(cacheKey)!;
  }
  
  let result: number;
  // Base case: Round 0 (R1)
  if (roundIndex === 0) {
    result = matchIndex * ROW_HEIGHT;
  } else {
    // Recursive step: Position is average of children in previous round
    // We assume strict binary tree: Match i in Round R comes from 2*i and 2*i+1 in Round R-1
    const child1Y = getYPosition(roundIndex - 1, matchIndex * 2);
    const child2Y = getYPosition(roundIndex - 1, matchIndex * 2 + 1);
    result = (child1Y + child2Y) / 2;
  }
  
  yPositionCache.set(cacheKey, result);
  return result;
};

interface SectionProps {
    section: BracketSection;
    layoutType?: 'binary' | 'linear';
}

const Section: React.FC<SectionProps> = memo(({ section, layoutType = 'linear' }) => {
  const isBinary = layoutType === 'binary';
  
  const totalTreeHeight = useMemo(() => {
    return isBinary ? (upperBracket.rounds[0].matches.length * ROW_HEIGHT) : 'auto';
  }, [isBinary]);

  return (
    <div className={`bracket-container__section ${isBinary ? 'binary-layout' : ''}`}>
      <h2 className="section-title">{section.title}</h2>
      <div className="bracket-container__rounds">
        {section.rounds.map((round, roundIndex) => {
          // For binary layout, we calculate the height of the container to fit everything
          // The height is determined by the first round's items
          
          return (
            <div 
                key={round.id} 
                className="round" 
                style={{ height: totalTreeHeight, position: isBinary ? 'relative' : 'static' }}
            >
              <div className="round__header">
                {round.name} <span className="bo-badge">({round.bo > 1 ? `Bo${round.bo}` : 'Bo1'})</span>
              </div>
              <div className="round__matches" style={{ position: isBinary ? 'relative' : 'static', height: '100%' }}>
                {round.matches.map((match, matchIndex) => {
                  const topPos = isBinary ? getYPosition(roundIndex, matchIndex) : 0;
                  
                  // Connector Logic
                  // We draw lines for matches that have a "next" match.
                  // In binary tree, all matches except the last round have a next match.
                  // The "next" match is at matchIndex // 2 in the next round.
                  // If this is an even match (0, 2...), it's the top child.
                  // If this is an odd match (1, 3...), it's the bottom child.
                  
                  const hasNext = roundIndex < section.rounds.length - 1;
                  const isTopChild = matchIndex % 2 === 0;

                  return (
                    <div 
                        key={match.id}
                        className="match-wrapper-absolute"
                        style={isBinary ? { position: 'absolute', top: `${topPos}px`, left: 0 } : {}}
                    >
                        <Match 
                            match={match} 
                            roundIndex={roundIndex}
                            matchIndex={matchIndex}
                            totalMatches={round.matches.length}
                            isLastRound={!hasNext}
                        />
                        
                        {/* CSS Lines for Binary Layout */}
                        {isBinary && hasNext && (
                            <>
                                {/* Horizontal line out to the right */}
                                <div className="line-horizontal" />
                                
                                {/* Vertical line connecting this match to its sibling */}
                                {/* Draw vertical line downwards if Top Child, upwards if Bottom Child? */}
                                {/* Actually, drawing a single vertical line from Top Child down to Bottom Child is easier. */}
                                {isTopChild && (
                                    <div 
                                        className="line-vertical" 
                                        style={{ 
                                            height: `${getYPosition(roundIndex, matchIndex + 1) - topPos}px`
                                        }} 
                                    />
                                )}
                            </>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const BracketViewer: React.FC = () => {
  const containerRef = useDragScroll();

  return (
    <div ref={containerRef} className="bracket-container">
      {/* Upper Bracket using Binary Tree Layout */}
      <Section section={upperBracket} layoutType="binary" />
      
      {/* Lower Bracket using Linear Layout (stacking) */}
      <Section section={lowerBracket} layoutType="linear" />
    </div>
  );
};
