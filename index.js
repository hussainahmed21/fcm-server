const express = require("express");﻿
const admin = require("firebase-admin");﻿

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);﻿

admin.initializeApp({﻿
  credential: admin.credential.cert(serviceAccount)﻿
});﻿

const app = express();﻿
const port = process.env.PORT || 3000;﻿

app.get("/", (req, res) => {﻿
    res.status(200).send("FCM Server is running!");﻿
});﻿

app.get("/sendNotification", async (req, res) => {﻿
    const { topic, token, title, body, imageUrl } = req.query;﻿

    if (!title || !body) {﻿
        return res.status(400).send("Error: 'title' and 'body' are required.");﻿
    }﻿
﻿
    if (!topic && !token) {﻿
        return res.status(400).send("Error: Either 'topic' or 'token' parameter is required.");﻿
    }﻿
    const notificationPayload = {﻿
        title: title,﻿
        body: body,﻿
    };﻿

    if (imageUrl) {﻿
        notificationPayload.imageUrl = imageUrl;﻿
    }﻿
﻿
    const message = {﻿
        notification: notificationPayload﻿
    };﻿
﻿
    if (token) {﻿
        message.token = token;﻿
    }﻿
    else if (topic) {﻿
        message.topic = topic;﻿
    }﻿

    try {﻿
        const response = await admin.messaging().send(message);﻿
        res.status(200).send("Notification sent successfully! Message ID: " + response);﻿
    } catch (error) {﻿
        console.error("Error:", error);﻿
        if (error.code === 'messaging/registration-token-not-registered') {﻿
            res.status(404).send("Error: The provided token is not valid or has expired.");﻿
        } else {﻿
            res.status(500).send("Error sending notification: " + error.message);﻿
        }﻿
    }﻿
});﻿

app.listen(port, () => {﻿
  console.log(`Server listening on port ${port}`);﻿
});