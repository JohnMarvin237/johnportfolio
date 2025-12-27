// app/api/admin/backup/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { JsonBackupService } from '@/lib/backup/json-backup';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
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

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
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