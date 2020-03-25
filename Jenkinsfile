@Library('defra-library@4')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def containerSrcFolder = '\\/home\\/node'
def containerTag = ''
def lcovFile = './test-output/lcov.info'
def localSrcFolder = '.'
def mergedPrNo = ''
def pr = ''
def serviceName = 'ffc-demo-payment-web'
def sonarQubeEnv = 'SonarQube'
def sonarScanner = 'SonarScanner'
def timeoutInMinutes = 5

def getExtraCommands(pr, containerTag) {
  withCredentials([
      string(credentialsId: 'web-alb-tags', variable: 'albTags'),
      string(credentialsId: 'web-alb-security-groups', variable: 'albSecurityGroups'),
      string(credentialsId: 'web-alb-arn', variable: 'albArn'),
      string(credentialsId: 'payment-web-cookie-password', variable: 'cookiePassword'),
      string(credentialsId: 'payment-web-okta-domain', variable: 'oktaDomain'),
      string(credentialsId: 'payment-web-okta-client-id', variable: 'oktaClientId'),
      string(credentialsId: 'payment-web-okta-client-secret', variable: 'oktaClientSecret')
    ]) {

    def helmValues = [
      /container.redeployOnChange="$pr-$BUILD_NUMBER"/,
      /ingress.alb.tags="$albTags"/,
      /ingress.alb.arn="$albArn"/,
      /ingress.alb.securityGroups="$albSecurityGroups"/,
      /ingress.endpoint="ffc-payment-web-$containerTag"/,
      /cookiePassword="$cookiePassword"/,
      /okta.domain="$oktaDomain"/,
      /okta.clientId="$oktaClientId"/,
      /okta.clientSecret="$oktaClientSecret"/,
      /siteUrl="https://ffc-payment-web-$containerTag.$INGRESS_SERVER"/
    ].join(',')

    return [
      "--values ./helm/ffc-demo-payment-web/jenkins-aws.yaml",
      "--set $helmValues"
    ].join(' ')
  }
}

node {
  checkout scm
  try {
    stage('Set GitHub status as pending'){
      defraUtils.setGithubStatusPending()
    }
    stage('Set PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(serviceName, defraUtils.getPackageJsonVersion())
    }
    stage('Helm lint') {
      defraUtils.lintHelm(serviceName)
    }
    stage('Build test image') {
      defraUtils.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(serviceName, serviceName, BUILD_NUMBER)
    }
    stage('Create JUnit report'){
      defraUtils.createTestReportJUnit()
    }
    stage('Fix lcov report') {
      defraUtils.replaceInFile(containerSrcFolder, localSrcFolder, lcovFile)
    }
    stage('SonarQube analysis') {
      defraUtils.analyseCode(sonarQubeEnv, sonarScanner, ['sonar.projectKey' : serviceName, 'sonar.sources' : '.'])
    }
    stage("Code quality gate") {
      defraUtils.waitForQualityGateResult(timeoutInMinutes)
    }
    stage('Push container image') {
      defraUtils.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag)
    }
    if (pr != '') {
      stage('Verify version incremented') {
        defraUtils.verifyPackageJsonVersionIncremented()
      }
      stage('Helm install') {
        defraUtils.deployChart(KUBE_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag,  getExtraCommands(pr, containerTag))
        echo "Build available for review at https://ffc-payment-web-$containerTag.$INGRESS_SERVER"
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(DOCKER_REGISTRY, serviceName, containerTag)
      }
      stage('Trigger GitHub release') {
        withCredentials([
          string(credentialsId: 'github-auth-token', variable: 'gitToken')
        ]) {
          defraUtils.triggerRelease(containerTag, serviceName, containerTag, gitToken)
        }
      }
      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: 'payment-web-deploy-job-name', variable: 'deployJobName'),
          string(credentialsId: 'payment-web-deploy-token', variable: 'jenkinsToken')
        ]) {
          defraUtils.triggerDeploy(JENKINS_DEPLOY_SITE_ROOT, deployJobName, jenkinsToken, ['chartVersion': containerTag])
        }
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployChart(KUBE_CREDENTIALS_ID, serviceName, mergedPrNo)
      }
    }
    stage('Set GitHub status as success'){
      defraUtils.setGithubStatusSuccess()
    }
  } catch(e) {
    defraUtils.setGithubStatusFailure(e.message)
    defraUtils.notifySlackBuildFailure(e.message, "#generalbuildfailures")
    throw e
  } finally {
    defraUtils.deleteTestOutput(serviceName, containerSrcFolder)
  }
}
