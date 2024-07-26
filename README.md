[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-payment-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-payment-web?targetFile=package.json)

# FFC Demo Payment Web

Digital service mock to view scheduled payments for financial aid in the event a property subsides into mine shaft. This is the web front end for the application.

## Prerequisites

- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

## Environment variables

The following environment variables are required by the application container.
Values for development are set in the Docker Compose configuration.
Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.


| Name                           | Description                              | Required  | Default     | Valid                         | Notes                                                                             |
| ----                           | -----------                              | :-------: | -------     | -----                         | -----                                                                             |
| NODE_ENV                       | Node environment                         | no        | development | development, test, production |                                                                                   |
| APPINSIGHTS_INSTRUMENTATIONKEY | Key for application insight              | no        |             |                               | App insights only enabled if key is present. Note: Silently fails for invalid key |
| APPINSIGHTS_CLOUDROLE          | Role used for filtering metrics          | no        |             |                               | Set to `ffc-demo-payment-web-local` in docker compose files                       |
| PORT                           | Port number                              | no        | 3000        |                               |                                                                                   |
| COOKIE_PASSWORD                | password for session cache               | yes       |             |                               |                                                                                   |
| STATIC_CACHE_TIMEOUT_IN_MILLIS | timeout in milliseconds for static files | no        | 900000      |                               |                                                                                   |
| REST_CLIENT_TIMEOUT_IN_MILLIS  | timeout in milliseconds for REST calls   | no        | 2000        |                               |                                                                                   |

## Test structure

The tests have been structured into subfolders of ./test as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

## How to run tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

### Running ZAP scan

A docker-compose exists for running a
[ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/).
Primarily this will be run during CI. It can also be run locally via the
[zap](./scripts/zap) script.

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

### Deploy to Kubernetes

For production deployments, 2 helm charts are included in the `.\helm` folder.
- `ffc-demo-payment-service-infra` for Application infrastructure deployment (servicebus queues, topics, storage accounts) using [`adp-aso-helm-library`](https://github.com/DEFRA/adp-aso-helm-library)
- `ffc-demo-payment-service` for Application deployment using [`adp-helm-library`](https://github.com/DEFRA/adp-helm-library)

These helm charts take developer inputs from [values.yaml](/helm/ffc-demo-payment-service/values.yaml) and [values.yaml](/helm/ffc-demo-payment-service-infra/values.yaml). On running the [`CI pipeline`](.azuredevops/build.yaml) the images and helm charts are built and published to environment level Azure Container Registries.

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

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress controller to be running on the cluster. For example, the NGINX Ingress Controller may be installed via Helm:

```pwsh
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```pwsh
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-payment-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service can be accessed and tested in the same way as described in the "Test the service" section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress
controller to be running on the cluster. For example, the NGINX Ingress
Controller may be installed via Helm.  

Alternatively, a local port may be forwarded to the pod:

```pwsh
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service
can be accessed and tested in the same way as described in the
[Test the service](#test-the-service) section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe
configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

## Build Pipeline

The [CI Pipeline](.azuredevops/build.yaml) does the following

- The application is validated
- The application is tested
- The application is built into deployable artifacts (images and helm charts)
- Pushing the artifacts to Azure Container Registry

A detailed description on the build pipeline [wiki page](https://github.com/DEFRA/ado-pipeline-common/blob/main/docs/AppBuildAndDeploy.md)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
