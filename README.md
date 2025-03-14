> [!WARNING]
> Untested repo, currently in development, expect major changes

This repo adds contract testing to microservices in the semantic.works architecture.

## Running the tests

You can run the tests by:

- building https://github.com/lblod/contract-testing as `local-contract-tests`
- running `docker compose up -V  --abort-on-container-exit` in this directory

This will attach to the test container, which will end with a report on whether the tests passed (or which ones failed). The tests are built on top of jest and also track snapshots in a snapshots directory.

An example of this can be found here: https://github.com/lblod/mandataris-service/pull/109

## Contract Test Capabilities

### Waits for SEAS database to be up and running

The tests are only started once the DB is ready

### Log in as a group/role/account

Given the following imports from the contract-testing package (that you get from the contract-testing docker image),

```ts
import {
  mockLogin,
  userRequest,
  clearDeltas,
  expectQueryToHaveNoResults,
  getDeltas,
  runUserQuery,
  runSudoQuery,
} from "contract-tests";
```

You can log in using the following snippet

```ts
await mockLogin(
  "http://data.lblod.info/id/bestuurseenheden/5116efa8-e96e-46a2-aba6-c077e9056a96", // group uri
  "http://data.lblod.info/id/accounts/1234", // account uri
  "LoketLB-mandaatGebruiker" // role name
);
```

From then on, you can make user http requests like this

```ts
const { body } = await userRequest(
  "POST",
  "http://target/mandatarissen/bulk-set-publication-status",
  {
    decision: "http://data.lblod.info/id/besluit/1",
    statusUri: bekrachtigd,
    mandatarissen: mandatarisUris.map((uri) => uri.split("/").pop()),
  }
);
```

and user sparql queries like this

```ts
await runUserQuery(query);
```

### Tracking deltas

The tests automatically track the deltas that are sent from the database. To clear the deltas received, use

```ts
beforeEach(async () => {
  await clearDeltas();
});
```

To check the deltas that came in up to a certain point, use e.g.:

```ts
expect(await getDeltas()).toMatchSnapshot();
```

## Future work

### CI/CD integration

We are using woodpecker, but running this as a pipeline step would require unsafe additions to the configuration that we're not willing to make (right now), either docker in docker or mounting volumes for services.

That means currently, running contract tests is the responsibility of the developer.

### mu-cli integration

We want to reduce the effort/boilerplate that is required to set up contract testing for a repository. The ideal case is that you simply specify a contract-tests directory with the testcases, snapshots and toLoad folder and then run a mu-cli script to have the tests run. Again this likely involves privileged containers so we are still looking to make this safe.
