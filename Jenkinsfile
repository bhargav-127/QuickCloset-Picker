pipeline {
  agent any
  environment {
    IMAGE = "bhargav-127/quickcloset-server"
    DOCKER_CRED = "dockerhub-creds"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Install') {
      steps {
        sh 'cd server && npm install --production'
      }
    }

    stage('Build image') {
      steps {
        sh "docker build -t ${IMAGE}:${env.GIT_COMMIT} -f server/Dockerfile ."
      }
    }

    stage('Push image') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${IMAGE}:${env.GIT_COMMIT}"
        }
      }
    }

    stage('Deploy') {
      steps {
        sh "docker stop quickcloset || true && docker rm quickcloset || true"
        sh "docker run -d --name quickcloset -p 3000:3000 ${IMAGE}:${env.GIT_COMMIT}"
      }
    }
  }
  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
