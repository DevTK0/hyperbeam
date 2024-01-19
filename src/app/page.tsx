"use client";

import { useRef, useEffect } from "react";
import Hyperbeam, { HyperbeamEmbed } from "@hyperbeam/web";

export default function Home() {
    const div = useRef<HTMLDivElement>(null);
    let hyperbeam: HyperbeamEmbed | undefined;

    useEffect(() => {
        fetch("api/createhb")
            .then((res) => res.json())
            .then((res) => {
                if (div.current != null) {
                    Hyperbeam(div.current, res["embedUrl"])
                        .then((hb) => {
                            hyperbeam = hb;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });

        return () => {
            hyperbeam?.destroy();
        };
    }, []);

    return (
        <main>
            <div className="w-full h-full" ref={div}></div>
        </main>
    );
}
