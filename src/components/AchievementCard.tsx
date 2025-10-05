import React from 'react';
import { Lock } from 'lucide-react';
import { Achievement, getRarityColor } from '../utils/achievementsSystem';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: number;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  unlocked,
  progress = 0,
}) => {
  return (
    <div
      className={`rounded-lg p-4 border-2 transition-all ${
        unlocked
          ? `${getRarityColor(achievement.rarity)} shadow-md hover:shadow-lg`
          : 'bg-gray-50 text-gray-400 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`text-4xl ${
            unlocked ? 'filter-none' : 'grayscale opacity-40'
          }`}
        >
          {unlocked ? achievement.icon : <Lock size={32} />}
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${unlocked ? '' : 'text-gray-500'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm mb-2 ${unlocked ? 'opacity-80' : 'text-gray-400'}`}>
            {achievement.description}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                unlocked
                  ? getRarityColor(achievement.rarity)
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {achievement.rarity}
            </span>
            <span className={`text-sm font-bold ${unlocked ? '' : 'text-gray-400'}`}>
              {achievement.points} pts
            </span>
          </div>

          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-saffron-400 to-terracotta-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
