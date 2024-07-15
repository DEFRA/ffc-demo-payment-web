# Microservice Performance Tests

This folder contains the peformance tests for the FFC Demo Web service `ffc-demo-payment-web` front end.

The framework is based upon [jmeter](https://jmeter.apache.org/), and utilises an jmeter image from [https://github.com/justb4/docker-jmeter].

## Requirements

- Docker Desktop 4.16.09 or higher
- [jmeter v5.5](https: //archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.5.tgz) (for local running)

## How to run the tests

- `cd test/performance`
- `docker-compose -f ../../docker-compose.yaml -f docker-compose.jmeter.yaml run jmeter-test`

## Parameterising your Tests

You can modify the number of virtual users, loop count and ramp-up duration by changing the settings in the file `demo-web-payment-perf-test.properties`.

```yaml

# Sample user.properties file
#---------------------------------------------------------------------------
# Properties added to manage noThreads rampUp lCount values
#---------------------------------------------------------------------------
noThreads=15 
rampUp=1 
lCount=2

```
