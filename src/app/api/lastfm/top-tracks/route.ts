// src/app/api/lastfm/top-tracks/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface LastFmTrackArtist {
  name: string;
}

interface LastFmTopTrack {
  name: string;
  artist: LastFmTrackArtist;
  playcount: string;
  url: string;
}

interface LastFmTopTracksResponse {
  toptracks: {
    track: LastFmTopTrack[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7day';
  const limit = searchParams.get('limit') || '5';

  const API_KEY = process.env.LASTFM_API_KEY;
  const USERNAME = process.env.LASTFM_USERNAME;

  if (!API_KEY || !USERNAME) {
    return NextResponse.json({ error: 'Last.fm credentials not configured' }, { status: 500 });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&format=json&period=${period}&limit=${limit}`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Last.fm API');
    }

    const data = (await response.json()) as LastFmTopTracksResponse;

    const tracks = data.toptracks?.track?.map((track: LastFmTopTrack) => {
      
      return {
        name: track.name,
        artist: track.artist.name,
        playcount: track.playcount,
        url: track.url
      };
    }) || [];

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 });
  }
}