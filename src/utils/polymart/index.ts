import FormData from "form-data";
import got, {CancelableRequest, Response} from "got"
import File from "../io/file";
import SoftError from "../soft-error";

const baseUrl = "https://api.polymart.org/v1";

export interface Main {
    request:  Request;
    response: PolymartResponse;
}

export interface Request {
    time:        number;
    action:      string;
    cacheMaxAge: number;
    timeElapsed: string;
}

export interface PolymartResponse {
    success:  boolean;
    errors:   any[];
    update?: Update;
    updates?: Update[];
    resource?: Resource;
}

export interface Resource {
    id:                         string;
    title:                      string;
    subtitle:                   string;
    owner:                      Owner;
    team:                       null;
    price:                      string;
    currency:                   string;
    approved:                   string;
    creationTime:               string;
    supportedMinecraftVersions: string[];
    downloads:                  string;
    updates:                    Updates;
    thumbnailURL:               null;
    headerURL:                  null;
    themeColorLight:            string;
    themeColorDark:             string;
    reviews:                    Reviews;
    url:                        string;
}

export interface Owner {
    name: string;
    id:   string;
    type: string;
    url:  string;
}

export interface Reviews {
    count: number;
    stars: number;
}

export interface Updates {
    latest: Update;
}

export interface Update {
    id:          string;
    version?:    string;
    title?:       string;
    description?: string;
    downloadReady?: boolean;
    time?:        string;
    snapshot:    string;
    beta:        string;
    url?:        string;
}

export async function createVersion(resourceId: string, data: Record<string, any>, file: File, token: string): Promise<Update> {
    data = {
        ...data,
        resource_id: resourceId,
        api_key: token,
        beta: data.beta ? "1" : "0",
        snapshot: data.snapshot ? "1" : "0"
    };

    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
        form.append(key, value);
    }
    form.append("file", file.getStream(), file.name);


    const response = await got(`${baseUrl}/postUpdate`, {
        method: "POST",
        headers: form.getHeaders(),
        body: form
    });
    if (response.statusCode === 200) {
            // TypeScript doesn't know the types of external API data that can change at any time.
    const body: Main = JSON.parse(response.body as string);
    const { response: polyMartResponse } = body;
    if (polyMartResponse.success) {
        return polyMartResponse.update as Update;
    }
    } else {
        return processResponse(response);
    }
}

export function getResource(resourceId: string): Promise<Resource> {
    return processResponse(got.get(`${baseUrl}/getResourceInfo?resource_id=${resourceId}`), { 404: () => <Resource>null });
}

export function getResourceUpdates(resourceId: string): Promise<Update[]> {

    const response = got(`${baseUrl}/getResourceUpdates?resource_id=${resourceId}`);
    return processResponse(response, { 404: () => <Update[]>[] });
}

async function processResponse<T>(response: CancelableRequest<Response<string>> | Response<unknown>, mappers?: Record<number, (response: Response) => T | Promise<T>>, errorFactory?: (isServerError: boolean, message: string, response: any) => Error | Promise<Error>): Promise<T | never> {
    response = await response;

    if (response.statusCode === 404) {
        return mappers? mappers[response.statusCode](response) : null;
    }    

    const mapper = mappers?.[response.statusCode];
    if (mapper) {
        const mapped = await mapper(response);
        if (mapped !== undefined) {
            return mapped;
        }
    }

    let errorText = response.statusMessage;
    try {
        errorText += `, ${response.body}`;
    } catch { }
    errorText = `${response.statusCode} (${errorText})`;
    const isSoftError = response.statusCode === 429 || response.statusCode >= 500;
    if (errorFactory) {
        throw errorFactory(isSoftError, errorText, response);
    } else if (isSoftError){
        throw new SoftError(isSoftError, errorText);
    }
}
