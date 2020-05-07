@Library('defra-library@4') _

buildNodeJs environment: 'dev',
  testClosure: {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL')
    ]) {
      // publish pact to broker
      sh "node $WORKSPACE/test/contract/publish-contract.js --pactBroker=$pactBrokerURL"
    }
  }
