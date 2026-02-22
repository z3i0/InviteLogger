
async function check() {
    const res = await fetch(`http://localhost:5000/api/bot/emojis/1438114753263177750`);
    const data = await res.json();
    console.log(`TOTAL_RETURNED: ${data.length}`);
}
check();
