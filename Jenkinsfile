@Library('defra-library@4') _

def postTestTasks = {
  stage('Publish Pact to broker') {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL'),
      usernamePassword(credentialsId: 'pact-broker-credentials', usernameVariable: 'pactUsername', passwordVariable: 'pactPassword')
    ]) {
      // publish pact to broker
      sh "npm i"
      sh "node $WORKSPACE/test/contract/publish-contract.js --pactBroker=$pactBrokerURL --pactUsername=$pactUsername --pactPassword=$pactPassword"
    }
  }
}

buildNodeJs environment: 'dev',
  testClosure: postTestTasks
