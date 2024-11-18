import { useEffect, useState } from "react";

//
// This Hook wraps and manages the logic for loading and returning the number of instances in every environment.
//
export default function useCountEnvs() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<{ env: string, count: number }[] | undefined>();

    useEffect(() => {
        setLoading(true);
        fetch("/api/count-envs")
            .then(res => res.json())
            .then(
                (result) => setItem(result),
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => setError(error)
            ).finally(() => setLoading(false));
    }, [])

    return { loading, error, value: item }
}