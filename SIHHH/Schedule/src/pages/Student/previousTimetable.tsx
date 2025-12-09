// src/pages/Student/previousTimetable.tsx
import React, { useState } from 'react';

interface TimetableClass {
  time: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
  type: string;
}

const PreviousTimetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const previousTimetable = {
    semester: "2nd Semester (Aug 2023 - Dec 2023)",
    courses: {
      "Monday": [
        { time: "9:00-10:00", subject: "Java Programming", code: "CS101", room: "LT-101", faculty: "Dr. Priya Singh", type: "Theory" },
        { time: "10:00-11:00", subject: "Discrete Mathematics", code: "MTH201", room: "LT-102", faculty: "Prof. Rajesh Kumar", type: "Theory" },
        { time: "2:00-4:00", subject: "Java Lab", code: "CS101L", room: "Lab-201", faculty: "Dr. Priya Singh", type: "Practical" }
      ],
      "Tuesday": [
        { time: "9:00-10:00", subject: "Python Programming", code: "CS102", room: "LT-101", faculty: "Prof. Amit Kumar", type: "Theory" },
        { time: "10:00-11:00", subject: "Digital Electronics", code: "EC101", room: "LT-103", faculty: "Dr. Sunita Patel", type: "Theory" },
        { time: "2:00-4:00", subject: "Python Lab", code: "CS102L", room: "Lab-202", faculty: "Prof. Amit Kumar", type: "Practical" }
      ],
      "Wednesday": [
        { time: "9:00-10:00", subject: "Discrete Mathematics", code: "MTH201", room: "LT-102", faculty: "Prof. Rajesh Kumar", type: "Theory" },
        { time: "10:00-11:00", subject: "Computer Organization", code: "CS103", room: "LT-104", faculty: "Dr. Ravi Verma", type: "Theory" },
        { time: "2:00-4:00", subject: "DE Lab", code: "EC101L", room: "Lab-203", faculty: "Dr. Sunita Patel", type: "Practical" }
      ],
      "Thursday": [
        { time: "9:00-10:00", subject: "Java Programming", code: "CS101", room: "LT-101", faculty: "Dr. Priya Singh", type: "Theory" },
        { time: "10:00-11:00", subject: "Computer Organization", code: "CS103", room: "LT-104", faculty: "Dr. Ravi Verma", type: "Theory" },
        { time: "2:00-4:00", subject: "CO Lab", code: "CS103L", room: "Lab-204", faculty: "Dr. Ravi Verma", type: "Practical" }
      ],
      "Friday": [
        { time: "9:00-10:00", subject: "Python Programming", code: "CS102", room: "LT-101", faculty: "Prof. Amit Kumar", type: "Theory" },
        { time: "10:00-11:00", subject: "Environmental Science", code: "EVS101", room: "LT-105", faculty: "Ms. Anjali Mehta", type: "Theory" }
      ]
    }
  };

  const handleDownload = () => {
    const content = `
Previous Timetable - ${previousTimetable.semester}

${Object.entries(previousTimetable.courses).map(([day, classes]) => `
${day.toUpperCase()}
${classes.map(cls => `${cls.time} | ${cls.subject} (${cls.code}) | ${cls.room} | ${cls.faculty} | ${cls.type}`).join('\n')}
`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `previous-timetable-2nd-semester.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const days = Object.keys(previousTimetable.courses);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">{previousTimetable.semester}</h3>
          <p className="text-slate-400">Your previous semester schedule</p>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-purple-600/50 hover:bg-purple-600/70 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Timetable
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedDay === day 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable */}
      <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6">
        <div className="grid gap-4">
          {previousTimetable.courses[selectedDay]?.map((cls, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-600/30 rounded-lg border border-slate-500/20">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-purple-300 font-semibold text-lg">{cls.time}</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{cls.subject}</h3>
                    <p className="text-slate-400 text-sm">{cls.code} • {cls.type}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-slate-300">
                  <span>🏢 {cls.room}</span>
                  <span>👨‍🏫 {cls.faculty}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                cls.type === 'Theory' ? 'bg-blue-500/20 text-blue-300' :
                cls.type === 'Practical' ? 'bg-green-500/20 text-green-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {cls.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousTimetable;