import "./Resources.css"

const Resources = () => {
    return (
        <>
            <h1>Resources</h1>
            <hr />
            <div className="space">
                <h2>AspenBridge Student Credentials</h2>
                <p>The schedule component depends upon a student with a working schedule. AspenBridge logs into their account once a day and stores the current schedule in a database.</p>
                <ol>
                    <li>Log on to <a href="https://www.render.com" target="_blank">render.com</a> using the melroseSTL info.</li>
                    <li>Click on "AspenBridge" in the "aspen" project.</li>
                    <li>Go to the "Environment" tab.</li>
                    <li>Replace the value of ASPEN_USERNAME and ASPEN_PASSWORD.</li>
                    <li>Press "Save, Rebuild, and Deploy".</li>
                    <li>The service will restart in a few minutes and work as normal.</li>
                </ol>

                <p>Built by Sam Haseltine '27.</p>

            </div>
        </>
    )
}

export default Resources