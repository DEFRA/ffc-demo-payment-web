@Library('defra-library@4') _

def postTestTasks = {
  stage('Publish Pact to broker') {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL'),
      usernamePassword(credentialsId: 'pact-broker-credentials', usernameVariable: 'pactUsername', passwordVariable: 'pactPassword')
    ]) {
      // publish pact to broker
      //sh "npm i"
      //sh "node $WORKSPACE/test/contract/publish-contract.js --pactBroker=$pactBrokerURL --pactUsername=$pactUsername --pactPassword=$pactPassword"

      echo "Publish pact to broker"
      // sh "curl -v -XPUT \-H \"Content-Type: application/json\" --user $pactUsername:$pactPassword -d@testOutput/a_consumer-a_provider.json $pactBrokerURL/pacts/provider/A%20Provider/consumer/A%20Consumer/version/1.0.0+4jvh387gj3"


    }
  }
}

buildNodeJs environment: 'dev',
  testClosure: postTestTasks
