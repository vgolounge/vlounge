import local from "./localization";

export function betTimerTick(close_at, opens_at, timer) {
    const dt = moment.utc(close_at).local();
    const dt2 = moment.utc(opens_at).local();
    const now = moment();
    const duration = moment.duration(dt.diff(now));
    let out = "";

    if(now.isBefore(dt) && now.isAfter(dt2)) {
        if (duration.get('days') > 0) {
            out += duration.get("days") + "d ";
            out += duration.get("hours") + "h ";
            out += duration.get("minutes") + "m ";
            out += duration.get("seconds") + "s";
        }
        else if (duration.get("hours") > 0) {
            out += duration.get("hours") + "h ";
            out += duration.get("minutes") + "m ";
            out += duration.get("seconds") + "s";
        }
        else if (duration.get("minutes") > 0) {
            out += duration.get("minutes") + "m ";
            out += duration.get("seconds") + "s";
        }
        else if (duration.get("seconds") > 0) {
            out += duration.get("seconds") + "s";
        }
        return out
    }
    else {
        clearInterval(timer)
        return local.LOCKED
    }
}