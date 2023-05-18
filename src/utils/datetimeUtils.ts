const addZero = (n: number) => '0'.concat(n.toString()).slice(-2);

export const timestamp = () => {
    const ts = new Date();
    const hours = addZero(ts.getHours());
    const minutes = addZero(ts.getMinutes());

    return `${hours}:${minutes}`;
}
