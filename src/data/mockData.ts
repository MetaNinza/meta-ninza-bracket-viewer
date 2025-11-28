export interface Team {
  id: string;
  name: string;
  score: number;
  isWinner: boolean;
  logo?: string; // URL or placeholder
}

export interface Match {
  id: number;
  team1: Team;
  team2: Team;
  status: 'scheduled' | 'live' | 'finished';
  startTime?: string;
}

export interface Round {
  id: number;
  name: string;
  bo: number; // Best of X
  matches: Match[];
}

export interface BracketSection {
  title: string;
  rounds: Round[];
}

// Mock Data
const team = (name: string, score: number, isWinner: boolean, logo: string = ''): Team => ({
  id: name,
  name,
  score,
  isWinner,
  logo
});

export const upperBracket: BracketSection = {
  title: "Upper Bracket",
  rounds: [
    {
      id: 1,
      name: "Upper Bracket R1",
      bo: 3,
      matches: [
        {
          id: 1,
          team1: team("100 Thieves", 3, true),
          team2: team("Team Secret", 0, false),
          status: 'finished'
        },
        {
          id: 2,
          team1: team("Newbee", 1, false),
          team2: team("Evil Geniuses", 2, true),
          status: 'finished'
        },
        {
          id: 3,
          team1: team("OG", 2, true),
          team2: team("TNC Predator", 1, false),
          status: 'finished'
        },
        {
          id: 4,
          team1: team("Virtus Pro", 3, true),
          team2: team("Fnatic", 0, false),
          status: 'finished'
        }
      ]
    },
    {
      id: 2,
      name: "Upper Bracket R2",
      bo: 3,
      matches: [
        {
          id: 9,
          team1: team("100 Thieves", 2, true),
          team2: team("Evil Geniuses", 1, false),
          status: 'finished'
        },
        {
          id: 10,
          team1: team("OG", 1, false),
          team2: team("Virtus Pro", 2, true),
          status: 'finished'
        }
      ]
    },
    {
      id: 3,
      name: "Upper Bracket Final",
      bo: 3,
      matches: [
        {
          id: 16,
          team1: team("100 Thieves", 2, true),
          team2: team("Virtus Pro", 1, false),
          status: 'finished'
        }
      ]
    }
  ]
};

export const lowerBracket: BracketSection = {
  title: "Lower Bracket",
  rounds: [
    {
      id: 1,
      name: "Lower Bracket R1",
      bo: 3,
      matches: [
        {
          id: 5,
          team1: team("Team Secret", 3, true),
          team2: team("Infamous", 0, false),
          status: 'finished'
        },
        {
          id: 6,
          team1: team("Newbee", 0, false),
          team2: team("Natus Vincere", 3, true),
          status: 'finished'
        }
      ]
    },
    {
      id: 2,
      name: "Lower Bracket R2",
      bo: 3,
      matches: [
        {
          id: 11,
          team1: team("Team Secret", 1, false),
          team2: team("Natus Vincere", 2, true),
          status: 'finished'
        }
      ]
    },
    {
        id: 3,
        name: "Lower Bracket R3",
        bo: 3,
        matches: [
          {
            id: 13,
            team1: team("Evil Geniuses", 3, true),
            team2: team("Natus Vincere", 0, false),
            status: 'finished'
          }
        ]
      }
  ]
};
