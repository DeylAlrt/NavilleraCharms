// Vercel Web Analytics
// This script initializes Vercel's analytics tracking for page views
// Following the vanilla JavaScript setup from: https://vercel.com/docs/analytics/quickstart
(function() {
    window.va = window.va || function () { 
        (window.vaq = window.vaq || []).push(arguments); 
    };
    
    // Load the analytics script
    var script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
})();
