@Library('defra-library@v-6') _

def postTestTasks = {
  def version = version.getPackageJsonVersion()
  def commitSha = build.getCommitSha() // sh(returnStdout: true, script: "git rev-parse HEAD").trim()
  def repoName = build.getRepoName()
  echo "repo name is $repoName"
  stage('Publish Pact to broker') {
    withCredentials([
      string(credentialsId: 'pact-broker-url', variable: 'pactBrokerURL'),
      usernamePassword(credentialsId: 'pact-broker-credentials', usernameVariable: 'pactUsername', passwordVariable: 'pactPassword')
    ]) {
      dir('test-output') {
        echo "Publish pacts to broker"
        def pacts = findFiles glob: "*.json"
        echo "Found ${pacts.size()} pact file(s) to publish"
        for (pact in pacts) {
          def provider = pact.name.replace("$repoName-", "")
          echo "Publishing ${pact.name} to broker"
          echo "Provider: $provider"
          //sh "curl -k -v -XPUT -H \"Content-Type: application/json\" --user $pactUsername:$pactPassword -d@${pact.name} $pactBrokerURL/pacts/provider/ffc-demo-payment-service/consumer/ffc-demo-payment-web/version/${version}+${commitSha}"
          echo "Published ${pact.name} to broker"
        }
      }
    }
  }
}

buildNodeJs environment: 'dev',
  testClosure: postTestTasks
