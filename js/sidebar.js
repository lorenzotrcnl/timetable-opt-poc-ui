
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    let timeoutId;
  
    document.addEventListener('mousemove', (e) => {
      const threshold = 250; // Distanza in pixel dal bordo sinistro
  
      if (e.clientX <= threshold) {
        clearTimeout(timeoutId);
        sidebar.style.left = '0';
      } else {
        timeoutId = setTimeout(() => {
          sidebar.style.left = '-250px';
        }, 300); // Ritardo prima di nascondere la sidebar
      }
    });
  });