// Initialize EventSource for receiving messages
new EventSource("/sse").onmessage = function(event) {
    const messages = document.getElementById('messages');
    messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  // Handle form submission
  document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const input = document.getElementById('input');
    fetch(`/chat?message=${encodeURIComponent(input.value)}`);
    input.value = '';
  });