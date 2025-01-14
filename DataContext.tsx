import { createContext, useContext, useEffect, useState } from "react";
import createApiClient from "./clients/apiClient";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Grant } from "./model/Grant";

type DataContextType = {
    numberToCountMap: Map<number, number>;
    grants: Grant[];
    nextGrantTimestamp: Date;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType|undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [numberToCountMap, setNumberToCountMap] = useState<Map<number, number>>(new Map());
    const [grants, setGrants] = useState<Grant[]>([]);
    const [nextGrantTimestamp, setNextGrantTimestamp] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthenticator();
    const userId = user.userId;

    async function fetchData() {
        setIsLoading(true);
        setError(null);

        try {
            const apiClient = await createApiClient();
            const numberToCountMap = await apiClient.fetchNumbers(userId);
            setNumberToCountMap(numberToCountMap);

            const grants = await apiClient.fetchGrants(userId);
            setGrants(grants);

            const nextGrantTimestamp = await apiClient.fetchNextGrantTimestamp(userId);
            setNextGrantTimestamp(nextGrantTimestamp);
        } catch (err) {
            setError("Failed to fetch data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const refreshData = async () => {
        await fetchData();
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider
            value={{ numberToCountMap, grants, nextGrantTimestamp, isLoading, error, refreshData }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}