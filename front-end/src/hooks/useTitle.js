import { useEffect } from "react";

const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        window.scrollTo({ top: 0, behavior: "smooth" });

        return () => document.title = prevTitle;
    }, [title])

}

export default useTitle