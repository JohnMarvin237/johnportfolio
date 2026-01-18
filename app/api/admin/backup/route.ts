// app/api/admin/backup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import { JsonBackupService } from '@/lib/backup/json-backup';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Run backup
    await JsonBackupService.exportToJson();

    // Clean old backups
    await JsonBackupService.cleanOldBackups();

    return NextResponse.json({
      success: true,
      message: 'Backup completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Load current backup
    const backupData = await JsonBackupService.loadFromJson();

    if (!backupData) {
      return NextResponse.json(
        { error: 'No backup found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      backup: backupData,
    });
  } catch (error) {
    console.error('Backup read error:', error);
    return NextResponse.json(
      { error: 'Failed to read backup' },
      { status: 500 }
    );
  }
}