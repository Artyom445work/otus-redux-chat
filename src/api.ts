const config = {
    firebaseBaseUrl: "https://otus-js-chat-4ed79-default-rtdb.firebaseio.com",
    firebaseCollection: "messages.json"
};

// /**
//  * @return {Object[]} messagesList
//  */
export async function getMessagesList() {
    return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) =>
            Object.values(data).map((el) => ({
                ...el,
                date: new Date(el.date)
            }))
        );
}

// /**
//  * @param {Object} data
//  * @param {string} data.nickname
//  * @param {string} data.message
//  * @returns {boolean}
//  */
export async function sendMessage(data) {
    return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
        method: "POST",
        body: JSON.stringify({
            ...data,
            date: new Date()
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then((response) => response.json());
}