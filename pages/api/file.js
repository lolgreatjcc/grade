import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';

export default async function POST(req, res) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token || !token.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const auth = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_OAUTHCLIENTID,
      process.env.NEXT_PUBLIC_OAUTHCLIENTSECRET
    );

    auth.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expiry_date: token.expiresAt
        ? (token.expiresAt) * 1000
        : undefined,
    });

    const drive = google.drive({ version: 'v3', auth });
    const fileId = req.body.fileId;

    const metadata = await drive.files.get({
      fileId: fileId,
      fields: 'name, mimeType',
    });

    const name = metadata.data.name;
    const mimeType = metadata.data.mimeType;
  
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const data = `data:${mimeType};base64,${Buffer.from(response.data).toString('base64')}`;
    

    return res.status(200).json({ data, name, mimeType });
  } catch (error) {
    console.log(error);
    console.error('Error fetching file:', error);
    return res.status(500).json(
      { error: 'Failed to fetch file' },
    );
  }
}
