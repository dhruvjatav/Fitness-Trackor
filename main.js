// main.js - Wellness And Fitness Tracker

const form = document.getElementById('workoutForm');
const workoutList = document.getElementById('workoutList');
const chartCanvas = document.getElementById('progressChart')?.getContext('2d');
const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

function displayWorkouts() {
  if (!workoutList) return;
  workoutList.innerHTML = '';
  workouts.forEach(workout => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>Type:</strong> ${workout.type} <br>
      <strong>Duration:</strong> ${workout.duration} minutes <br>
      <strong>Calories:</strong> ${workout.calories} kcal
    `;
    workoutList.appendChild(li);
  });
}

function updateChart() {
  if (!chartCanvas) return;
  const types = {};
  workouts.forEach(w => {
    types[w.type] = (types[w.type] || 0) + Number(w.duration);
  });
  const chart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(types),
      datasets: [{
        label: 'Total Duration (mins)',
        data: Object.values(types),
        backgroundColor: '#3a7bd5'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function exportCSV() {
  let csv = 'Type,Duration,Calories\n';
  workouts.forEach(w => {
    csv += `${w.type},${w.duration},${w.calories}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'workouts.csv';
  a.click();
  URL.revokeObjectURL(url);
}

form?.addEventListener('submit', e => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const duration = document.getElementById('duration').value;
  const calories = document.getElementById('calories').value;
  if (!type || !duration || !calories) return;
  workouts.push({ type, duration, calories });
  localStorage.setItem('workouts', JSON.stringify(workouts));
  displayWorkouts();
  updateChart();
  form.reset();
});

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function initDarkMode() {
  const enabled = localStorage.getItem('darkMode') === 'true';
  if (enabled) document.body.classList.add('dark');
}

initDarkMode();
displayWorkouts();
updateChart();

