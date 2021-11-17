import { escapeQuery } from "./utils";
import { AggregationAuth } from "./field-aggregations-auth";
import { stringifyObject } from "../utils";

/** Wraps a query inside an apoc call, escaping strings and serializing params */
export function wrapInApocRunFirstColumn(query: string, params: Record<string, string> = {}): string {
    const serializedParams = stringifyObject(params);
    const escapedQuery = escapeQuery(query);
    return `head(apoc.cypher.runFirstColumn(" ${escapedQuery} ", ${serializedParams}))`;
}

export function serializeAuthParamsForApocRun(auth: AggregationAuth): Record<string, string> {
    const authParams = serializeParamsForApocRun(auth.params);
    if (auth.query) authParams.auth = "$auth";
    return authParams;
}

export function serializeParamsForApocRun(params: Record<string, any>): Record<string, string> {
    return Object.keys(params).reduce((acc, key) => {
        acc[key] = `$${key}`;
        return acc;
    }, {});
}
