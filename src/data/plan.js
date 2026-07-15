function getMorningRoutine(day) {
  if (day <= 10) {
    return [
      { name: "Incline Push-ups", sets: "3×12", type: "reps", icon: "activity" },
      { name: "Wall Pull Hold", sets: "3×10 sec", type: "time", icon: "timer" },
      { name: "Knee Push-ups", sets: "3×10", type: "reps", icon: "activity" },
      { name: "Squats", sets: "3×20", type: "reps", icon: "arrow-down-up" },
      { name: "Plank", sets: "3×30 sec", type: "time", icon: "dumbbell" },
    ];
  } else if (day <= 20) {
    return [
      { name: "Push-ups", sets: "4×10", type: "reps", icon: "activity" },
      { name: "Australian Pull-ups", sets: "3×8", type: "reps", icon: "arrow-up" },
      { name: "Jump Squats", sets: "3×12", type: "reps", icon: "zap" },
      { name: "Plank Toe-Tap", sets: "3×10", type: "reps", icon: "activity" },
      { name: "Leg Raises", sets: "3×10", type: "reps", icon: "arrow-up" },
    ];
  } else {
    return [
      { name: "Diamond Push-ups", sets: "4×10", type: "reps", icon: "gem" },
      { name: "Negative Pull-ups", sets: "3×5", type: "reps", icon: "arrow-down" },
      { name: "Jump Squats", sets: "3×15", type: "reps", icon: "zap" },
      { name: "Hollow Body Hold", sets: "3×20 sec", type: "time", icon: "timer" },
      { name: "Handstand Hold", sets: "3×20–30 sec", type: "time", icon: "timer" },
    ];
  }
}

function getEveningRoutine(day) {
  if (day === 29) return [
    { name: "Dumbbell Fly (slow)", sets: "4×20", type: "reps", icon: "activity" },
    { name: "Squeeze Press", sets: "4×15", type: "reps", icon: "activity" },
    { name: "Incline Push-ups", sets: "4×max", type: "reps", icon: "activity" },
    { name: "Chest Hold", sets: "4×30 sec", type: "time", icon: "timer" }
  ];
  if (day === 30) return [
    { name: "Max Push-ups", sets: "1 set max reps", type: "reps", icon: "activity" },
    { name: "Max Plank", sets: "1 set max time", type: "time", icon: "timer" },
    { name: "Max Pull-ups/Holds", sets: "1 set max reps", type: "reps", icon: "arrow-up" },
  ];

  let cycleDay = day % 7 || 7;
  let increaseReps = day >= 15 && day <= 21;
  let extraSet = day >= 22 && day <= 28 ? 1 : 0;

  const adjust = (sets, reps) => {
    let s = Number(sets) + extraSet;
    let r = increaseReps ? reps + " (+2/5 reps)" : reps;
    return `${s}×${r}`;
  };

  switch (cycleDay) {
    case 1:
      return [
        { name: "Dumbbell Floor Press", sets: adjust(4, "12-15"), type: "reps", icon: "dumbbell" },
        { name: "Close-Grip Floor Press", sets: adjust(3, "12"), type: "reps", icon: "dumbbell" },
        { name: "Dumbbell Fly", sets: adjust(3, "12-15"), type: "reps", icon: "activity" },
        { name: "Push-ups", sets: adjust(2, "max"), type: "reps", icon: "activity" },
        { name: "Overhead Tricep Extension", sets: adjust(3, "12"), type: "reps", icon: "arrow-up" }
      ];
    case 2:
      return [
        { name: "One-arm Dumbbell Row", sets: adjust(3, "12 each"), type: "reps", icon: "dumbbell" },
        { name: "Reverse Grip Row", sets: adjust(3, "12"), type: "reps", icon: "dumbbell" },
        { name: "Bicep Curls", sets: adjust(3, "12-15"), type: "reps", icon: "activity" },
        { name: "Hammer Curls", sets: adjust(3, "12"), type: "reps", icon: "activity" }
      ];
    case 3:
      return [
        { name: "Dumbbell Fly (slow)", sets: adjust(4, "15"), type: "reps", icon: "activity" },
        { name: "Squeeze Press", sets: adjust(3, "12"), type: "reps", icon: "activity" },
        { name: "Incline Push-ups", sets: adjust(3, "max"), type: "reps", icon: "activity" },
        { name: "Chest Hold", sets: adjust(3, "20-30 sec"), type: "time", icon: "timer" }
      ];
    case 4: return []; // Rest
    case 5:
      return [
        { name: "Dumbbell Floor Press", sets: adjust(4, "12"), type: "reps", icon: "dumbbell" },
        { name: "Arnold Press", sets: adjust(3, "10"), type: "reps", icon: "arrow-up" },
        { name: "Front Raises", sets: adjust(3, "12"), type: "reps", icon: "activity" },
        { name: "Wide Push-ups", sets: adjust(3, "max"), type: "reps", icon: "activity" }
      ];
    case 6:
      return [
        { name: "Push-ups (slow)", sets: adjust(3, "12-15"), type: "reps", icon: "activity" },
        { name: "Dumbbell Pullover", sets: adjust(3, "12"), type: "reps", icon: "dumbbell" },
        { name: "Plank", sets: adjust(3, "40 sec"), type: "time", icon: "timer" }
      ];
    case 7: return []; // Rest
  }
}

export const planData = Array.from({ length: 30 }, (_, i) => {
  const dayIndex = i + 1;
  const eveningRoutine = getEveningRoutine(dayIndex);
  return {
    day: dayIndex,
    morning: getMorningRoutine(dayIndex),
    evening: eveningRoutine,
    isRestDay: eveningRoutine.length === 0
  };
});

export const dietGuidelines = {
  morning: "1 glass water (optional soaked almonds)",
  preWorkout: "Light carbs (banana, peanut butter, sattu drink)",
  postWorkout: "Protein + carbs (paneer, eggs, milk, roti/rice)",
  rules: [
    "Stay hydrated",
    "Don't train on an empty stomach",
    "Prioritize protein after workouts"
  ]
};
