export async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');
    if (!statusElem) {
        return;
    }

    try {
        const response = await fetch('/check-db-connection');
        const data = await response.json();
        statusElem.textContent = data.success ? 'connected' : 'unable to connect';
    } catch (error) {
        statusElem.textContent = 'connection error';
    } finally {
        if (loadingGifElem) {
            loadingGifElem.style.display = 'none';
        }
        statusElem.style.display = 'inline';
    }
}
