// Refresh every 30s
chrome.alarms.create("updateVPN", { periodInMinutes: 0.5 });

async function updateVPNStatus() {
  try {
    const info = await fetch("https://ipapi.co/json/").then(r => r.json());

    const ip = info.ip;
    const country = info.country.toLowerCase(); // "us", "in", etc.
    const city = info.city;

    // Tooltip/hover title
    chrome.action.setTitle({
      title: `${city.toUpperCase()}, ${country.toUpperCase()} | ${ip}`
    });

    // Flag from FlagCDN (32px)
    const flagURL = `https://flagcdn.com/32x24/${country}.png`;
    const res = await fetch(flagURL);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    // Apply to icon
    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 4, 32, 24); // vertical center
    const iconData = ctx.getImageData(0, 0, 32, 32);

    chrome.action.setIcon({ imageData: iconData });

  } catch (error) {
    // No Internet / VPN blocked / offline
    chrome.action.setTitle({ title: "No Internet / Disconnected" });
    chrome.action.setIcon({ path: "icons/icon.png" });
  }
}

chrome.alarms.onAlarm.addListener(updateVPNStatus);
updateVPNStatus();
