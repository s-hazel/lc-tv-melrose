import * as admin from 'firebase-admin';

// Go to project settings - service accounts - generate new private key
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "hc-mhs-tv",
            clientEmail: "firebase-adminsdk-8s01a@hc-mhs-tv.iam.gserviceaccount.com",
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        databaseURL: "https://hc-mhs-tv-default-rtdb.firebaseio.com",
        databaseAuthVariableOverride: {
            uid: 'trusted'
        }
    });
}

export default async function handler(req, res) {
    try {
        // ASPENBRIDGE
        const url = "https://aspenbridge-3dko.onrender.com/schedule"

        const response = await fetch(url, {
            headers: {
                'X-API-Key': process.env.SCHEDULE_KEY
            }
        })
        const data = await response.json()

        // FIREBASE
        // const data = {
        //     "schedule": [
        //         {
        //             "time": "8:15 AM - 9:17 AM",
        //             "block": "A",
        //             "meets": "(M,W,R,F)"
        //         },
        //         {
        //             "time": "9:20 AM - 10:17 AM",
        //             "block": "C",
        //             "meets": "(M,T,W,F)"
        //         },
        //         {
        //             "time": "10:20 AM - 11:17 AM",
        //             "block": "D",
        //             "meets": "(T,F)"
        //         },
        //         {
        //             "time": "11:19 AM - 12:41 PM",
        //             "block": "E",
        //             "meets": "(M,T,R,F)"
        //         },
        //         {
        //             "time": "12:44 PM - 1:41 PM",
        //             "block": "F",
        //             "meets": "(T,W,R,F)"
        //         },
        //         {
        //             "time": "1:44 PM - 2:41 PM",
        //             "block": "G",
        //             "meets": "(T,W,R,F)"
        //         }
        //     ]
        // }

        const db = admin.database()
        const scheduleRef = db.ref("sched");
        // const newScheduleRef = push("schedule"); // Generates a unique ID

        const date = new Date()
        const dateString = new Date().toLocaleDateString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        await scheduleRef.set({
            user: "trusted",
            date: dateString,
            output: data.schedule
        })

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch aspen and save to fb rtdb' })
    }
}