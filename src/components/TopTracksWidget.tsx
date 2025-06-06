import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLastfm } from 'react-icons/fa';

interface Track {
  name: string;
  artist: string;
  playcount: string;
  url: string;
}

interface TopTracksWidgetProps {
  period: '7day' | '1month';
  title: string;
}

const TopTracksWidget: React.FC<TopTracksWidgetProps> = ({ period, title }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/lastfm/top-tracks?period=${period}&limit=5`);
        const data = await response.json();
        
        if (Array.isArray(data.tracks)) {
          setTracks(data.tracks);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, [period]);

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-300 bg-[#f8f8f8]">
        {/* Header */}
        <div className="p-2 flex items-center justify-between border-b border-gray-300 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
          <div className="font-mono text-sm tracking-wider text-gray-600 flex items-center gap-2">
            {title}
          </div>
          <div className="flex space-x-1">
            <button className="w-3 h-3 rounded-sm bg-gray-300 hover:bg-gray-400" />
            <button className="w-3 h-3 rounded-sm bg-gray-300 hover:bg-gray-400" />
            <button className="w-3 h-3 bg-[#ff3b30] hover:bg-[#ff6961] rounded-sm" />
          </div>
        </div>

        {/* Content */}
        <div className="h-[250px] overflow-y-auto scrollbar bg-white">
          {isLoading ? (
            <div className="font-mono text-sm p-4 text-gray-600">Loading tracks...</div>
          ) : error || !tracks.length ? (
            <div className="font-mono text-sm p-4 text-gray-600">No tracks available</div>
          ) : (
            <div className="space-y-px">
              {tracks.map((track, index) => (
                <motion.div
                  key={`${track.name}-${track.artist}-${index}`}
                  className="block p-3 font-mono text-sm cursor-pointer border-b border-gray-100 group text-gray-600 hover:bg-gray-50"
                  onClick={() => window.open(track.url, '_blank')}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-[#d51007] w-6 text-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{track.artist} - {track.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {track.playcount} plays
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
    </motion.div>
  );
};

export default TopTracksWidget;