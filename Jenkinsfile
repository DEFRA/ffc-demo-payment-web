@Library('defra-library@4') _

def postTestTasks = {
  def version = version.getPackageJsonVersion()
  def commitSha = build.getCommitSha()
  stage('Publish Pact to broker') {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL'),
      usernamePassword(credentialsId: 'pact-broker-credentials', usernameVariable: 'pactUsername', passwordVariable: 'pactPassword')
    ]) {
      // publish pact to broker
      //sh "npm i"
      //sh "node $WORKSPACE/test/contract/publish-contract.js --pactBroker=$pactBrokerURL --pactUsername=$pactUsername --pactPassword=$pactPassword"
      dir('test-output') {
        echo "Publish pacts to broker"
        def pacts = findFiles glob: "*.json"
        echo "Found ${pacts.size()} pact file(s) to publish"
        for (pact in pacts) {
          echo "Publishing ${pact.name} to broker"
          sh "curl -k -v -XPUT -H \"Content-Type: application/json\" --user $pactUsername:$pactPassword -d@${pact.name} $pactBrokerURL/pacts/provider/ffc-demo-payment-service/consumer/ffc-demo-payment-web/version/${version}+${commitSha}"
          echo "Published ${pact.name} to broker"
        }
      }
    }
  }
}

buildNodeJs environment: 'dev',
  testClosure: postTestTasks
