import React, { useState } from 'react';
import { BookOpen, Play, Award, Clock, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  craftType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  thumbnail: string;
  enrolledCount: number;
  rating: number;
  lessons: number;
  completed?: boolean;
}

export const AcademyPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCraft, setSelectedCraft] = useState<string>('all');

  const courses: Course[] = [
    {
      id: 'course-1',
      title: 'Introduction to Blue Pottery',
      description: 'Learn the ancient art of Jaipur Blue Pottery from scratch. Master basic techniques and create your first masterpiece.',
      instructor: 'Master Rajesh Kumar',
      craftType: 'Pottery',
      level: 'beginner',
      duration: 120,
      thumbnail: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
      enrolledCount: 234,
      rating: 4.8,
      lessons: 8,
    },
    {
      id: 'course-2',
      title: 'Advanced Textile Weaving',
      description: 'Master complex weaving patterns and traditional designs used in Banarasi sarees.',
      instructor: 'Guru Meera Devi',
      craftType: 'Textile',
      level: 'advanced',
      duration: 180,
      thumbnail: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
      enrolledCount: 156,
      rating: 4.9,
      lessons: 12,
    },
    {
      id: 'course-3',
      title: 'Jewelry Making Basics',
      description: 'Discover the fundamentals of traditional Indian jewelry making with hands-on tutorials.',
      instructor: 'Craftsman Arjun Singh',
      craftType: 'Jewelry',
      level: 'beginner',
      duration: 90,
      thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
      enrolledCount: 189,
      rating: 4.7,
      lessons: 6,
    },
    {
      id: 'course-4',
      title: 'Wood Carving Techniques',
      description: 'Learn traditional wood carving methods passed down through generations.',
      instructor: 'Master Vikram Patel',
      craftType: 'Woodwork',
      level: 'intermediate',
      duration: 150,
      thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      enrolledCount: 98,
      rating: 4.6,
      lessons: 10,
    },
    {
      id: 'course-5',
      title: 'Natural Dye Making',
      description: 'Explore eco-friendly natural dye techniques for textiles using traditional methods.',
      instructor: 'Expert Lakshmi Sharma',
      craftType: 'Textile',
      level: 'intermediate',
      duration: 100,
      thumbnail: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400',
      enrolledCount: 145,
      rating: 4.8,
      lessons: 7,
    },
    {
      id: 'course-6',
      title: 'Terracotta Sculpting',
      description: 'Create beautiful terracotta sculptures using age-old techniques from rural India.',
      instructor: 'Artist Priya Reddy',
      craftType: 'Pottery',
      level: 'beginner',
      duration: 110,
      thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
      enrolledCount: 167,
      rating: 4.5,
      lessons: 8,
    },
  ];

  const crafts = ['all', ...new Set(courses.map(c => c.craftType))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    if (selectedCraft !== 'all' && course.craftType !== selectedCraft) return false;
    if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
    return true;
  });

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-deepblue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen size={32} />
          Kala Academy
        </h1>
        <p className="text-blue-50">Learn traditional crafts from master artisans</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-deepblue-600 mb-2">
            <BookOpen size={20} />
            <span className="text-sm font-semibold">Total Courses</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-terracotta-600 mb-2">
            <Play size={20} />
            <span className="text-sm font-semibold">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">
            {courses.reduce((sum, c) => sum + c.enrolledCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gold-600 mb-2">
            <Award size={20} />
            <span className="text-sm font-semibold">Certificates</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">0</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedCraft}
            onChange={(e) => setSelectedCraft(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-400 outline-none"
          >
            {crafts.map(craft => (
              <option key={craft} value={craft}>
                {craft === 'all' ? 'All Crafts' : craft}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-400 outline-none"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>
              {course.completed && (
                <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full p-2">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="font-semibold text-terracotta-600">{course.craftType}</span>
                <span>•</span>
                <span>{course.lessons} lessons</span>
              </div>

              <h3 className="text-lg font-bold text-deepblue-800 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span className="font-semibold">By:</span>
                <span>{course.instructor}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-gold-500" />
                  <span className="text-sm font-semibold">{course.rating}</span>
                  <span className="text-xs text-gray-500">({course.enrolledCount} enrolled)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{course.duration} min</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2">
                <Play size={18} />
                {course.completed ? 'Continue Learning' : 'Start Learning'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-semibold text-gray-700 mb-2">No courses found</p>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};
