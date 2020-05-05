[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-payment-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-payment-web?targetFile=package.json)

# FFC Demo Payment Service

Digital service mock to view scheduled payments for financial aid in the event a property subsides into mine shaft.  This is the web front end for the application.

## Prerequisites

AWS credentials with access to the container registry where FFC parent images are stored.

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 10

## Environment variables

The following environment variables are required by the application container. 
Values for development are set in the Docker Compose configuration. 
Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.


| Name                                  | Description                               | Required | Default               | Valid                       |
|---------------------------------------|-------------------------------------------|:--------:|-----------------------|-----------------------------|
| NODE_ENV                              | Node environment                          | no       | development           | development,test,production |
| PORT                                  | Port number                               | no       | 3000                  |                             |
| COOKIE_PASSWORD                       | password for session cache                | yes      |                       |                             |
| STATIC_CACHE_TIMEOUT_IN_MILLIS        | timeout in milliseconds for static files  | no       | 900000                |                             |
| REST_CLIENT_TIMEOUT_IN_MILLIS         | timeout in milliseconds for REST calls    | no       | 2000                  |                             |
| PAYMENT_SERVICE_URL                   | URL for payment service API               | yes      |                       |                             |
| OIDC_PROVIDER                         | set the OIDC provider to use              | no       | dev                   | dev, okta, b2c              |
| OKTA_DOMAIN                           | Okta domain, i.e. `mysite.okta.com`       | no       |                       |                             |
| OKTA_CLIENT_ID                        | Client ID of Okta OpenID Connect app      | no       |                       |                             |
| OKTA_CLIENT_SECRET                    | Client Secret of Okta OpenID Connect app  | no       |                       |                             |
| OKTA_AUTH_SERVER_ID                   | ID of Okta custom authorisation server    | no       |                       |                             |
| B2C_CLIENT_ID                         | Client ID of B2C OpenID Connect app       | no       |                       |                             |
| B2C_CLIENT_SECRET                     | Client Secret of B2C OpenID Connect app   | no       |                       |                             |
| B2C_URL                               | OAuth URL of B2C OpenID Connect app       | no       |                       |                             |
| SITE_URL                              | URL of site, i.e. https://mysite.com      | no       |                       |                             |

## Running the project locally

The web site can authenticate using [Okta](https://www.okta.com/), or using stubbed authentication for local development. 
To use the stubbed authentication set `OIDC_PROVIDER` to `"dev"`.

Okta specific environment variables must be set if `OIDC_PROVIDER` is set to `"okta"`.
A valid Okta OpenID Connect application is required, and the Okta domain, client ID, Client Secret, Custom Authorisation
Server ID, and URL of the site must be set in the environment variables
`OKTA_DOMAIN`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET`, `OKTA_AUTH_SERVER_ID`, and `SITE_URL` respectively.

B2C specific environment variables must be set if `OIDC_PROVIDER` is set to `"b2c"`.
A valid B2C OpenID Connect application is required, and the B2C client ID, Client Secret, Oauth URL, and URL of the site
must be set in the environment variable `B2C_CLIENT_ID`, `B2C_CLIENT_SECRET`, `B2C_URL`, and `SITE_URL` respectively.

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. This will rebuild images before running tests via docker-compose, using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`. The command given to `docker-compose run` may be customised by passing arguments to the test script.

Examples:

```
scripts/test
```

Alternatively, the same tests may be run locally via npm:

```
# Run tests without Docker
npm run test
```

### Test watcher

A more convenient way to run tests in development is to use a file watcher to automatically run tests each time associated files are modified. For this purpose, the default docker-compose configuration mounts all app, test and git files into the main `ffc-demo-payment-web` container, enabling the test watcher to be run as shown below. The same approach may be used to execute arbitrary commands in the running app.

```
# Run tests in watch mode
docker-compose run ffc-demo-payment-web npm run test:watch

# Run tests
docker-compose run ffc-demo-payment-web npm test

# Open an interactive shell in the app container
docker-compose run ffc-demo-payment-web sh
```

### Contract testing

Contract testing has been introduced to the app, using the Pact toolkit. Tests are located in test/contract, and run as part of a full test run, or can be run in isolation via `npm run test:pact`. As part of a test run, a 'Pact' is generated in `test-output`, a JSON file detailing how endpoints in the payment service are used and facilitating contract tests within that service.

### Why docker-compose.test.yaml exists

Given that tests can be run in the main ffc-demo-payment-web container during development, it may not be obvious why `docker-compose.test.yaml` exists. It's main purpose is for CI pipelines, where tests need to run in a container without any ports forwarded from the host machine.

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will be mounted on top of the `app` folder within the Docker container, hiding the css files that were generated during the Docker build. 
For the site to render correctly locally `npm run build` must be run on the host system.

By default, the start script will build (or rebuild) images so there will rarely be a need to build images manually. However, this can be achieved through the Docker Compose [build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.link.yaml up
```

### Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP 1.0 message broker, using credentials defined in [values.yaml](./helm/ffc-demo-payment-web/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress controller to be running on the cluster. For example, the NGINX Ingress Controller may be installed via Helm:

```
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-payment-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service can be accessed and tested in the same way as described in the "Test the service" section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Amazon Load Balancer

Settings are available in the Helm charts for the Amazon Load Balancer Ingress Controller.

Child settings below `ingress` allow the user to set [resource tags](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#tags) and the arn of an [SSL certificate](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#certificate-arn), i.e.
```
ingress:
  alb:
    tags: Name=myservername,Environment=myEnv,Project=MyProject,ServiceType=LOB
    arn: arn:aws:acm:eu-west-2:123456:certificate/abcdef0000-123a-4321-abc8-a1234567z
```

### Running without containers

The application may be run natively on the local operating if a Redis server is available on `localhost:6379`. First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node app`

## Build Pipeline

The [Jenkinsfile](Jenkinsfile) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deploys PRs to a temporary end point for review
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `ffc-payment-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.


The builds will be available at the URL `http://ffc-payment-{identifier}.{ingress-server}`, where `{ingress-server}` is r defined the [`values.yaml`](./helm/ffc-demo-web/values.yaml) at `ingress.server`. This is empty by default and is set during the build pipeline.

The temporary deployment requires a CNAME subdomain wildcard pointing to the public IP address of the ingress controller of the Kubernetes cluster. This can be simulated by updating your local `hosts` file with an entry for the build address set to the ingress controller's public IP address. On windows this would mean adding a line to `C:\Windows\System32\drivers\etc\hosts`, i.e. for PR 8 against the default ingress server this could be

xx.xx.xx.xx ffc-payment-pr8.my-ingress-server.co.uk

where `xx.xx.xx.xx` is the public IP Address of the Ingress Controller.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
