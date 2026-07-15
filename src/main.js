import './style.css';
import { createIcons, Activity, Timer, Dumbbell, Zap, ArrowUp, ArrowDown, ArrowDownUp, Gem, CheckCircle, Circle, Sun, Moon, Utensils, Droplets, Banana, Coffee, ChevronDown } from 'lucide';
import { planData, dietGuidelines } from './data/plan.js';
import { getProgress, saveProgress, resetProgress, isSessionComplete } from './utils/storage.js';

let currentDay = 1;

const exerciseImages = {
  "Push-ups": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "Incline Push-ups": "https://i.pinimg.com/originals/41/ab/59/41ab5945f4cdb6253337b6fb6f9ffd64.gif",
  "Diamond Push-ups": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "Wide Push-ups": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "Knee Push-ups": "https://i.pinimg.com/originals/46/9c/da/469cda6bae1d16616199b867b4ba7e37.gif",
  "Squats": "https://i.pinimg.com/originals/c4/53/9f/c4539fddb77d7660ee8fc1bc6ceac79f.gif",
  "Jump Squats": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
  "Plank": "https://i.pinimg.com/736x/37/aa/9c/37aa9cb866d10d09a93ce9587e2a4835.jpg",
  "Plank Toe-Tap": "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&q=80",
  "Max Plank": "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&q=80",
  "Australian Pull-ups": "https://images.unsplash.com/photo-1526506114642-9018f26471e4?w=800&q=80",
  "Negative Pull-ups": "https://images.unsplash.com/photo-1526506114642-9018f26471e4?w=800&q=80",
  "Max Pull-ups/Holds": "https://images.unsplash.com/photo-1526506114642-9018f26471e4?w=800&q=80",
  "Wall Pull Hold": "https://i.pinimg.com/736x/22/85/07/2285078ebbbd699748d454901104537d.jpg",
  "Leg Raises": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "Hollow Body Hold": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "Handstand Hold": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
  "Dumbbell Floor Press": "https://i.pinimg.com/originals/10/f5/3c/10f53ce84a6f88591048bb7ff705c791.gif",
  "Close-Grip Floor Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Dumbbell Fly": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Dumbbell Fly (slow)": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Squeeze Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Chest Hold": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "One-arm Dumbbell Row": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "Reverse Grip Row": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "Bicep Curls": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Hammer Curls": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Arnold Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Front Raises": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Overhead Tricep Extension": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Dumbbell Pullover": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  "Push-ups (slow)": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "Max Push-ups": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
};
const defaultImage = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80";

function init() {
  renderDaySelector();
  updateProgressBar();
  renderDayContent();
}

function updateProgressBar() {
  const progress = getProgress();
  let completedDays = 0;
  for (let i = 1; i <= 30; i++) {
    const isMorningDone = progress[i]?.['morning'];
    const isEveningDone = progress[i]?.['evening'];
    const dayData = planData.find(d => d.day === i);
    if (!dayData) continue;
    if (dayData.isRestDay) {
        if(isMorningDone) completedDays++;
    } else {
        if(isMorningDone && isEveningDone) completedDays++;
    }
  }
  
  document.getElementById('progress-text').innerText = `${completedDays} / 30 Days`;
  document.getElementById('progress-fill').style.width = `${(completedDays / 30) * 100}%`;
  
  const pills = document.querySelectorAll('.day-pill');
  pills.forEach(pill => {
    const d = parseInt(pill.dataset.day);
    const dayData = planData.find(x => x.day === d);
    let isComplete = false;
    if (dayData) {
      if (dayData.isRestDay) isComplete = !!progress[d]?.['morning'];
      else isComplete = progress[d]?.['morning'] && progress[d]?.['evening'];
    }
    pill.classList.toggle('completed', isComplete);
    
    // Ensure active pill stays highlighted in the correct color if it is completed
    if (pill.classList.contains('active')) {
      if (isComplete) pill.style.backgroundColor = 'var(--success)';
      else pill.style.backgroundColor = 'var(--accent)';
    } else {
      pill.style.backgroundColor = '';
    }
  });
}

function renderDaySelector() {
  const wrap = document.getElementById('day-selector');
  wrap.innerHTML = '';
  
  planData.forEach(data => {
    const d = data.day;
    const btn = document.createElement('button');
    btn.className = `day-pill ${d === currentDay ? 'active' : ''}`;
    btn.dataset.day = d;
    btn.innerHTML = `Day ${d}`;
    btn.onclick = () => {
      document.querySelectorAll('.day-pill').forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = ''; // Reset custom overrides
      });
      btn.classList.add('active');
      currentDay = d;
      renderDayContent();
      
      // Auto-scroll the selector
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    wrap.appendChild(btn);
  });
}

function toggleSession(sessionName) {
  const done = isSessionComplete(currentDay, sessionName);
  saveProgress(currentDay, sessionName, !done);
  renderDayContent();
  updateProgressBar();
}

function renderDayContent() {
  const content = document.getElementById('app-content');
  const dayData = planData.find(d => d.day === currentDay);
  
  if (!dayData) return;

  const morningDone = isSessionComplete(currentDay, 'morning');
  const eveningDone = isSessionComplete(currentDay, 'evening');
  
  content.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.75rem; color: white;">Day ${dayData.day} Plan</h2>
    </div>

    <!-- Morning Session -->
    <section class="session-section stagger-1">
      <div class="session-header">
        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: white;">
          <i data-lucide="sun" style="color: #fbbf24;"></i> Morning Calisthenics
        </h3>
        <button class="complete-btn ${morningDone ? 'done' : ''} pulse-btn" id="btn-morning">
          <i data-lucide="${morningDone ? 'check-circle' : 'circle'}"></i> 
          ${morningDone ? 'Completed' : 'Mark as Done'}
        </button>
      </div>
      <div class="exercise-list">
        ${dayData.morning.map((ex, idx) => generateExerciseHTML(ex, idx, 'morning')).join('')}
      </div>
    </section>

    <!-- Evening Session -->
    ${!dayData.isRestDay ? `
    <section class="session-section stagger-2">
      <div class="session-header">
        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: white;">
          <i data-lucide="moon" style="color: #a78bfa;"></i> Evening Strength
        </h3>
        <button class="complete-btn ${eveningDone ? 'done' : ''} pulse-btn" id="btn-evening">
          <i data-lucide="${eveningDone ? 'check-circle' : 'circle'}"></i> 
          ${eveningDone ? 'Completed' : 'Mark as Done'}
        </button>
      </div>
      <div class="exercise-list">
        ${dayData.evening.map((ex, idx) => generateExerciseHTML(ex, idx, 'evening')).join('')}
      </div>
    </section>
    ` : `
    <section class="session-section stagger-2" style="text-align: center; padding: 3rem 1rem;">
      <i data-lucide="moon" class="float-anim" style="width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem;"></i>
      <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Evening Rest</h3>
      <p>Take it easy and recover for tomorrow.</p>
    </section>
    `}

    <!-- Diet Guidelines -->
    <section class="session-section stagger-3">
      <div class="session-header">
        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--success);">
          <i data-lucide="utensils"></i> Daily Diet Plan
        </h3>
      </div>
      <div class="diet-grid">
        <div class="diet-item">
          <div class="diet-label"><i data-lucide="droplets" style="width: 16px; height: 16px;"></i> Morning</div>
          <div class="diet-text">${dietGuidelines.morning}</div>
        </div>
        <div class="diet-item">
          <div class="diet-label"><i data-lucide="banana" style="width: 16px; height: 16px;"></i> Pre-Workout</div>
          <div class="diet-text">${dietGuidelines.preWorkout}</div>
        </div>
        <div class="diet-item">
          <div class="diet-label"><i data-lucide="coffee" style="width: 16px; height: 16px;"></i> Post-Workout</div>
          <div class="diet-text">${dietGuidelines.postWorkout}</div>
        </div>
      </div>
      <ul class="rules-list">
        ${dietGuidelines.rules.map(r => `<li><i data-lucide="check-circle" style="width: 16px; height: 16px;"></i> ${r}</li>`).join('')}
      </ul>
    </section>
    
    <!-- Reset Data -->
    <div class="stagger-4" style="text-align: center; margin-top: 3rem; margin-bottom: 3rem;">
        <button id="btn-reset" class="complete-btn pulse-btn-danger" style="display: inline-flex; border-color: rgba(239, 68, 68, 0.4); color: var(--danger);">
             <i data-lucide="zap"></i> Reset All Progress
        </button>
    </div>
  `;

  // Attach event listeners
  document.getElementById('btn-morning').onclick = () => toggleSession('morning');
  if (document.getElementById('btn-evening')) {
    document.getElementById('btn-evening').onclick = () => toggleSession('evening');
  }
  
  if (document.getElementById('btn-reset')) {
      document.getElementById('btn-reset').onclick = () => resetProgress();
  }

  // Attach card toggle listeners with smooth scroll
  document.querySelectorAll('.ex-header').forEach(header => {
    header.addEventListener('click', (e) => {
      const card = e.currentTarget.parentElement;
      const isExpanded = card.classList.contains('expanded');
      
      // Close other cards in the same list
      card.parentElement.querySelectorAll('.exercise-card').forEach(c => {
        if(c !== card) c.classList.remove('expanded');
      });

      card.classList.toggle('expanded');
      
      if (!isExpanded) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });

  // Init Lucide icons newly added to DOM
  createIcons({
    icons: {
      Activity, Timer, Dumbbell, Zap, ArrowUp, ArrowDown, ArrowDownUp,
      Gem, CheckCircle, Circle, Sun, Moon, Utensils, Droplets, Banana, Coffee, ChevronDown
    }
  });

  // Re-trigger enter animation
  content.style.animation = 'none';
  content.offsetHeight; /* trigger reflow */
  content.style.animation = 'fadeIn 0.5s ease-out';
  
  updateProgressBar(); // Ensure sync
}

function generateExerciseHTML(ex, idx, prefix) {
  const isTime = ex.type === 'time';
  const animIcon = isTime ? 'timer' : 'activity';
  const imgUrl = exerciseImages[ex.name] || defaultImage;
  
  return `
    <div class="exercise-card anim-delay-${idx % 5}" id="ex-${prefix}-${idx}">
      <div class="ex-header">
        <div class="ex-icon-wrap icon-pulse">
          <i data-lucide="${ex.icon || 'activity'}"></i>
        </div>
        <div class="ex-details">
          <div class="ex-title">${ex.name}</div>
          <div class="ex-sets">${ex.sets}</div>
        </div>
        <i data-lucide="chevron-down" class="ex-chevron"></i>
      </div>
      <div class="ex-body">
        <div class="ex-content-inner">
          <div class="ex-image-wrap">
             <div class="img-overlay"></div>
             <img src="${imgUrl}" alt="${ex.name}" loading="lazy" />
          </div>
          <div class="animation-placeholder">
            <i data-lucide="${animIcon}"></i>
            <p>${isTime ? 'Hold the position steadily for the required time.' : 'Focus on controlled eccentric and concentric phases.'}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

