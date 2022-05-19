import { authenticateSilently } from "mad-expo-core";

import appJson from "../../app.json";
import { NetworkException } from "../../app/utils/Exception";
import { getResource } from "../../constants/settings";

const appName = appJson.expo.name;
const defaultResource = "hearing";
const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createUrl = (resource, path) =>
  `${getResource(resource).ApiBaseUrl}${path}`;

// Helper functions
const fetchData = (path, resource = defaultResource, parseJson = true) =>
  authenticateSilently(getResource(resource).scopes[0]).then((r) =>
    fetch(createUrl(resource, path), {
      method: "GET",
      withCredentials: true,
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${r.accessToken}`,
      },
    }).then((response) => {
      if (response.ok) {
        if (parseJson) {
          return response.json();
        }
        return response.ok;
      }
      throw new NetworkException(response.statusText, response.status);
    })
  );

const postData = (path, data, method = "POST", resource = defaultResource) =>
  // TODO: Change this after changing to allowing array of scopes. Do this for all authenticateSilently methods
  authenticateSilently(getResource(resource).scopes[0]).then((r) =>
    fetch(createUrl(resource, path), {
      method,
      body: JSON.stringify(data),
      withCredentials: true,
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${r.accessToken}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new NetworkException(response.statusText, response.status);
    })
  );

const fetchOpenData = (path, resource = defaultResource) =>
  fetch(createUrl(resource, path), {
    method: "GET",
    ...jsonHeaders,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new NetworkException(response.statusText, response.status);
  });

export function getReleaseNote(version) {
  return fetchData(`/ReleaseNote/${appName}/${version}`, "mad");
}

export const getServiceMessage = () =>
  fetchOpenData(`/ServiceMessage/${appName}`, "mad");

export const fetchTest = () => fetchData(`/me/tests/takeTest`);

export const postTest = (body) => postData(`/me/tests`, body);

export const appInit = () =>
  fetchData("/appStartup/init", defaultResource, false);

export const fetchTests = () => fetchData("/me/tests");

export const fetchMe = () => fetchData("/me");