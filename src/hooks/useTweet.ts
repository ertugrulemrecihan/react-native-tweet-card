import { useCallback, useEffect, useState } from 'react';
import { getTweet } from '../api/get-tweet';
import type { Tweet } from '../api/types/index';

export interface UseTweetResult {
  data: Tweet | undefined;
  error: Error | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useTweet(
  id: string | null,
  fetchOptions?: RequestInit,
): UseTweetResult {
  const [data, setData] = useState<Tweet | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTweet = useCallback(async () => {
    if (!id) {
      setData(undefined);
      setError(undefined);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(undefined);
    try {
      const tweet = await getTweet(id, fetchOptions);
      setData(tweet ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet]);

  return { data, error, isLoading, refetch: fetchTweet };
}
