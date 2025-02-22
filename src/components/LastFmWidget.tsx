import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLastfm } from 'react-icons/fa';
import Image from 'next/image';

interface Track {
  name: string;
  artist: string;
  album?: string;
  date: string;
  image?: string;
  url?: string;
}

const LastFmWidget: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/lastfm');
        const data = await response.json();
        
        // Verify that data.tracks exists and is an array
        if (Array.isArray(data.tracks)) {
          setTracks(data.tracks);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching Last.fm data:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-300 bg-[#f8f8f8] w-full">
        {/* Header */}
        <div className="p-2 flex items-center justify-between border-b border-gray-300 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
          <div className="font-mono text-sm tracking-wider text-gray-600 flex items-center gap-2">
            <FaLastfm className="text-[#d51007]" />
            Recent Tracks
          </div>
          <div className="flex space-x-1">
            <button className="w-3 h-3 rounded-sm bg-gray-300 hover:bg-gray-400" />
            <button className="w-3 h-3 rounded-sm bg-gray-300 hover:bg-gray-400" />
            <button className="w-3 h-3 bg-[#ff3b30] hover:bg-[#ff6961] rounded-sm" />
          </div>
        </div>

        {/* Playlist */}
        <div className="h-[600px] overflow-y-auto scrollbar bg-white">
          {isLoading ? (
            <div className="font-mono text-sm p-4 text-gray-600">Loading tracks...</div>
          ) : error || !tracks.length ? (
            <div className="font-mono text-sm p-4 text-gray-600">No tracks available</div>
          ) : (
            <div className="space-y-px min-w-full">
              {tracks.slice(0, 50).map((track) => (
                <motion.div
                  key={`${track.name}-${track.date}`}
                  className={`block p-3 font-mono text-sm cursor-pointer border-b border-gray-100 group text-gray-600 hover:bg-gray-50`}
                  onClick={() => {
                    window.open(track.url || `https://www.last.fm/user/only-devices`, '_blank');
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {track.image ? (
                        <Image
                          src={track.image}
                          alt={`${track.name} album art`}
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <FaLastfm className="text-gray-400 w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{track.artist} - {track.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="truncate">{track.album}</span>
                        <span className="mx-2">•</span>
                        <span>{track.date}</span>
                      </div>
                    </div>
                    <FaLastfm className="text-[#d51007] ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 4px;
        }
        
        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </motion.div>
  );
};

export default LastFmWidget; 