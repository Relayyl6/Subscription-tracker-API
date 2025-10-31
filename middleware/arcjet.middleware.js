import aj from "../config/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetMiddleWare = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 2 })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.writeHead(429, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Too Many Requests" }));
            } else if (decision.reason.isBot()) {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "No bots allowed" }));
            } else {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Forbidden" }));
            }
        } else if (decision.ip.isHosting()) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        } else if (decision.results.some(isSpoofedBot)) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        } else {
            next();
        }
    } catch (error){
        console.error(`Arcjet middleware Error: ${error}`)
        next(error)
    }
}

export default arcjetMiddleWare