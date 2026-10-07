// Vercel Serverless Function: Real-Time Multi-Device Availability Status API
let globalStatus = {
    status: 'online',
    badgeText: "Available for Projects — Let's Build Something!",
    chatText: "Typically replies instantly",
    updatedAt: Date.now()
};

export default function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
            if (body.status) {
                globalStatus = {
                    status: body.status || globalStatus.status,
                    badgeText: body.badgeText || globalStatus.badgeText,
                    chatText: body.chatText || globalStatus.chatText,
                    updatedAt: Date.now()
                };
            }
        } catch (e) {}
        return res.status(200).json(globalStatus);
    }

    return res.status(200).json(globalStatus);
}
