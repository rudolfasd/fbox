const loadScript = (scriptSrc, scriptId, callback) => {
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.id = scriptId;
        document.head.appendChild(script);
        script.onload = () => {
            callback();
        };
    };
};

export default loadScript;