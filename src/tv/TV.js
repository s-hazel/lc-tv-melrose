import "./TV.css"
import { useState, useEffect } from "react"
import Block from "./Block"
import wmo from "./wmoCodes.json"

import { getDatabase, ref, onValue } from "firebase/database";
import app from "../fb/fbConfig.js";

const TV = () => {
    const date = new Date()

    const [time, setTime] = useState(new Date().toLocaleTimeString([], { timeStyle: "short" }))

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { timeStyle: "short" }))
            setTimeRemaining()
            setProgress()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    const [weatherTemp, setWeatherTemp] = useState(0)
    const [weatherHi, setWeatherHi] = useState(0)
    const [weatherLo, setWeatherLo] = useState(0)
    const [weatherDesc, setWeatherDesc] = useState("")
    const [weatherRain, setWeatherRain] = useState("0")
    const [weatherWind, setWeatherWind] = useState("0")
    const [wmoBkgrd, setWeatherBkgrd] = useState(wmo["0"].background)

    const [menuToday, setMenuToday] = useState(["./no-lunch.jpg", "No lunch today"])

    const [announcements, setAnnouncements] = useState({ data: [] })

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const weather_url = "https://api.open-meteo.com/v1/forecast?latitude=42.4584&longitude=-71.0662&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max&current=temperature_2m&timezone=America%2FNew_York&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
                const res = await fetch(weather_url)
                const weatherData = await res.json()
                setWeatherTemp(Math.round(weatherData["current"]["temperature_2m"]))
                setWeatherHi(Math.round(weatherData["daily"]["temperature_2m_max"][0]))
                setWeatherLo(Math.round(weatherData["daily"]["temperature_2m_min"][0]))
                setWeatherDesc(wmo[weatherData["daily"]["weather_code"][0]].description)
                setWeatherBkgrd(wmo[weatherData["daily"]["weather_code"][0]].background)
                setWeatherRain(weatherData["daily"]["precipitation_probability_max"])
                setWeatherWind(weatherData["daily"]["wind_speed_10m_max"][0])
            } catch (err) {
                console.log(err)
            }
        }

        const fetchLunch = async () => {
            try {
                // const proxyUrl = "https://corsproxy.io/?"
                const targetUrl = "https://melroseschools.api.nutrislice.com/menu/api/weeks/school/melrose/menu-type/breakfast/2025/10/17/"
                // const res = await fetch(proxyUrl + encodeURIComponent(targetUrl))

                const dateToday = date.toISOString().split("T")[0]

                const res = await fetch(`/api/menu?date=${dateToday}`)
                const data = await res.json()
                console.log(data)
                const loop = data["days"]

                let today = {}
                for (const day of loop) {
                    if (day["date"] === dateToday) {
                        today = day["menu_items"]
                        break
                    }
                }

                for (const item of today) {
                    if (item["position"] === 1) {
                        // Empty image URLs
                        if (item["food"]["image_url"] === "") {
                            setMenuToday(["./not-available.jpg", item["food"]["name"]])
                        } else {
                            setMenuToday([item["food"]["image_url"], item["food"]["name"]])
                        }
                        return
                    }
                }
                setMenuToday(["./no-lunch.jpg", "No lunch today"])
            } catch (error) {
                console.log(error)
                setMenuToday(["./no-lunch.jpg", "No lunch today"])
            }
        }

        const fetchAnn = async () => {
            try {
                const res = await fetch("/api/announcements")
                const data = await res.json()
                setAnnouncements(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchWeather()
        fetchLunch()
        fetchAnn()
    }, [])

    const [currentAnn, setCurrentAnn] = useState(0)

    useEffect(() => {
        const annInterval = setInterval(() => {
            setCurrentAnn(prev => {
                if (prev < announcements?.data.length - 1) {
                    return prev + 1
                } else {
                    return 0
                }
            })
        }, 10000)

        return () => {
            clearInterval(annInterval)
        }
    }, [announcements?.data.length])


    const [percentComplete, setPercentComplete] = useState("0%")

    const setProgress = () => {
        var r = document.querySelector(":root")
        r.style.setProperty('--progress-bar', '0%')

        let now = new Date()

        // Set the start and end times
        let startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15)
        let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 41)

        if (now >= startTime && now <= endTime) {
            let duration = endTime - startTime

            let elapsed = now - startTime

            let percentage = (elapsed / duration) * 100

            // Update the width of the progress bar
            r.style.setProperty('--progress-bar', percentage + "%")
            setPercentComplete(Math.floor(percentage) + "%")
        } else if (now >= endTime) {
            r.style.setProperty('--progress-bar', '100%')
            setPercentComplete("100%")
        } else {
            r.style.setProperty('--progress-bar', '0%')
        }
    }

    const [remaining, setRemaining] = useState("0h 0m")

    const setTimeRemaining = () => {
        let now = new Date()

        let time1441 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 41)

        let difference = time1441 - now

        if (difference > 0) {
            let hours = Math.floor(difference / 1000 / 60 / 60)
            difference -= hours * 1000 * 60 * 60
            let minutes = Math.floor(difference / 1000 / 60)

            setRemaining(hours + "h " + minutes + "m")
        }
    }

    const [schedule, setSchedule] = useState()

    // TESTING
    // const [schedule, setSchedule] = useState(
    //     [
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
    //         }
    //     ]
    // )

    // Check DB for schedule
    useEffect(() => {
        const db = getDatabase(app);
        const scheduleRef = ref(db, "sched");

        onValue(scheduleRef, (snapshot) => {
            const data = snapshot.val();
            const dateString = new Date().toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            if (data) {
                if (data.date === dateString) {
                    console.log("USING DB")
                    setSchedule(data.output)
                } else {
                    console.log("DATES DON'T MATCH, FETCHING")
                    postSchedule()
                }
            } else {
                console.log("NO SCHED DATA IN DB")
                postSchedule()
            }
        });
    }, []);

    const postSchedule = async () => {
        // set blank for loader
        setSchedule()
        try {
            const res = await fetch("/api/aspen")
            const data = await res.json()
            setSchedule(data.schedule)
        } catch (err) {
            console.error(err)
        }
    }

    const isWeekend = () => {
        const day = new Date().getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    }

    return (
        <div className="tv">
            <div className="head">
                <img src="./main-logo.jpeg" alt="" className="schoolLogo" />
                <div className="today">
                    <p className="day">{date.toLocaleDateString("default", { weekday: "long" })},</p>
                    <p className="monthDate">{date.toLocaleDateString("default", { month: "long" }) + " " + date.getDate()}</p>
                </div>
                <p className="time">{time}</p>
            </div>
            <div className="divide">
                <div className="widgets">
                    <div className="stats">
                        <div className="timeLeft">
                            <p className="countdown">{remaining}</p>
                            <p className="remaining">Remaining</p>
                        </div>
                        <div className="percentComplete">
                            <p className="percent">{percentComplete}</p>
                            <p className="complete">Complete</p>
                        </div>
                    </div>
                    <div className="weather">
                        <img src={wmoBkgrd} alt="" className="weatherImage" />
                        <div className="weatherData">
                            <div className="mainWeather">
                                <p className="temp">{weatherTemp}<span className="degrees"> °F</span></p>
                                <p>{weatherDesc}</p>
                            </div>
                            <div className="spaceBetween">
                                <div className="extraWeather">
                                    <div className="hiLo">
                                        <span>
                                            <span className="hi material-symbols-rounded">arrow_upward</span> {weatherHi}°
                                        </span>
                                        <span>
                                            <span className="lo material-symbols-rounded">arrow_downward</span> {weatherLo}°
                                        </span>
                                    </div>
                                </div>
                                <div className="weatherDetails">
                                    <div className="weatherAlpha">
                                        <div className="weatherIconText">
                                            <span className="material-symbols-rounded">rainy</span>
                                            <p>{weatherRain}%</p>
                                        </div>
                                        <div className="weatherIconText">
                                            <span className="material-symbols-rounded">air</span>
                                            <p>{weatherWind} mph</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lunch">
                        <img src={menuToday[0]} alt="" className="lunchPicture" />
                        <div className="lunchText">
                            <p className="lunchStatic">Lunch</p>
                            <p className="meal">{menuToday[1]}</p>
                        </div>
                    </div>
                </div>
                <div className="schedAnn">
                    <div className="schedule">
                        {schedule ? (
                            <div className="blocks">
                                {schedule.map(block => (
                                    <Block key={block.block} meets={block.meets} letter={block.block} time={block.time} />
                                ))}
                            </div>
                        ) : (
                            !isWeekend() && (
                                <div className="load">
                                    <img src="./aspen-logo.png" alt="" className="aspen" />
                                    <div className="loader"></div>
                                </div>
                            )
                        )}
                        <div className="progressOutline">
                            <div className="progress"></div>
                        </div>
                    </div>
                    <div className="annTag">
                        <p className="annStatic">Announcements</p>
                        <p className="annFraction">
                            {announcements?.data.length > 0
                                ? `${currentAnn + 1}/${announcements.data.length}`
                                : "0/0"
                            }
                        </p>
                    </div>
                    <div className="announcement">
                        {announcements.data.length > 0 ? (
                            <div className="fullAnn">
                                <div className="annText">
                                    <p className="annOrganization">
                                        {announcements.data[currentAnn]?.organization}
                                    </p>
                                    <p className="annBody">
                                        {announcements.data[currentAnn]?.body}
                                    </p>
                                    <p className="annContact">
                                        Contact {announcements.data[currentAnn]?.email} for more information.
                                    </p>
                                </div>
                                {announcements.data[currentAnn].cost && (
                                    <div className="cost">
                                        <img src="./coin.svg" alt="" className="coin" />
                                        <p className="annCost">{announcements.data[currentAnn]?.cost}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="caughtUp">All caught up!</div>
                        )
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TV;