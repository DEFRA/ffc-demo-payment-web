@Library('defra-library@v-8') _

def postTestTasks = {
  def version = version.getPackageJsonVersion()
  def commitSha = utils.getCommitSha()
  def repoName = utils.getRepoName()
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
          def provider = pact.name.substring("$repoName-".length(), pact.name.indexOf(".json"))
          echo "Publishing ${pact.name} to broker"
          sh "curl -k -v -XPUT -H \"Content-Type: application/json\" --user $pactUsername:$pactPassword -d@${pact.name} $pactBrokerURL/pacts/provider/$provider/consumer/$repoName/version/$version+$commitSha"
        }
      }
    }
  }
}

buildNodeJs environment: 'dev'
// temporarily removing as Pact Broker is not yet accessible form Jenkins in Azure
  // testClosure: postTestTasks
