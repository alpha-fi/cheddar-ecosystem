import { getConfig } from "@/configs/config"

let id = 0

export async function view(contractId: string, method: string, args: Record<string, any>): Promise<any> {
    const argsBase64 = btoa(JSON.stringify(args))
    const params = {
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: argsBase64,
        finality: "optimistic",
    }
    return callRpc("query", params)
}

async function callRpc(method: string, params: Record<string, any>): Promise<any> {
    const config = getConfig()
    const payload = {
        method,
        params,
        id: ++id,
        jsonrpc: "2.0"
    }

    const rpcOptions = {
        body: JSON.stringify(payload),
        method: "POST",
        headers: { 'Content-type': 'application/json; charset=utf-8' }
    }

    const response = await fetch(config.networkData.nodeUrl, rpcOptions);
    const json = await response.json()
    // handlePossibleError(json, rpcOptions)
    return JSON.parse(encodeUTF8(json.result.result))
}

export function encodeUTF8(arr: Uint8Array): string {
    const s: string[] = [];
    for (let i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
    return decodeURIComponent(escape(s.join('')))
}