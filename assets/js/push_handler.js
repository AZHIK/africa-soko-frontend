const publicKey = "BN_iu1SqGDnG6UkNWebV177wPHgyi-0ARussIZuKmCtncs0xQmVud5AHKlGjBV-7TRVvW80kYN4hCUNnXzrELyk";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
};

async function subscribeUser() {
  console.log("waiting for subscription!")
  try {
    const reg = await registerSW();
    const readyReg = await navigator.serviceWorker.ready;
    const sub = await readyReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    const payload = { username: localStorage.getItem("sokoni_identity"), subscription: sub };

    const res = await fetch(`${MAIN_SERVER}/subscribe_push`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("User subscribed:", data);
  } catch (err) {
    console.error("Subscription failed:", err);
  }
};

// subscribeUser();