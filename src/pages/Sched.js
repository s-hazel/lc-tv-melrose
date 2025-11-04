import { useState, useEffect } from "react";
import "./Sched.css";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../fb/fbConfig.js";

const Sched = () => {
    const [sched, setSched] = useState()
    const [email, setEmail] = useState()

    useEffect(() => {
        const db = getDatabase(app);
        const scheduleRef = ref(db, "sched");
        onValue(scheduleRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSched(data.output);
            } else {
                setSched()
            }
        });

        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userEmail = user.email;
                if (userEmail) {
                    setEmail(userEmail)
                }
            }
        });
    }, []);

    const postSchedule = async () => {
        try {
            const db = getDatabase(app);
            const schedRef = ref(db, "sched")
            remove(schedRef);
            const res = await fetch("/api/aspen")
            const data = await res.json()
        } catch (err) {
            console.error(err)
        }
    }

    const updateField = (index, field, value) => {
        setSched(prev => prev.map((block, i) =>
            i === index ? { ...block, [field]: value } : block
        ));
    };

    const saveSchedule = () => {
        const db = getDatabase(app);
        const scheduleRef = ref(db, "sched");
        update(scheduleRef, {
            user: email,
            output: sched
        });
    }

    const addRow = () => {
        setSched([...sched, {
            "time": "",
            "block": "",
            "meets": ""
        }])
    }

    const deleteRow = (index) => {
        setSched(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <>
            <h1>Schedule</h1>
            <hr />
            <div className="content">
                <div className="refresh">
                    <h2><span className="material-symbols-rounded">refresh</span>Refresh</h2>
                    <button className="aspenBridge" onClick={postSchedule}>
                        <img src="./aspen-logo.png" alt="" className="aspen-logo" />
                        <p>
                            <span className="bold">Aspen</span>Bridge
                        </p>
                    </button>
                </div>

                <div className="edit">
                    <h2><span className="material-symbols-rounded">edit</span> Edit</h2>

                    {sched && (
                        <div className="day-edit">
                            <table className="special-schedule">
                                <tbody className="special-body">
                                    <tr>
                                        <th className="trash"></th>
                                        <th>Block</th>
                                        <th>Time</th>
                                        <th>Meets</th>
                                    </tr>
                                    {sched.map((block, index) => (
                                        <tr key={`row-${index}`} className="special-row">
                                            <td className="delete" onClick={() => deleteRow(index)}>
                                                <span className="material-symbols-rounded">delete</span>
                                            </td>
                                            <td className="t-content">
                                                <input
                                                    type="text"
                                                    value={block.block}
                                                    onChange={(e) => updateField(index, 'block', e.target.value)}
                                                    className="t-input"
                                                />
                                            </td>
                                            <td className="t-label">
                                                <input
                                                    type="text"
                                                    value={block.time}
                                                    onChange={(e) => updateField(index, 'time', e.target.value)}
                                                    className="t-input"
                                                />
                                            </td>
                                            <td className="t-label">
                                                <input
                                                    type="text"
                                                    value={block.meets}
                                                    onChange={(e) => updateField(index, 'meets', e.target.value)}
                                                    className="t-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4} className="add" onClick={addRow}>
                                            <span className="material-symbols-rounded">add</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="save" onClick={saveSchedule}>Save</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sched