import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { create } from '@/mocks/services';
import type { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  bookingId: string;
  revieweeId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookingId, revieweeId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleStarClick = (value: number) => {
    setRating(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !user) {
      setError('Please provide a rating.');
      return;
    }
    const review: Review = {
      id: crypto.randomUUID(),
      bookingId,
      reviewerId: user.id,
      revieweeId,
      rating,
      comment: comment || undefined,
      createdAt: new Date(),
    };
    create('reviews', review);
    router.refresh();
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">Leave a Review</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`h-6 w-6 cursor-pointer ${
              value <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => handleStarClick(value)}
          />
        ))}
      </div>
      <div>
        <label htmlFor="comment" className="block font-medium">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          rows={3}
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
};

export default ReviewForm;
