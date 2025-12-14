// src/components/RatingForm.tsx
import { useMemo, useState, FormEvent, useEffect } from "react";
import { Stars } from "./Stars";
import { Input } from "./Input";
import { Button } from "./Button";

export type RatingValues = {
  taste: number;
  price: number;
  location: number;
  environment: number;
  comment: string;
};

export default function RatingForm({
  onSubmit,
  busy = false,
  initialValues,
  isEditing = false,
  isLoggedIn = false,
}: {
  onSubmit: (values: RatingValues) => Promise<void> | void;
  busy?: boolean;
  initialValues?: RatingValues;
  isEditing?: boolean;
  isLoggedIn?: boolean;
}) {
  const [vals, setVals] = useState<RatingValues>(
    initialValues || {
      taste: 0,
      price: 0,
      location: 0,
      environment: 0,
      comment: "",
    }
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setVals(initialValues);
    }
  }, [initialValues]);

  const overall = useMemo(() => {
    const { taste, price, location, environment } = vals;
    const filled = [taste, price, location, environment].filter(Boolean);
    return filled.length ? ((taste + price + location + environment) / 4).toFixed(1) : "0.0";
  }, [vals]);

  const disabled =
    !vals.taste || !vals.price || !vals.location || !vals.environment || busy || (!isLoggedIn && hasSubmitted);

  function setField<K extends keyof RatingValues>(k: K, v: RatingValues[K]) {
    setVals((x) => ({ ...x, [k]: v }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(vals);
    // Mark as submitted for logged-out users
    if (!isLoggedIn) {
      setHasSubmitted(true);
    } else {
      // Reset form for logged-in users
      setVals({ taste: 0, price: 0, location: 0, environment: 0, comment: "" });
    }
  }

  const isFormDisabled = !isLoggedIn && hasSubmitted;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="divide-y">
        <div className="py-2 flex items-center justify-between gap-4">
          <span className="w-32 text-sm text-gray-700">Taste</span>
          <div className="star-wrapper">
            <Stars rating={vals.taste} interactive={!isFormDisabled} onRatingChange={(v) => setField("taste", v)} />
          </div>
        </div>
        <div className="py-2 flex items-center justify-between gap-4">
          <span className="w-32 text-sm text-gray-700">Price</span>
          <div className="star-wrapper">
            <Stars rating={vals.price} interactive={!isFormDisabled} onRatingChange={(v) => setField("price", v)} />
          </div>
        </div>
        <div className="py-2 flex items-center justify-between gap-4">
          <span className="w-32 text-sm text-gray-700">Location</span>
          <div className="star-wrapper">
            <Stars rating={vals.location} interactive={!isFormDisabled} onRatingChange={(v) => setField("location", v)} />
          </div>
        </div>
        <div className="py-2 flex items-center justify-between gap-4">
          <span className="w-32 text-sm text-gray-700">Environment</span>
          <div className="star-wrapper">
            <Stars rating={vals.environment} interactive={!isFormDisabled} onRatingChange={(v) => setField("environment", v)} />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Comments (optional)</label>
        <textarea
          className="min-h-[90px] w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="What did you like or dislike?"
          value={vals.comment}
          onChange={(e) => setField("comment", e.target.value)}
          disabled={isFormDisabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Overall: {overall}/5</p>
        <Button disabled={disabled}>
          {!isLoggedIn && hasSubmitted 
            ? "Sent" 
            : busy 
              ? (initialValues ? "Updating…" : "Submitting…") 
              : (initialValues ? "Update rating" : "Submit rating")
          }
        </Button>
      </div>
    </form>
  );
}
