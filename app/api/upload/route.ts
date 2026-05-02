// app/api/upload/route.ts
// Admin-only endpoint to upload images to Cloudinary.
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/middleware';
import { cloudinary } from '@/lib/server/cloudinary';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/upload
 * Uploads an image file to Cloudinary.
 * Requires admin authentication.
 * Body: multipart/form-data with a `file` field.
 * Returns: { url: string, publicId: string }
 */
export async function POST(request: NextRequest) {
  // 1. Verify admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'Fichier manquant ou invalide' },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 5MB)' },
        { status: 413 }
      );
    }

    // 5. Read buffer and validate magic bytes (defend against MIME spoofing)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 4));
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    const validMagic =
      hex.startsWith('ffd8ff') ||      // JPEG
      hex.startsWith('89504e47') ||    // PNG
      hex.startsWith('52494646') ||    // WebP (RIFF)
      hex.startsWith('47494638');      // GIF
    if (!validMagic) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 });
    }

    // 6. Convert to base64 data URI
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // 7. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio',
      format: 'webp',
      quality: 85,
      resource_type: 'image',
    });

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Erreur upload' },
      { status: 500 }
    );
  }
}
