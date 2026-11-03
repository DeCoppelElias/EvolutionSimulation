import { useCallback, useState } from "react";
import { addressFor, worldFromAddress } from "./address";
import type { Api } from "./api";
import { Notice } from "./Notice";
import { Picker } from "./Picker";
import { useTheme } from "./useTheme";
import { WorldView } from "./WorldView";

export function App({ api }: { api: Api }) {
    const [worldId, setWorldId] = useState(() => worldFromAddress(window.location.search));
    const [notice, setNotice] = useState<string | null>(null);
    const theme = useTheme();

    const open = useCallback((id: string | null) => {
        window.history.replaceState(null, "", addressFor(id));
        setWorldId(id);
    }, []);
    const leave = useCallback(
        (reason: string | null) => {
            if (reason !== null) {
                setNotice(reason);
            }
            open(null);
        },
        [open],
    );

    const shown = notice !== null && <Notice text={notice} onClose={() => setNotice(null)} />;
    return worldId === null ? (
        <Picker api={api} theme={theme} notice={shown} onOpen={open} onError={setNotice} />
    ) : (
        <WorldView
            key={worldId}
            api={api}
            id={worldId}
            theme={theme}
            notice={shown}
            onLeave={leave}
            onError={setNotice}
        />
    );
}
