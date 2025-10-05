import React from 'react';
import { Trophy, TrendingUp, Award, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateUserProgress, getNextAchievements, ACHIEVEMENTS, getRarityColor } from '../utils/achievementsSystem';
import { AchievementCard } from '../components/AchievementCard';

export const AchievementsPage: React.FC = () => {
  const { state } = useApp();

  const userProgress = calculateUserProgress(
    state.user!,
    state.products,
    state.orders,
    state.reviews
  );

  const nextAchievements = getNextAchievements(
    state.user!,
    state.products,
    state.orders,
    state.reviews,
    5
  );

  const unlockedAchievements = ACHIEVEMENTS.filter(a =>
    userProgress.achievements.includes(a.id)
  );

  const lockedAchievements = ACHIEVEMENTS.filter(a =>
    !userProgress.achievements.includes(a.id)
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold-500 to-terracotta-500 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy size={32} />
          Achievements
        </h1>
        <p className="text-gold-50">Track your progress and unlock rewards</p>
      </div>

      {/* Level Card */}
      <div className="bg-gradient-to-br from-deepblue-600 to-purple-600 text-white rounded-lg p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Your Level</p>
            <h2 className="text-6xl font-bold">Level {userProgress.level}</h2>
          </div>
          <Trophy size={80} className="opacity-30" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">Progress to Level {userProgress.level + 1}</span>
            <span className="text-sm font-semibold">{Math.round(userProgress.progress)}%</span>
          </div>
          <div className="w-full h-4 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-400 to-terracotta-400 transition-all"
              style={{ width: `${userProgress.progress}%` }}
            />
          </div>
          <p className="text-xs text-blue-100 mt-2">
            {userProgress.totalPoints} / {userProgress.nextLevelPoints} points
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award size={20} />
              <span className="text-sm text-blue-100">Total Points</span>
            </div>
            <p className="text-3xl font-bold">{userProgress.totalPoints}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={20} />
              <span className="text-sm text-blue-100">Unlocked</span>
            </div>
            <p className="text-3xl font-bold">{unlockedAchievements.length}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={20} />
              <span className="text-sm text-blue-100">Remaining</span>
            </div>
            <p className="text-3xl font-bold">{lockedAchievements.length}</p>
          </div>
        </div>
      </div>

      {/* Next Achievements */}
      {nextAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-terracotta-500" />
            Next Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextAchievements.map(({ achievement, progress }) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
                progress={progress}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4 flex items-center gap-2">
            <Trophy size={24} className="text-gold-500" />
            Unlocked Achievements ({unlockedAchievements.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-deepblue-800 mb-4 flex items-center gap-2">
          <Award size={24} className="text-purple-500" />
          All Achievements ({ACHIEVEMENTS.length})
        </h2>
        
        {/* Group by category */}
        {['sales', 'quality', 'community', 'milestone'].map(category => {
          const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 capitalize flex items-center gap-2">
                {category === 'sales' && '💰'}
                {category === 'quality' && '✨'}
                {category === 'community' && '🤝'}
                {category === 'milestone' && '🎯'}
                {category} Achievements
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={userProgress.achievements.includes(achievement.id)}
                    progress={
                      nextAchievements.find(na => na.achievement.id === achievement.id)?.progress
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {unlockedAchievements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-semibold text-gray-700 mb-2">No achievements yet</p>
          <p className="text-gray-500 mb-4">
            Complete your first order or list a product to start earning achievements!
          </p>
        </div>
      )}
    </div>
  );
};
