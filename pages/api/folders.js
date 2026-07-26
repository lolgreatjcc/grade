import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';

async function fetchFolderContents(
  drive, extensions = ['pdf'], folderId = 'root'
) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, fileExtension, size, iconLink)',
  });

  const items = await Promise.all(
    response.data.files.filter(file => (extensions.includes(file.fileExtension) || file.mimeType === 'application/vnd.google-apps.folder'))
    .map(async (file) => {
      const item = {
        id: file.id,
        name: file.name,
        type:
          file.mimeType === 'application/vnd.google-apps.folder'
            ? 'folder'
            : 'file',
        extension: file.fileExtension,
        size: file.size,
        icon: file.iconLink,
      };

      // if (item.type === 'folder') {
      //   item.children = await fetchFolderContents(drive, file.id);
      // }

      return item;
    })
  );
  console.log(items);
  return items;
}

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
    const extensions = req.body.extensions;
    const folderId = req.body.folderId || 'root';
    const structure = await fetchFolderContents(drive, extensions, folderId);

    return res.status(200).json({ "structure": structure });
  } catch (error) {
    console.log(error);
    console.error('Error fetching folder structure:', error);
    return res.status(500).json(
      { error: 'Failed to fetch folder structure' },
    );
  }
}
