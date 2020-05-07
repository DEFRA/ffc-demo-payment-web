@Library('defra-library@4') _

def postTestTasks = {
  stage('Publish Pact to broker') {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL')
    ]) {
      // publish pact to broker
      sh "node $WORKSPACE/test/contract/publish-contract.js --pactBroker=$pactBrokerURL"
    }
  }
}

buildNodeJs environment: 'dev',
  testClosure: postTestTasks
