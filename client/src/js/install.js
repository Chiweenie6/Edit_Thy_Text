const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    window.deferredPrompt = event;
    butInstall.classList.toggle("hidden", false);
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    const textEvent = window.deferredPrompt;
    if (!textEvent) {
        return;
    }
    textEvent.prompt();
    window.deferredPrompt = null;
    butInstall.classList.toggle("hidden", true);
    console.log("👍 App Installed")
});

// Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    window.deferredPrompt = null;
    console.log("🎊", "appinstalled", event)
});
