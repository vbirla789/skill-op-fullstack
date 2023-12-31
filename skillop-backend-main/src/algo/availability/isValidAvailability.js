const isValidAvailability = (availability) => {
    console.log(availability)
    availability = availability.sort((a, b) => {
        if (a.s == b.s) {
            return a.e - b.e;
        }
        return a.s - b.s;
    });
    for (let i = 0; i < availability.length - 1; i++) {
        if (availability[i].e > availability[i + 1].s) {
            return false;
        }
    }
    return availability;
}

module.exports = isValidAvailability;