// src/app/api/lastfm/top-artists/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

interface LastFmArtist {
  name: string;
  playcount: string;
  url: string;
  image: LastFmImage[];
}

interface LastFmTopArtistsResponse {
  topartists: {
    artist: LastFmArtist[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7day';
  const limit = searchParams.get('limit') || '50';

  const API_KEY = process.env.LASTFM_API_KEY;
  const USERNAME = process.env.LASTFM_USERNAME;

  if (!API_KEY || !USERNAME) {
    return NextResponse.json({ error: 'Last.fm credentials not configured' }, { status: 500 });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&format=json&period=${period}&limit=${limit}`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Last.fm API');
    }

    const data = (await response.json()) as LastFmTopArtistsResponse;

    const artists = data.topartists?.artist?.map((artist: LastFmArtist) => ({
      name: artist.name,
      playcount: artist.playcount,
      url: artist.url,
      image: artist.image.find((img) => img.size === 'large')?.['#text'] || artist.image[0]?.['#text'],
    })) || [];

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}