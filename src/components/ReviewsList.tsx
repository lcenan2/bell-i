// src/components/ReviewsList.tsx
import { Stars } from "./Stars";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

export type Review = {
  id: string;
  comment: string;
  taste: number;
  price: number;
  location: number;
  environment: number;
  createdAt: any;
  userId?: string;
  username?: string;
};

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  // Filter reviews that have comments
  const reviewsWithComments = reviews.filter(r => r.comment && r.comment.trim() !== "");

  const getOverallRating = (review: Review) => {
    return ((review.taste + review.price + review.location + review.environment) / 4).toFixed(1);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const getDisplayName = (review: Review) => {
    return review.username || "Anonymous";
  };

  const getInitial = (review: Review) => {
    if (review.username) {
      return review.username.charAt(0).toUpperCase();
    }
    return "A";
  };

  return (
    <Card>
      <CardHeader className="!grid-rows-[auto]">
        <div>
          <CardTitle>Reviews</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {reviewsWithComments.length} review{reviewsWithComments.length === 1 ? "" : "s"}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {reviewsWithComments.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {reviewsWithComments.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                      {getInitial(review)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getDisplayName(review)}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <span className="text-yellow-600">{getOverallRating(review)}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
