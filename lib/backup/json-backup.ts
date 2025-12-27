// lib/backup/json-backup.ts
import { prisma } from '@/lib/db/prisma';
import fs from 'fs/promises';
import path from 'path';

export interface BackupData {
  projects: any[];
  experiences: any[];
  education: any[];
  certifications: any[];
  volunteer: any[];
  timestamp: string;
  version: string;
}

export class JsonBackupService {
  private static readonly BACKUP_DIR = path.join(process.cwd(), 'data', 'backup');
  private static readonly CURRENT_FILE = 'current-data.json';
  private static readonly VERSION = '1.0.0';

  /**
   * Export all portfolio data to JSON backup
   */
  static async exportToJson(): Promise<void> {
    try {
      console.log('Starting JSON backup...');

      // Ensure backup directory exists
      await fs.mkdir(this.BACKUP_DIR, { recursive: true });

      // Fetch all data from database
      const [projects, experiences, education, certifications, volunteer] = await Promise.all([
        prisma.project.findMany({ orderBy: { order: 'asc' } }),
        prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        prisma.education.findMany({ orderBy: { order: 'asc' } }),
        prisma.certification.findMany({ orderBy: { order: 'asc' } }),
        prisma.volunteer.findMany({ orderBy: { order: 'asc' } }),
      ]);

      // Create backup data object
      const backupData: BackupData = {
        projects,
        experiences,
        education,
        certifications,
        volunteer,
        timestamp: new Date().toISOString(),
        version: this.VERSION,
      };

      // Save to current data file
      const currentFilePath = path.join(this.BACKUP_DIR, this.CURRENT_FILE);
      await fs.writeFile(
        currentFilePath,
        JSON.stringify(backupData, null, 2),
        'utf-8'
      );

      // Also save timestamped backup
      const timestamp = new Date().toISOString().replace(/[:]/g, '-').replace(/\..+/, '');
      const timestampedFilePath = path.join(this.BACKUP_DIR, `backup-${timestamp}.json`);
      await fs.writeFile(
        timestampedFilePath,
        JSON.stringify(backupData, null, 2),
        'utf-8'
      );

      console.log('✅ JSON backup completed successfully');
      console.log(`📁 Saved to: ${currentFilePath}`);
      console.log(`📁 Timestamped backup: ${timestampedFilePath}`);
    } catch (error) {
      console.error('❌ JSON backup failed:', error);
      throw error;
    }
  }

  /**
   * Load data from JSON backup
   */
  static async loadFromJson(): Promise<BackupData | null> {
    try {
      const currentFilePath = path.join(this.BACKUP_DIR, this.CURRENT_FILE);
      const fileContent = await fs.readFile(currentFilePath, 'utf-8');
      return JSON.parse(fileContent) as BackupData;
    } catch (error) {
      console.error('Failed to load JSON backup:', error);
      return null;
    }
  }

  /**
   * Get data with fallback to JSON if database is unavailable
   */
  static async getDataWithFallback(dataType: keyof Omit<BackupData, 'timestamp' | 'version'>) {
    try {
      // Try to get from database first
      const dbData = await prisma[dataType].findMany({ orderBy: { order: 'asc' } });
      if (dbData && dbData.length > 0) {
        return { data: dbData, source: 'database' };
      }
    } catch (error) {
      console.warn(`Database read failed for ${dataType}, falling back to JSON:`, error);
    }

    // Fallback to JSON backup
    const backupData = await this.loadFromJson();
    if (backupData && backupData[dataType]) {
      return { data: backupData[dataType], source: 'json-backup' };
    }

    return { data: [], source: 'none' };
  }

  /**
   * Clean old backup files (keep only last 10)
   */
  static async cleanOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.BACKUP_DIR);
      const backupFiles = files
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .sort()
        .reverse();

      // Keep only the last 10 backups
      const filesToDelete = backupFiles.slice(10);
      for (const file of filesToDelete) {
        await fs.unlink(path.join(this.BACKUP_DIR, file));
      }

      if (filesToDelete.length > 0) {
        console.log(`🗑️  Cleaned ${filesToDelete.length} old backup files`);
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }
}