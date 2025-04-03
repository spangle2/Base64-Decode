document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const inputArea = document.getElementById('input');
    const outputArea = document.getElementById('output');
    const statusElement = document.getElementById('status');
    
    // Current mode (encode/decode)
    let currentMode = 'encode';
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current mode
            currentMode = btn.dataset.tab;
            
            // Clear fields
            clearFields();
            
            // Update button text
            convertBtn.textContent = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
        });
    });
    
    // Convert functionality
    convertBtn.addEventListener('click', () => {
        const inputText = inputArea.value.trim();
        
        if (!inputText) {
            showStatus('Please enter some text');
            return;
        }
        
        try {
            if (currentMode === 'encode') {
                outputArea.value = btoa(inputText);
            } else {
                outputArea.value = atob(inputText);
            }
            showStatus(`Text ${currentMode}d successfully!`);
        } catch (error) {
            outputArea.value = '';
            showStatus(`Error: Invalid input for ${currentMode}ing`);
        }
    });
    
    // Copy functionality
    copyBtn.addEventListener('click', () => {
        if (!outputArea.value) {
            showStatus('Nothing to copy');
            return;
        }
        
        outputArea.select();
        document.execCommand('copy');
        // For modern browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(outputArea.value)
                .then(() => showStatus('Copied to clipboard!'))
                .catch(() => showStatus('Failed to copy'));
        } else {
            showStatus('Copied to clipboard!');
        }
    });
    
    // Clear functionality
    clearBtn.addEventListener('click', clearFields);
    
    // Helper functions
    function clearFields() {
        inputArea.value = '';
        outputArea.value = '';
        statusElement.textContent = '';
    }
    
    function showStatus(message) {
        statusElement.textContent = message;
        statusElement.style.opacity = 1;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusElement.style.opacity = 0;
        }, 3000);
    }
    
    // Allow encoding/decoding on Enter key when in input field
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            convertBtn.click();
        }
    });
});