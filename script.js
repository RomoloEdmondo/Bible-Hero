if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(error => {
      console.error("Registrazione service worker non riuscita:", error);
    });
  });
}

const installButton = document.getElementById("installAppBtn");

if (installButton) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  let installPrompt = null;

  if (isMobile && !isStandalone && isIos) {
    installButton.hidden = false;
    installButton.addEventListener("click", () => {
      window.alert(
        "Per installare Bibbia Interattiva: tocca Condividi e scegli “Aggiungi alla schermata Home”."
      );
    });
  }

  window.addEventListener("beforeinstallprompt", event => {
    if (!isMobile || isStandalone) return;

    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
  });
}
