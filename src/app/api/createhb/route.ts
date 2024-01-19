import { getRegionInfo } from "@hyperbeam/web";
export async function GET(request: Request) {
    let embedUrl;
    const region = await getRegionInfo();
    const sessions = await fetch("https://engine.hyperbeam.com/v0/vm", {
        headers: {
            Authorization: "Bearer " + process.env.HYPERBEAM_API_KEY,
        },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
    console.log(sessions);

    // search for sessions
    if (sessions.results.length > 0) {
        const session_id = sessions.data.results[0]["id"];
        const session = await fetch(
            "https://engine.hyperbeam.com/v0/vm/" + session_id,
            {
                headers: {
                    Authorization: "Bearer " + process.env.HYPERBEAM_API_KEY,
                },
            }
        )
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            });

        embedUrl = session["embed_url"];
        console.log(session);

        if (sessions.results.length > 1) {
            console.log("multiple sessions exist");
        }
    } else {
        const body = JSON.stringify({
            region: region,
            timeout: {
                inactive: 60,
                offline: 300,
            },
            dark: true,
            tag: "singleton",
        });
        // create session if none exists
        const session = await fetch("https://engine.hyperbeam.com/v0/vm", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + process.env.HYPERBEAM_API_KEY,
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({
            //     region: region,
            //     timeout: {
            //         inactive: 60,
            //         offline: 300,
            //     },
            //     dark: true,
            //     tag: "singleton",
            // }),
        })
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            });

        embedUrl = session["embed_url"];
    }

    return Response.json({ embedUrl });
}
