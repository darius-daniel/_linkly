export type PeriodBounds = {
  start: Date;
  end: Date;
};

export type VisitRecord = {
  linkID: string;
  createdAt: Date | string;
};

export type LinkRecord = {
  id: string;
  createdAt: Date | string;
  expiresAt: Date | string | null;
};

export type ClickMetrics = {
  totalClicks: number;
  thisMonthClicks: number;
  lastMonthClicks: number;
  clicksChangePercent: number;
  clickThroughRate: number;
  thisMonthCtr: number;
  lastMonthCtr: number;
  ctrChangePoints: number;
};

export function getMonthPeriods(referenceDate = new Date()) {
  const startOfThisMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
  );
  const startOfLastMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() - 1,
    1,
  );

  return {
    current: { start: startOfThisMonth, end: referenceDate },
    previous: { start: startOfLastMonth, end: startOfThisMonth },
  } satisfies { current: PeriodBounds; previous: PeriodBounds };
}

export function isWithinPeriod(
  date: Date | string,
  period: PeriodBounds,
): boolean {
  const value = new Date(date);
  return value >= period.start && value < period.end;
}

export function countClicksInPeriod(
  visits: VisitRecord[],
  period: PeriodBounds,
): number {
  return visits.filter((visit) =>
    isWithinPeriod(visit.createdAt, period),
  ).length;
}

export function getActiveLinksInPeriod(
  links: LinkRecord[],
  period: PeriodBounds,
): LinkRecord[] {
  return links.filter((link) => {
    const createdAt = new Date(link.createdAt);
    if (createdAt >= period.end) return false;

    if (link.expiresAt && new Date(link.expiresAt) <= period.start) {
      return false;
    }

    return true;
  });
}

/** Clicks per active link, expressed as a percentage. */
export function calculateClickThroughRate(
  visits: VisitRecord[],
  links: LinkRecord[],
  period: PeriodBounds,
): number {
  const activeLinks = getActiveLinksInPeriod(links, period);
  if (activeLinks.length === 0) return 0;

  const activeLinkIds = new Set(activeLinks.map((link) => link.id));
  const clicksInPeriod = visits.filter(
    (visit) =>
      activeLinkIds.has(visit.linkID) &&
      isWithinPeriod(visit.createdAt, period),
  ).length;

  return (clicksInPeriod / activeLinks.length) * 100;
}

/** Relative percent change for count metrics such as total clicks. */
export function calculatePeriodChangePercent(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/** Absolute change in percentage points for CTR comparisons. */
export function calculateCtrPeriodChange(
  currentCtr: number,
  previousCtr: number,
): number {
  return currentCtr - previousCtr;
}

export function formatPeriodChangePercent(
  current: number,
  previous: number,
): string {
  const change = calculatePeriodChangePercent(current, previous);
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function formatCtrPercent(ctr: number): string {
  return `${ctr.toFixed(1)}%`;
}

export function formatCtrPeriodChange(
  currentCtr: number,
  previousCtr: number,
): string {
  const change = calculateCtrPeriodChange(currentCtr, previousCtr);
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function isPeriodGrowing(current: number, previous: number): boolean {
  if (previous === 0) return current > 0;
  return current >= previous;
}

export function computeClickMetrics(
  visits: VisitRecord[],
  links: LinkRecord[],
  referenceDate = new Date(),
): ClickMetrics {
  const { current, previous } = getMonthPeriods(referenceDate);

  const thisMonthClicks = countClicksInPeriod(visits, current);
  const lastMonthClicks = countClicksInPeriod(visits, previous);
  const thisMonthCtr = calculateClickThroughRate(visits, links, current);
  const lastMonthCtr = calculateClickThroughRate(visits, links, previous);

  return {
    totalClicks: visits.length,
    thisMonthClicks,
    lastMonthClicks,
    clicksChangePercent: calculatePeriodChangePercent(
      thisMonthClicks,
      lastMonthClicks,
    ),
    clickThroughRate: thisMonthCtr,
    thisMonthCtr,
    lastMonthCtr,
    ctrChangePoints: calculateCtrPeriodChange(thisMonthCtr, lastMonthCtr),
  };
}
