"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Trash2, Edit2 } from "lucide-react";

export default function ProductReviews({ productId, initialAvgRating, initialReviewCount }: { productId: string, initialAvgRating: number, initialReviewCount: number }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [avgRating, setAvgRating] = useState(initialAvgRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
        if (data.length > 0) {
          const sum = data.reduce((acc: number, cur: any) => acc + cur.rating, 0);
          setAvgRating(Math.round((sum / data.length) * 10) / 10);
          setReviewCount(data.length);
        } else {
          setAvgRating(0);
          setReviewCount(0);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const url = editingReviewId ? `/api/reviews/${editingReviewId}` : `/api/reviews`;
      const method = editingReviewId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, comment })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
      } else {
        setRating(0);
        setTitle("");
        setComment("");
        setEditingReviewId(null);
        fetchReviews(); // Refresh
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (review: any) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-16 border-t border-coffee-100 pt-10">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl font-bold text-coffee-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${s <= Math.floor(avgRating) ? "fill-gold text-gold" : "fill-coffee-100 text-coffee-100"}`}
                />
              ))}
            </div>
            <span className="font-bold text-coffee-900 text-xl">{avgRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-coffee-500 mt-1">Based on {reviewCount} reviews</p>
        </div>

        {session?.user && (
          <div className="w-full md:w-1/2 bg-coffee-50 p-6 rounded-2xl" id="review-form">
            <h3 className="font-serif text-xl font-bold text-coffee-900 mb-4">
              {editingReviewId ? "Edit your review" : "Write a Review"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                  >
                    <Star className={`w-8 h-8 transition-colors ${s <= (hoverRating || rating) ? "fill-gold text-gold" : "fill-coffee-200 text-coffee-200"}`} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Review Title"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white"
              />
              <textarea
                placeholder="Share your experience with this coffee..."
                required
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-coffee-900 text-white rounded-xl font-bold hover:bg-coffee-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setRating(0); setTitle(""); setComment("");
                    }}
                    className="px-6 py-3 border border-coffee-200 text-coffee-700 rounded-xl font-bold hover:bg-coffee-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        {!session?.user && (
          <div className="w-full md:w-1/3 bg-cream p-6 rounded-2xl text-center">
            <h3 className="font-serif text-lg font-bold text-coffee-900 mb-2">Review this product</h3>
            <p className="text-coffee-600 mb-4 text-sm">Please log in to share your thoughts with other coffee lovers.</p>
            <a href={`/login?redirect=/products/${productId}`} className="inline-block px-6 py-2 bg-coffee-900 text-white rounded-xl font-bold">Log In</a>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-coffee-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-coffee-500 italic">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-coffee-100 rounded-full flex items-center justify-center font-bold text-coffee-800">
                    {review.userId?.firstName?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-coffee-900 text-sm">{review.userId?.firstName} {review.userId?.lastName}</p>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">Verified Buyer</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-coffee-400">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="sm:w-3/4">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-gold text-gold" : "fill-coffee-100 text-coffee-100"}`} />
                  ))}
                </div>
                <h4 className="font-bold text-coffee-900 mb-2">{review.title}</h4>
                <p className="text-coffee-600 text-sm leading-relaxed">{review.comment}</p>
                
                {session?.user && ((session.user as any).id === review.userId?._id || (session.user as any).role === "admin") && (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => handleEditClick(review)} className="text-xs font-bold text-coffee-500 hover:text-coffee-900 flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
