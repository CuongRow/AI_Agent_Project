document.addEventListener('DOMContentLoaded', () => {
  // 1. Gauge Chart Animation
  const gaugeFill = document.getElementById('gauge-fill');
  if (gaugeFill) {
    // Total circumference is ~251.3 (Math.PI * 80). 
    // 45% progress is 251.3 * 0.45 = 113.1.
    // strokeDashoffset should be 251.3 - 113.1 = 138.2.
    setTimeout(() => {
      gaugeFill.style.strokeDashoffset = '138.2';
    }, 200);
  }

  // 2. Chart.js Monthly Bar Chart Initialisation
  const ctx = document.getElementById('monthly-chart');
  if (ctx) {
    // Gradient fill for bars
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#bbf238'); // Top of bar - lime yellow
    gradient.addColorStop(1, '#82b712'); // Bottom of bar - darker olive

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          data: [50, 92, 38, 92, 68, 55],
          backgroundColor: gradient,
          hoverBackgroundColor: '#c2f943',
          borderRadius: 16,
          borderSkipped: false, // ensures bottom is rounded too
          barThickness: 32,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false // disable default tooltips to match figma custom label
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                family: 'Inter',
                size: 13
              }
            }
          },
          y: {
            display: false, // hide vertical axis entirely as in figma design
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // 3. Sync/Refresh Button Spin Animation
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('refresh-spin');
      setTimeout(() => {
        refreshBtn.classList.remove('refresh-spin');
      }, 600);
    });
  }

  // 4. Sidebar Navigation Active States
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // 5. Mobile Sidebar Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar-container');
  const closeMenuBtn = document.getElementById('close-menu-btn');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
    });
  }

  if (closeMenuBtn && sidebar) {
    closeMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
    });
  }
});
