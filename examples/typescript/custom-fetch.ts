export interface GithubUser {
  /**
   * The username essentially
   */
  "login": string;
  /**
   * User ID
   */
  "id": 1;
  /**
   * Node ID for graph API?
   */
  "node_id": string;
  "avatar_url": string;
  "gravatar_id": string;
  "url": string;
  "html_url": string;
  "followers_url": string;
  "following_url": string;
  "gists_url": string;
  "starred_url": string;
  "subscriptions_url": string;
  "organizations_url": string;
  "repos_url": string;
  "events_url": string;
  "received_events_url": string;
  "type": "User";
  "site_admin": false;
  "name": string;
  "company": string;
  "blog": string;
  "location": string;
  "email": string;
  "hireable": boolean;
  "bio": string;
  "public_repos": number;
  "public_gists": number;
  "followers": number;
  "following": number;
  "created_at": Date;
  "updated_at": Date;
}

export interface FetchOptions {
  // ...
}

const fetchResource = async <T>(url: string, options?: FetchOptions) => {
  const resp = await fetch(url, options);

  if (resp.status !== 200) {
    const error = await resp.json();

    throw new Error(error.message);
  }

  const json = await resp.json() as T;

  return json;
}

const somewhereInYourApp = async () => {
  const user = await fetchResource<GithubUser>("https://api.github.com/users/me");

  console.log(user.login)
};
