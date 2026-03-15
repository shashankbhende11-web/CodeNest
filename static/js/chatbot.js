document.addEventListener("DOMContentLoaded", function() {
    const chatbotWidget = document.getElementById('chatbot-widget');
    const openBtn = document.getElementById('open-chatbot');
    const closeBtn = document.getElementById('close-chatbot');
    const sendBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Toggle Chatbot
    openBtn.addEventListener('click', () => {
        chatbotWidget.classList.add('active');
        openBtn.style.transform = 'scale(0)';
        chatInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
        openBtn.style.transform = 'scale(1)';
    });

    // Handle Sending Messages
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message loading-msg';
        loadingDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return loadingDiv;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        addMessage(text, 'user');
        chatInput.value = '';

        // Add loading Indicator
        const loadingElt = addLoading();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remove loading
            loadingElt.remove();

            if (response.ok && data.reply) {
                const aiMsg = parseAIReply(data.reply);
                addMessage(aiMsg, 'ai');
            } else {
                addMessage("I'm sorry, I'm having trouble connecting to my database right now.", 'ai');
            }

        } catch (error) {
            console.error("Chat Error:", error);
            loadingElt.remove();
            addMessage("An error occurred. Please try again later.", 'ai');
        }
    }

    // Parse the AI reply to inject action buttons if a department is identified
    function parseAIReply(reply) {
        let enhancedReply = reply;
        
        // Use a simple heuristic to detect if the AI suggested a department
        const departments = ['OPD', 'Orthopedic', 'Dermatology', 'Gynecology', 'General Medicine', 'Pediatrics'];
        
        let foundDept = null;
        for (const dept of departments) {
            if (reply.toLowerCase().includes(dept.toLowerCase())) {
                foundDept = dept;
                break;
            }
        }

        if (foundDept) {
            // Replace spaces with underscores for URL formatting
            const deptUrlSafe = foundDept.replace(/ /g, '_');
            
            enhancedReply += `
                <div class="mt-3 pt-2 border-top d-grid gap-2">
                    <small class="text-muted mb-1 d-block text-center">Suggested Actions for ${foundDept}</small>
                    <a href="/book_appointment?dept=${deptUrlSafe}" class="btn btn-success btn-sm text-white">
                        <i class="fa-solid fa-calendar-check mt-1"></i> Book Appointment
                    </a>
                    <a href="/dashboard/patient?search=${deptUrlSafe}" class="btn btn-outline-primary btn-sm">
                        <i class="fa-solid fa-ticket mt-1"></i> View Doctors & Tokens
                    </a>
                    <a href="/map" class="btn btn-link btn-sm text-decoration-none p-0 mt-1">
                        <i class="fa-solid fa-location-dot"></i> Navigate to Dept
                    </a>
                </div>
            `;
        }

        return enhancedReply;
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
