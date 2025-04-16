export const matchIds = (id1: number, id2: number): boolean => {
    // Compare the two IDs
    if (id1 === id2) {
        return true; // IDs match
    } else {
        return false; // IDs do not match
    }
}