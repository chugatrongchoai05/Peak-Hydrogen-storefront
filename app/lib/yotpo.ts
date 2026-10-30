export type YotpoReview = {
  id: number;
  score: number;
  title: string;
  content: string;
  createdAt: string;
  verifiedBuyer: boolean;
  author: string;
};

export type YotpoSummary = { averageScore: number; totalReviews: number };

type RawReview = {
  id: number;
  score: number;
  title?: string;
  content?: string;
  created_at: string;
  verified_buyer?: boolean;
  user?: { display_name?: string };
};

type RawResponse = {
  response?: {
    bottomline?: { average_score?: number; total_review?: number };
    reviews?: RawReview[];
  };
};

export function siteReviewsUrl(appKey: string, perPage = 20) {
  return `https://api-cdn.yotpo.com/v1/widget/${encodeURIComponent(
    appKey,
  )}/products/yotpo_site_reviews/reviews.json?per_page=${perPage}&page=1`;
}

export function mapYotpoResponse(
  json: RawResponse,
  opts: { limit: number; minScore: number },
) {
  const body = json?.response;

  const reviews: YotpoReview[] = (body?.reviews ?? [])
    .filter((r) => r.score >= opts.minScore && r.content?.trim())
    .slice(0, opts.limit)
    .map((r) => ({
      id: r.id,
      score: r.score,
      title: r.title?.trim() ?? '',
      content: r.content?.trim() ?? '',
      createdAt: r.created_at,
      verifiedBuyer: Boolean(r.verified_buyer),
      author: r.user?.display_name?.trim() || 'Customer',
    }));

  const b = body?.bottomline;
  const summary: YotpoSummary | null =
    b?.average_score && b?.total_review
      ? {
        averageScore: Math.round(b.average_score * 10) / 10,
        totalReviews: b.total_review,
      }
      : null;

  return { reviews, summary };
}