-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "TeamSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FREE', 'FREEMIUM', 'SUBSCRIPTION', 'PAY_PER_USE', 'ENTERPRISE', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('SIMPLE', 'MODERATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ToolStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_REVIEW', 'REJECTED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "TasksStep" AS ENUM ('TARGET', 'ASSESS', 'SAMPLE', 'KNOWLEDGE', 'SELECT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('DISCOVERY', 'REVIEW', 'USAGE', 'SOCIAL', 'LEARNING', 'SPECIAL_EVENT');

-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TEXT', 'BOOLEAN', 'SCALE', 'MULTI_SELECT');

-- CreateEnum
CREATE TYPE "HuntType" AS ENUM ('TOOL_DISCOVERY', 'CATEGORY_EXPLORATION', 'FEATURE_HUNT', 'CHALLENGE_HUNT');

-- CreateEnum
CREATE TYPE "HuntDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "HuntStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "VaultStatus" AS ENUM ('SAVED', 'TRYING', 'USING', 'COMPLETED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('TOOL_VIEW', 'TOOL_SAVE', 'TOOL_REVIEW', 'CHALLENGE_START', 'CHALLENGE_COMPLETE', 'HUNT_START', 'HUNT_COMPLETE', 'SESSION_START', 'SESSION_COMPLETE', 'QUIZ_COMPLETE', 'LOGIN', 'SIGNUP', 'UPGRADE', 'CUR8_REWARD_MINTED');

-- CreateEnum
CREATE TYPE "TrendingPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'TEAM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WELCOME', 'CHALLENGE_COMPLETE', 'HUNT_COMPLETE', 'TROPHY_EARNED', 'LEVEL_UP', 'REVIEW_LIKE', 'TOOL_TRENDING', 'SUBSCRIPTION_RENEWAL', 'PAYMENT_FAILED', 'FEATURE_UPDATE');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MintStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "worldcoinId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "username" TEXT,
    "walletAddress" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userType" "UserType" NOT NULL DEFAULT 'INDIVIDUAL',
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'BEGINNER',
    "interests" TEXT[],
    "region" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "preferences" JSONB,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "proofPoints" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "badges" TEXT[],
    "streak" INTEGER NOT NULL DEFAULT 0,
    "hasCompletedQuiz" BOOLEAN NOT NULL DEFAULT false,
    "hasMintedBadge" BOOLEAN NOT NULL DEFAULT false,
    "badgeTransactionId" TEXT,
    "badgeMintedAt" TIMESTAMP(3),
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
    "subscriptionEndDate" TIMESTAMP(3),
    "trialUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "pricingModel" "PricingModel" NOT NULL,
    "pricingDetails" TEXT NOT NULL,
    "freeTier" BOOLEAN NOT NULL DEFAULT false,
    "startingPrice" DOUBLE PRECISION,
    "features" TEXT[],
    "useCases" TEXT[],
    "complexity" "Complexity" NOT NULL,
    "targetAudience" TEXT[],
    "integrations" TEXT[],
    "apiAvailable" BOOLEAN NOT NULL DEFAULT false,
    "mobileApp" BOOLEAN NOT NULL DEFAULT false,
    "browserExtension" BOOLEAN NOT NULL DEFAULT false,
    "compliance" TEXT[],
    "security" JSONB,
    "dataRetention" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "monthlyUsers" INTEGER,
    "website" TEXT NOT NULL,
    "signupUrl" TEXT,
    "demoUrl" TEXT,
    "documentationUrl" TEXT,
    "supportUrl" TEXT,
    "logo" TEXT,
    "screenshots" TEXT[],
    "videoUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "isRegionSpecific" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "launchDate" TIMESTAMP(3),
    "lastUpdate" TIMESTAMP(3),
    "addedBy" TEXT,
    "verifiedBy" TEXT,
    "status" "ToolStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "currentStep" "TasksStep" NOT NULL DEFAULT 'TARGET',
    "userType" "UserType",
    "userGoal" TEXT,
    "refinedGoal" TEXT,
    "constraints" JSONB,
    "recommendationsData" JSONB,
    "finalPick" TEXT,
    "proofPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "completionTime" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "satisfaction" INTEGER,
    "department" TEXT,
    "objectives" TEXT[],
    "budgetRange" TEXT,
    "integrationNeeds" TEXT[],
    "complianceReqs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "agent_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "step" "TasksStep",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_recommendations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "compatibilityScore" INTEGER NOT NULL,
    "reasoning" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "enterpriseScore" INTEGER,
    "securityScore" INTEGER,
    "scalabilityScore" INTEGER,
    "roiProjection" TEXT,
    "wasSelected" BOOLEAN NOT NULL DEFAULT false,
    "userFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "easeOfUse" INTEGER,
    "features" INTEGER,
    "valueForMoney" INTEGER,
    "support" INTEGER,
    "documentation" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "moderatedAt" TIMESTAMP(3),
    "moderationReason" TEXT,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "usageDuration" TEXT,
    "useCase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "isHelpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "type" "ChallengeType" NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL,
    "requirements" JSONB NOT NULL,
    "rules" JSONB,
    "proofPoints" INTEGER NOT NULL,
    "badgeId" TEXT,
    "additionalRewards" JSONB,
    "toolId" TEXT,
    "category" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "duration" INTEGER,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_challenges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "progress" JSONB NOT NULL,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastProgressAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proofPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "badgeEarned" TEXT,

    CONSTRAINT "user_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" JSONB,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "helpText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quiz_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "score" INTEGER,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "collectionId" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "VaultStatus" NOT NULL DEFAULT 'SAVED',
    "lastUsed" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "toolId" TEXT,
    "sessionId" TEXT,
    "challengeId" TEXT,
    "huntId" TEXT,
    "proofPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_usage" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "userId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "signups" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "week" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "source" TEXT,
    "userAgent" TEXT,
    "country" TEXT,

    CONSTRAINT "tool_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trending_tools" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "previousRank" INTEGER,
    "category" TEXT NOT NULL,
    "period" "TrendingPeriod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "viewsGrowth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsGrowth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savesGrowth" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "trending_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hunts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "HuntType" NOT NULL,
    "difficulty" "HuntDifficulty" NOT NULL,
    "toolId" TEXT,
    "category" TEXT,
    "objectives" JSONB NOT NULL,
    "hints" JSONB,
    "proofPoints" INTEGER NOT NULL,
    "badgeId" TEXT,
    "timeLimit" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hunts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hunts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "huntId" TEXT NOT NULL,
    "status" "HuntStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "progress" JSONB NOT NULL,
    "completionTime" INTEGER,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "proofPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "badgeEarned" TEXT,

    CONSTRAINT "user_hunts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "department" TEXT,
    "industry" TEXT,
    "teamSize" "TeamSize",
    "budget" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "features" JSONB NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "code" TEXT NOT NULL,
    "email" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "referrerReward" INTEGER NOT NULL DEFAULT 0,
    "referredReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trophies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trophyName" TEXT NOT NULL,
    "description" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trophies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_mints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL DEFAULT 'EdgeEsmeralda',
    "contractAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "blockNumber" TEXT,
    "status" "MintStatus" NOT NULL DEFAULT 'PENDING',
    "nullifierHash" TEXT,
    "userAddress" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'World Chain Sepolia',
    "mintedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "badge_mints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_worldcoinId_key" ON "users"("worldcoinId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_worldcoinId_idx" ON "users"("worldcoinId");

-- CreateIndex
CREATE INDEX "users_userType_idx" ON "users"("userType");

-- CreateIndex
CREATE INDEX "users_level_idx" ON "users"("level");

-- CreateIndex
CREATE INDEX "users_subscriptionStatus_idx" ON "users"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_hasMintedBadge_idx" ON "users"("hasMintedBadge");

-- CreateIndex
CREATE INDEX "users_hasCompletedQuiz_idx" ON "users"("hasCompletedQuiz");

-- CreateIndex
CREATE UNIQUE INDEX "ai_tools_name_key" ON "ai_tools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_tools_slug_key" ON "ai_tools"("slug");

-- CreateIndex
CREATE INDEX "ai_tools_category_idx" ON "ai_tools"("category");

-- CreateIndex
CREATE INDEX "ai_tools_complexity_idx" ON "ai_tools"("complexity");

-- CreateIndex
CREATE INDEX "ai_tools_pricingModel_idx" ON "ai_tools"("pricingModel");

-- CreateIndex
CREATE INDEX "ai_tools_rating_idx" ON "ai_tools"("rating");

-- CreateIndex
CREATE INDEX "ai_tools_popularity_idx" ON "ai_tools"("popularity");

-- CreateIndex
CREATE INDEX "ai_tools_isVerified_idx" ON "ai_tools"("isVerified");

-- CreateIndex
CREATE INDEX "ai_tools_isTrending_idx" ON "ai_tools"("isTrending");

-- CreateIndex
CREATE INDEX "ai_tools_status_idx" ON "ai_tools"("status");

-- CreateIndex
CREATE INDEX "ai_tools_name_idx" ON "ai_tools"("name");

-- CreateIndex
CREATE INDEX "ai_tools_slug_idx" ON "ai_tools"("slug");

-- CreateIndex
CREATE INDEX "agent_sessions_userId_idx" ON "agent_sessions"("userId");

-- CreateIndex
CREATE INDEX "agent_sessions_currentStep_idx" ON "agent_sessions"("currentStep");

-- CreateIndex
CREATE INDEX "agent_sessions_completed_idx" ON "agent_sessions"("completed");

-- CreateIndex
CREATE INDEX "agent_sessions_createdAt_idx" ON "agent_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "session_messages_sessionId_idx" ON "session_messages"("sessionId");

-- CreateIndex
CREATE INDEX "session_messages_createdAt_idx" ON "session_messages"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tool_recommendations_sessionId_toolId_key" ON "tool_recommendations"("sessionId", "toolId");

-- CreateIndex
CREATE INDEX "tool_reviews_toolId_idx" ON "tool_reviews"("toolId");

-- CreateIndex
CREATE INDEX "tool_reviews_rating_idx" ON "tool_reviews"("rating");

-- CreateIndex
CREATE INDEX "tool_reviews_isVerified_idx" ON "tool_reviews"("isVerified");

-- CreateIndex
CREATE INDEX "tool_reviews_createdAt_idx" ON "tool_reviews"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tool_reviews_userId_toolId_key" ON "tool_reviews"("userId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "review_votes_userId_reviewId_key" ON "review_votes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "challenges_type_idx" ON "challenges"("type");

-- CreateIndex
CREATE INDEX "challenges_difficulty_idx" ON "challenges"("difficulty");

-- CreateIndex
CREATE INDEX "challenges_isActive_idx" ON "challenges"("isActive");

-- CreateIndex
CREATE INDEX "challenges_startDate_idx" ON "challenges"("startDate");

-- CreateIndex
CREATE INDEX "challenges_toolId_idx" ON "challenges"("toolId");

-- CreateIndex
CREATE INDEX "user_challenges_status_idx" ON "user_challenges"("status");

-- CreateIndex
CREATE INDEX "user_challenges_completedAt_idx" ON "user_challenges"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_userId_challengeId_key" ON "user_challenges"("userId", "challengeId");

-- CreateIndex
CREATE INDEX "quiz_questions_category_idx" ON "quiz_questions"("category");

-- CreateIndex
CREATE INDEX "quiz_questions_order_idx" ON "quiz_questions"("order");

-- CreateIndex
CREATE INDEX "quiz_questions_isActive_idx" ON "quiz_questions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_results_userId_questionId_key" ON "user_quiz_results"("userId", "questionId");

-- CreateIndex
CREATE INDEX "user_vault_userId_idx" ON "user_vault"("userId");

-- CreateIndex
CREATE INDEX "user_vault_status_idx" ON "user_vault"("status");

-- CreateIndex
CREATE INDEX "user_vault_priority_idx" ON "user_vault"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "user_vault_userId_toolId_key" ON "user_vault"("userId", "toolId");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE INDEX "collections_isPublic_idx" ON "collections"("isPublic");

-- CreateIndex
CREATE INDEX "user_activities_userId_idx" ON "user_activities"("userId");

-- CreateIndex
CREATE INDEX "user_activities_activityType_idx" ON "user_activities"("activityType");

-- CreateIndex
CREATE INDEX "user_activities_createdAt_idx" ON "user_activities"("createdAt");

-- CreateIndex
CREATE INDEX "user_activities_toolId_idx" ON "user_activities"("toolId");

-- CreateIndex
CREATE INDEX "tool_usage_toolId_idx" ON "tool_usage"("toolId");

-- CreateIndex
CREATE INDEX "tool_usage_date_idx" ON "tool_usage"("date");

-- CreateIndex
CREATE INDEX "tool_usage_userId_idx" ON "tool_usage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tool_usage_toolId_date_userId_key" ON "tool_usage"("toolId", "date", "userId");

-- CreateIndex
CREATE INDEX "trending_tools_period_rank_idx" ON "trending_tools"("period", "rank");

-- CreateIndex
CREATE INDEX "trending_tools_category_idx" ON "trending_tools"("category");

-- CreateIndex
CREATE INDEX "trending_tools_score_idx" ON "trending_tools"("score");

-- CreateIndex
CREATE UNIQUE INDEX "trending_tools_toolId_period_date_key" ON "trending_tools"("toolId", "period", "date");

-- CreateIndex
CREATE INDEX "hunts_type_idx" ON "hunts"("type");

-- CreateIndex
CREATE INDEX "hunts_difficulty_idx" ON "hunts"("difficulty");

-- CreateIndex
CREATE INDEX "hunts_isActive_idx" ON "hunts"("isActive");

-- CreateIndex
CREATE INDEX "hunts_toolId_idx" ON "hunts"("toolId");

-- CreateIndex
CREATE INDEX "hunts_category_idx" ON "hunts"("category");

-- CreateIndex
CREATE INDEX "user_hunts_status_idx" ON "user_hunts"("status");

-- CreateIndex
CREATE INDEX "user_hunts_completedAt_idx" ON "user_hunts"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_hunts_userId_huntId_key" ON "user_hunts"("userId", "huntId");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_renewalDate_idx" ON "subscriptions"("renewalDate");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_providerId_idx" ON "payments"("providerId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_code_idx" ON "referrals"("code");

-- CreateIndex
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "user_trophies_userId_idx" ON "user_trophies"("userId");

-- CreateIndex
CREATE INDEX "user_trophies_trophyName_idx" ON "user_trophies"("trophyName");

-- CreateIndex
CREATE UNIQUE INDEX "badge_mints_transactionId_key" ON "badge_mints"("transactionId");

-- CreateIndex
CREATE INDEX "badge_mints_userId_idx" ON "badge_mints"("userId");

-- CreateIndex
CREATE INDEX "badge_mints_transactionId_idx" ON "badge_mints"("transactionId");

-- CreateIndex
CREATE INDEX "badge_mints_status_idx" ON "badge_mints"("status");

-- CreateIndex
CREATE INDEX "badge_mints_badgeType_idx" ON "badge_mints"("badgeType");

-- AddForeignKey
ALTER TABLE "agent_sessions" ADD CONSTRAINT "agent_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_sessions" ADD CONSTRAINT "agent_sessions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_messages" ADD CONSTRAINT "session_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "agent_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_recommendations" ADD CONSTRAINT "tool_recommendations_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "agent_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_recommendations" ADD CONSTRAINT "tool_recommendations_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_reviews" ADD CONSTRAINT "tool_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_reviews" ADD CONSTRAINT "tool_reviews_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "tool_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_results" ADD CONSTRAINT "user_quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_results" ADD CONSTRAINT "user_quiz_results_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vault" ADD CONSTRAINT "user_vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vault" ADD CONSTRAINT "user_vault_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vault" ADD CONSTRAINT "user_vault_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_usage" ADD CONSTRAINT "tool_usage_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_usage" ADD CONSTRAINT "tool_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trending_tools" ADD CONSTRAINT "trending_tools_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ai_tools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hunts" ADD CONSTRAINT "user_hunts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hunts" ADD CONSTRAINT "user_hunts_huntId_fkey" FOREIGN KEY ("huntId") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trophies" ADD CONSTRAINT "user_trophies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_mints" ADD CONSTRAINT "badge_mints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
