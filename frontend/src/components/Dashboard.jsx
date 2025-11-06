import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles.css"; // ✅ Fixed

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn HTML, CSS, and JavaScript fundamentals to build your first website.",
      instructor: "Sarah Johnson",
      duration: "6 weeks",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      description: "Master advanced React concepts including hooks, context, and state management.",
      instructor: "Michael Chen",
      duration: "8 weeks",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Database Design & SQL",
      description: "Learn how to design efficient databases and write complex SQL queries.",
      instructor: "Alex Rivera",
      duration: "5 weeks",
      level: "Intermediate"
    },
    {
      id: 4,
      title: "Node.js & Express Backend",
      description: "Build scalable server-side applications using Node.js and Express framework.",
      instructor: "Priya Patel",
      duration: "7 weeks",
      level: "Intermediate"
    }
  ]);

  const handleCourseClick = (courseId) => {
    alert(`You selected course #${courseId}. Enroll feature coming soon!`);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-header">Welcome, {user?.name || 'User'}!</h2>
        <p>Here are some recommended courses to start your learning journey.</p>
      </div>

      <div className="dashboard-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card" onClick={() => handleCourseClick(course.id)}>
            <div className="course-card-body">
              <h3 className="course-card-title">{course.title}</h3>
              <p className="course-card-desc">{course.description}</p>
              <div className="course-card-footer">
                <span>By {course.instructor}</span>
                <span>{course.duration} • {course.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;