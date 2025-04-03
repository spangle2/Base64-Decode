document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const inputArea = document.getElementById('input');
    const outputArea = document.getElementById('output');
    const statusElement = document.getElementById('status');
    const tabs = document.querySelector('.tabs');
    
    // Create tab indicator
    const tabIndicator = document.createElement('div');
    tabIndicator.className = 'tab-indicator';
    tabs.appendChild(tabIndicator);
    
    // Current mode (encode/decode)
    let currentMode = 'encode';
    
    // Tab switching functionality
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Animate tab indicator
            tabIndicator.style.transform = `translateX(${index * 100}%)`;
            
            // Update current mode
            currentMode = btn.dataset.tab;
            
            // Clear fields
            clearFields();
            
            // Update button text with animation
            animateButtonText(convertBtn, currentMode.charAt(0).toUpperCase() + currentMode.slice(1));
        });
    });
    
    // Convert functionality
    convertBtn.addEventListener('click', () => {
        const inputText = inputArea.value.trim();
        
        if (!inputText) {
            showStatus('Please enter some text');
            shakeElement(inputArea);
            return;
        }
        
        try {
            let result = '';
            if (currentMode === 'encode') {
                result = btoa(inputText);
            } else {
                result = atob(inputText);
            }
            
            // Animate the conversion - slide out old value, slide in new value
            outputArea.style.transform = 'translateY(10px)';
            outputArea.style.opacity = '0';
            
            setTimeout(() => {
                outputArea.value = result;
                outputArea.style.transform = 'translateY(0)';
                outputArea.style.opacity = '1';
            }, 150);
            
            showStatus(`Text ${currentMode}d successfully!`);
            createRippleEffect(convertBtn);
        } catch (error) {
            outputArea.value = '';
            showStatus(`Error: Invalid input for ${currentMode}ing`);
            shakeElement(inputArea);
        }
    });
    
    // Copy functionality with animation
    copyBtn.addEventListener('click', () => {
        if (!outputArea.value) {
            showStatus('Nothing to copy');
            shakeElement(copyBtn);
            return;
        }
        
        outputArea.select();
        document.execCommand('copy');
        
        // For modern browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(outputArea.value)
                .then(() => {
                    showStatus('Copied to clipboard!');
                    createRippleEffect(copyBtn);
                    flashElement(outputArea);
                })
                .catch(() => {
                    showStatus('Failed to copy');
                    shakeElement(copyBtn);
                });
        } else {
            showStatus('Copied to clipboard!');
            createRippleEffect(copyBtn);
            flashElement(outputArea);
        }
    });
    
    // Clear functionality with animation
    clearBtn.addEventListener('click', () => {
        if (inputArea.value || outputArea.value) {
            // Animate clearing
            if (inputArea.value) fadeOutAndClear(inputArea);
            if (outputArea.value) fadeOutAndClear(outputArea);
            createRippleEffect(clearBtn);
            showStatus('Cleared!');
        } else {
            shakeElement(clearBtn);
        }
    });
    
    // Helper functions
    function clearFields() {
        inputArea.value = '';
        outputArea.value = '';
        statusElement.textContent = '';
        statusElement.classList.remove('show');
    }
    
    function fadeOutAndClear(element) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.value = '';
            element.style.opacity = '1';
        }, 300);
    }
    
    function showStatus(message) {
        statusElement.textContent = message;
        statusElement.classList.add('show');
        statusElement.style.opacity = '1';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusElement.classList.remove('show');
            statusElement.style.opacity = '0';
        }, 3000);
    }
    
    function shakeElement(element) {
        element.classList.add('shake');
        element.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    function flashElement(element) {
        const originalBg = element.style.backgroundColor;
        element.style.transition = 'background-color 0.3s ease';
        element.style.backgroundColor = 'rgba(41, 98, 255, 0.1)';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
        }, 300);
    }
    
    function createRippleEffect(button) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = button.getBoundingClientRect();
        ripple.style.left = `${rect.width / 2}px`;
        ripple.style.top = `${rect.height / 2}px`;
        
        button.appendChild(ripple);
        
        // Remove the ripple element when animation ends
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
    
    function animateButtonText(button, newText) {
        button.style.transform = 'translateY(10px)';
        button.style.opacity = '0';
        
        setTimeout(() => {
            button.textContent = newText;
            button.style.transform = 'translateY(0)';
            button.style.opacity = '1';
        }, 150);
    }
    
    // Add ripple effect to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '1px';
            ripple.style.height = '1px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = 'rgba(255, 255, 255, 0.7)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.6s, opacity 0.6s';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transform = 'scale(100)';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Keyframe animation definitions
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Allow encoding/decoding on Enter key when in input field
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            convertBtn.click();
        }
    });
    
    // Add some typing animation to inputs
    inputArea.addEventListener('input', debounce(() => {
        if (inputArea.value) {
            outputArea.classList.add('pulse');
            setTimeout(() => outputArea.classList.remove('pulse'), 500);
        }
    }, 300));
    
    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Initial setup - set tab indicator position
    setTimeout(() => {
        tabIndicator.style.transform = 'translateX(0)';
    }, 100);
});