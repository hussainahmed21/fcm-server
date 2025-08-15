const express = require("express");
const admin = require("firebase-admin");

// এই কোডটি পরিবেশ ভেরিয়েবল (Environment Variable) থেকে আপনার গোপন কী পড়বে
// এটি Render.com-এ সেট করতে হবে
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 3000;

// ওয়েলকাম মেসেজ দেখানোর জন্য
app.get("/", (req, res) => {
    res.status(200).send("FCM Server is running!");
});

// নোটিফিকেশন পাঠানোর জন্য মূল URL
app.get("/sendNotification", async (req, res) => {
    // URL থেকে ডেটাগুলো নেওয়া হচ্ছে
    const { topic, title, body, imageUrl } = req.query;

    if (!topic  !title  !body) {
        return res.status(400).send("Error: 'topic', 'title', and 'body' are required parameters.");
    }

    const payload = {
        notification: { title, body },
        topic: topic,
    };

    if (imageUrl) {
        payload.notification.imageUrl = imageUrl;
    }

    try {
        const response = await admin.messaging().send(payload);
        res.status(200).send("Notification sent successfully! Message ID: " + response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error sending notification: " + error.message);
    }
});

app.listen(port, () => {
  console.log(Server listening on port ${port});
});