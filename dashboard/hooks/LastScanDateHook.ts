import { useEffect, useState } from "react";

//
// This Hook waps and manages the business logic for loading and returning the last scan date.
//
export default function useLastScanDate() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<string | undefined>();
  
    useEffect(() => {
    setLoading(true);
      fetch("/api/last-scan-date")
        .then(res => res.json())
        .then(
          (result) => {
            setLoading(false);
            setItem(result.lastScanDate);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setLoading(false);
            setError(error);
          }
        )
    }, [])

    return {loading, error, value: item }
}