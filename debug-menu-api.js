
async function main() {
    const url = 'http://localhost:3002/api/restaurants/cmlf1lyd90007i0ichsyysh7u/menu';
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', text);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}
main();
