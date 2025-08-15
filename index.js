const express = require("express");
const admin = require("firebase-admin");

// পরিবেশ ভেরিয়েবল থেকে আপনার গোপন কী পড়া হচ্ছে
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 3000;

// ওয়েলকাম মেসেজ
app.get("/", (req, res) => {
    res.status(200).send("FCM Server is running!");
});

// নোটিফিকেশন পাঠানোর URL
app.get("/sendNotification", async (req, res) => {
    const { topic, title, body, imageUrl } = req.query;

    if (!topic || !title || !body) {
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
  // ----> এই লাইনটি ঠিক করা হয়েছে <----
  console.log(`Server listening on port ${port}`);
});