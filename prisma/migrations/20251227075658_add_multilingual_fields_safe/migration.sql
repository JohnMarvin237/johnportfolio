-- AlterTable
ALTER TABLE "certifications" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_fr" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_fr" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "education" ADD COLUMN     "degree_en" TEXT,
ADD COLUMN     "degree_fr" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_fr" TEXT,
ADD COLUMN     "field_en" TEXT,
ADD COLUMN     "field_fr" TEXT,
ADD COLUMN     "note_en" TEXT,
ADD COLUMN     "note_fr" TEXT,
ALTER COLUMN "degree" DROP NOT NULL;

-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "achievements_en" TEXT[],
ADD COLUMN     "achievements_fr" TEXT[],
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_fr" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_fr" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_fr" TEXT,
ADD COLUMN     "longDesc_en" TEXT,
ADD COLUMN     "longDesc_fr" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_fr" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "volunteer" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_fr" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_fr" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
