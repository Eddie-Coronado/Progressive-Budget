let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore("pending", { autoIncrement: true })
}

request.onsuccess = ({ target }) => {
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function (event) {
    console.log('Something went wrong please try again')
};

function saveData(data) {
    const transaction = db.transaction(['pending'], 'readwrite')
    const store = transaction.objectStore('Pending')

    store.add(data);
}

function checkdata() {
    const transaction = db.transaction(['pending'], 'readwrite')
    const storeTransaction = transaction.objectStore('pending')
    const getData = store.getAll()

    getData.onsuccess = function () {
        if (getData.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: "POST",
                body: JSON.stringify(getData.result),
                headers: {
                    Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const storeTransaction = transaction.objectStore("pending");
                    storeTransaction.clear();
                })
        }
    }
}

window.addEventListener("online", checkdata)