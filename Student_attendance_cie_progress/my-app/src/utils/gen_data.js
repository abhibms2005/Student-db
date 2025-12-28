
const fs = require('fs');

const subjects = [
    { id: "sub1", name: "Mathematics", target: 0.50 },
    { id: "sub2", name: "Physics", target: 0.84 },
    { id: "sub3", name: "Chemistry", target: 0.76 }
];

const attendance = [];
const start = new Date("2025-08-01");
const addDays = (d, n) => {
    const newDate = new Date(d);
    newDate.setDate(newDate.getDate() + n);
    return newDate;
};

// 50 classes each
const totalClasses = 50;

subjects.forEach(sub => {
    const presentCount = Math.round(totalClasses * sub.target);
    const absentCount = totalClasses - presentCount;

    let p = presentCount;
    let a = absentCount;

    for (let i = 0; i < totalClasses; i++) {
        const date = addDays(start, i * 2).toISOString().split('T')[0]; // Every 2 days
        let status = 'absent';

        // Simple deterministic interleave to avoid clumps
        // If we have more Ps left than As relative to total left, pick P
        const totalLeft = p + a;
        if (totalLeft === 0) break;

        if (Math.random() < p / totalLeft) {
            p--;
            status = 'present';
        } else {
            a--;
            status = 'absent';
        }

        attendance.push({
            studentId: "s1",
            subjectId: sub.id,
            date: date,
            status: status,
            reason: status === 'absent' ? 'Reason' : undefined
        });
    }
});

// Sort by date
attendance.sort((a, b) => new Date(a.date) - new Date(b.date));

console.log(JSON.stringify(attendance, null, 2));
