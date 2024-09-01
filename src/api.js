async function getFreeSlots(date, timezone) {
    const payload = new URLSearchParams({date, timezone});
    const url = `/api/free-slots?${payload.toString()}`
    const options = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "GET",
    }
    const response = await fetch(url, options);
    if (response.status != 200) {
        throw new Error("something went Wrong")
    }
    const data = await response.json()
    if(data.status === "success"){
        return data.data
    }
    throw new Error(data.message)
}

async function bookSlot(date, time, timezone){
    const payload = {
        date, timezone,
        startTime: time,
        doctor: "John"
    }
    const url = "api/book-event"
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    }
    const response = await fetch(url, options);
    if (response.status != 200) {
        throw new Error("Something went wrong")
    }
    const data = await response.json();
    if(data.status === 'success'){
        return data.data
    }
    throw new Error(data.message)
}

export {
    getFreeSlots,
    bookSlot
}

