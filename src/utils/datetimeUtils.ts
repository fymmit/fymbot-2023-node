const addZero = (n: number) => '0'.concat(n.toString()).slice(-2);

export const timestamp = (showMinutes: boolean, time?: Date) => {
    const ts = time ? new Date(time) : new Date();
    const hours = addZero(ts.getHours());
    const minutes = addZero(ts.getMinutes());

    return showMinutes ? `${hours}:${minutes}` : `${hours}`;
}

