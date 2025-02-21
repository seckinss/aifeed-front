'use client';

import { useEffect, useState, Suspense } from 'react';
import { Tweet } from 'react-tweet';
import { Card, CardContent } from "@/components/ui/card";

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
        fill="currentColor" />
    </svg>
  );
}

function TweetLoading() {
  return (
    <Card className="w-full h-[200px] bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
      <CardContent className="p-2">
        <div className="animate-pulse text-gray-400">Loading tweet...</div>
      </CardContent>
    </Card>
  )
}

function TweetCard({ id }: { id: string }) {
  return (
    <Card className="break-inside-avoid mb-6 group w-full bg-gray-800/50 backdrop-blur-xl border-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/5">
      <CardContent className="p-2">
        <Suspense fallback={<TweetLoading />}>
          <Tweet id={id} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export default function Component() {
  const [tweetIds, setTweetIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTweets() {
      try {
        const res = await fetch('/api/tweets', { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch tweet IDs');
        const data = await res.json();
        setTweetIds(data.tweets.reverse() || []);
      } catch (error) {
        console.log('Error fetching tweets:', error);
        setTweetIds([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTweets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container px-4 py-6 mx-auto max-w-7xl relative">
        <a
          href="https://x.com/xAI"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XIcon />
        </a>

        <div className="space-y-2 text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AIFeed
          </h1>
          <p className="text-gray-400 max-w-[600px] mx-auto">
            Only AI generated tweets.
          </p>
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Loading tweets...</p>
            </div>
          ) : tweetIds.length > 0 ? (
            tweetIds.map((id) => (
              id && <TweetCard key={id} id={id} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No tweets to display, you may have got rate limited.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}