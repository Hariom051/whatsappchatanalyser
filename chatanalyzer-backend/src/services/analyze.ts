export interface MessageEvent {
  date: string; // YYYY-MM-DD
  user: string;
}

export interface JoinEvent {
  date: string; // YYYY-MM-DD
  user: string;
}

interface Result {
  date: string;
  active: number;
  joined: number;
}

export interface AnalysisResult {
  result: Result[];
  active4Days: string[];
}

export class Last7DaysAnalyzer {
  public analyze(messages: MessageEvent[], joins: JoinEvent[]): AnalysisResult {
    const allDates = [...messages, ...joins].map((e) =>
      new Date(e.date).getTime(),
    );

    if (allDates.length === 0) {
      return {
        result: [],
        active4Days: [],
      };
    }

    //  Max date in dataset
    const maxDate = new Date(Math.max(...allDates));

    //  Last 7 days (YYYY-MM-DD)
    const last7: string[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    //  Prepare day-wise sets
    const activeUsersPerDay: Record<string, Set<string>> = {};
    const newUsersPerDay: Record<string, Set<string>> = {};

    for (const day of last7) {
      activeUsersPerDay[day] = new Set<string>();
      newUsersPerDay[day] = new Set<string>();
    }

    // Fill active users
    for (const m of messages) {
      activeUsersPerDay[m.date]?.add(m.user);
    }

    //  Fill joined users
    for (const j of joins) {
      newUsersPerDay[j.date]?.add(j.user);
    }

    //  Convert to counts
    const activeCounts = last7.map((d) => activeUsersPerDay[d].size);

    const joinCounts = last7.map((d) => newUsersPerDay[d].size);

    //  Active ≥ 4 days logic
    const userActivity: Record<string, Set<string>> = {};

    for (const m of messages) {
      if (!userActivity[m.user]) {
        userActivity[m.user] = new Set<string>();
      }
      userActivity[m.user].add(m.date);
    }

    const active4Days = Object.keys(userActivity).filter((user) => {
      let count = 0;
      for (const day of userActivity[user]) {
        if (last7.includes(day)) count++;
      }
      return count >= 4;
    });

    return {
      result: last7.map((date, index) => ({
        date,
        active: activeCounts[index] ?? 0,
        joined: joinCounts[index] ?? 0,
      })),
      active4Days,
    };
  }
}
