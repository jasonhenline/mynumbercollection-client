import { Grant } from "@/model/Grant";
import { fetchAuthSession } from "@aws-amplify/auth";

const BASE_URL = "https://api.mynumbercollection.com";

class ApiClient {
    constructor(private accessToken: string) {}

    async fetchNumbers(userId: string): Promise<Map<number, number>> {
        const numbersJson = await this.fetchJson(`/${userId}/numbers`);
        const numberToCount = new Map<number, number>();
        for (const numberRecord of numbersJson["numbers"]) {
            const number = numberRecord["number"];
            const count = numberRecord["count"];
            numberToCount.set(number, count);
        }
        return numberToCount;
    }

    async fetchGrants(userId: string): Promise<Grant[]> {
        const grantsJson = await this.fetchJson(`/${userId}/grants`);
        const grants: Grant[] = [];
        for (const grantObject of grantsJson) {
            const numberToCountMap = new Map<number, number>();
            for (const numberRecord of grantObject["numbers"]) {
                numberToCountMap.set(numberRecord.number, numberRecord.count);
            }
            grants.push({
                timestamp: new Date(grantObject["event_time"]),
                numberToCountMap,
            });
        }
        return grants;
    }

    async fetchNextGrantTimestamp(userId: string): Promise<Date> {
        const nextGrantTimestampJson = await this.fetchJson(`/${userId}/next-grant`);
        return new Date(nextGrantTimestampJson["next_grant_time"]);
    }

    async fetchJson(endpoint: string, options: RequestInit = {}) {
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    }
}

async function createApiClient(): Promise<ApiClient> {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken;

    if (!accessToken) {
        throw new Error("No access token found");
    }

    return new ApiClient(accessToken.toString());
}

export default createApiClient;