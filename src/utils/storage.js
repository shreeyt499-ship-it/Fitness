const STORAGE_KEY = 'fitnessTrackerProgress';

export function getProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveProgress(day, session, isComplete) {
  const progress = getProgress();
  if (!progress[day]) progress[day] = {};
  progress[day][session] = isComplete;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isSessionComplete(day, session) {
  const progress = getProgress();
  return progress[day] ? !!progress[day][session] : false;
}

export function resetProgress() {
  if(confirm("Are you sure you want to reset all your 30-day progress?")) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}
