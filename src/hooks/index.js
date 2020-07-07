import { useState, useEffect } from "react";
const cachedScripts = []
export function useScript(
    src,
    attributes,
) {
    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false,
    });

    useEffect(() => {
        // If cachedScripts array already includes src that means another instance ...
        // ... of this hook already loaded this script, so no need to load again.
        if (cachedScripts.includes(src)) {
            setState({
                loaded: true,
                error: false,
            });
        } else {
            cachedScripts.push(src);

            // Create script
            const script = document.createElement('script');
            script.src = src;
            script.async = true; // NOTE: only guaranteed to be async on newer browsers

            if (attributes !== {}) {
                Object.keys(attributes).forEach(key => {
                    script.setAttribute(key, attributes[key]);
                });
            }

            // Script event listener callbacks for load and error
            const onScriptLoad = ()=> {
                setState({
                    loaded: true,
                    error: false,
                });
            };

            const onScriptError = ()=> {
                // Remove from cachedScripts we can try loading again
                const index = cachedScripts.indexOf(src);
                if (index >= 0) cachedScripts.splice(index, 1);
                script.remove();

                setState({
                    loaded: true,
                    error: true,
                });
            };

            script.addEventListener('load', onScriptLoad);
            script.addEventListener('error', onScriptError);

            // Add script to document body
            document.body.appendChild(script);

            // Remove event listeners on cleanup
            return ()=> {
                script.removeEventListener('load', onScriptLoad);
                script.removeEventListener('error', onScriptError);
            };
        }
    }, [src,attributes]); // Only re-run effect if script src changes

    return [state.loaded, state.error];
}
