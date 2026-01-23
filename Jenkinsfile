pipeline {
    agent any

    tools {
        nodejs "NodeJS" // Should match the NodeJS installation name in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo "Pipeline finished"
        }
        success {
            echo "Build SUCCESS!"
        }
        failure {
            echo "Build FAILED!"
        }
    }
}
