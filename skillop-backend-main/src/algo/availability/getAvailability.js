const getAvailability = (order, availability) => {
    const newAvailability = [];
    let i = 0,
        j = 0;

    while (i < availability.length && j < order.length) {
        const o = order[j],
            a = availability[i];
        if (order[j].e <= availability[i].e) {
            if (order[j].s < availability[i].s) {
                console.log(
                    order[j],
                    " Invalid order 💩 | Order start before the mentor is available"
                );
                j++;
            } else {
                if (o.s == a.s) {
                    if (o.e == a.e) {
                        i++;
                    } else {
                        availability[i].s = o.e;
                    }
                } else {
                    if (o.e == a.e) {
                        newAvailability.push({ s: a.s, e: o.s });
                        i++;
                    } else {
                        newAvailability.push({ s: a.s, e: o.s });
                        availability[i].s = o.e;
                    }
                }
                j++;
            }
        } else {
            if (o.s < a.e) {
                console.log(
                    o,
                    " Invalid order💩 | Order takes mentors non avaibility time!"
                );
                j++;
            } else {
                newAvailability.push(a);
                i++;
            }
        }
    }
    while (j < order.length) {
        console.log("💩 invalid data");
    }
    while (i < availability.length) {
        newAvailability.push(availability[i]);
        i += 1;
    }
    return newAvailability;
};
module.exports = getAvailability;

if (require.main === module) {
    const availability = [
        { s: 700, e: 800 },
        { s: 900, e: 1000 },
        { s: 1200, e: 1400 },
        { s: 1900, e: 2100 },
        { s: 2200, e: 2359 },
    ];

    const order = [
        { s: 710, e: 730 },
        { s: 900, e: parseInt("0910") },
    ];

    console.log(getAvailability(order, availability));
}
