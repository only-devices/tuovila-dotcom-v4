import { NextResponse } from 'next/server';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME || 'only-devices';

interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

interface LastFmTrack {
  name: string;
  artist: {
    '#text': string;
  };
  album: {
    '#text': string;
  };
  date?: {
    '#text': string;
    uts: string;
  };
  image: LastFmImage[];
  url: string;
}

interface LastFmResponse {
  recenttracks: {
    track: LastFmTrack[];
  };
}

export async function GET() {
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=50`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Last.fm data');
    }

    const data = (await response.json()) as LastFmResponse;
    const tracks = data.recenttracks.track.map((track: LastFmTrack) => ({
      name: track.name,
      artist: track.artist['#text'],
      album: track.album['#text'],
      date: track.date?.['#text'] || 'Now Playing',
      timestamp: track.date?.uts || null,
      image: track.image.find((img) => img.size === 'large')?.['#text'] || track.image[0]?.['#text'],
      url: track.url
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
} 