'use client';

import React from 'react';
import { ShortURL } from '../../types';

export default function URLList() {
  // TODO: Fetch user's shortened URLs
  const urls: ShortURL[] = [];

  return (
    <div>
      <h2>Your Shortened URLs</h2>
      <ul>
        {urls.map((url) => (
          <li key={url.id}>
            {url.originalURL} - {url.shortCode} - Clicks: {url.clicks}
          </li>
        ))}
      </ul>
    </div>
  );
}