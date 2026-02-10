pipeline {
    agent any

    environment {
        SERVICE_NAME = "quickcloset-app"
        IMAGE_NAME = "quickcloset-app_image"
        COMPOSE_FILE = "docker-compose.yml"
    }

    stages {
        stage('Clone Repo') {
            steps {
                // Clean workspace
                deleteDir()
                // Clone GitHub repo
                git branch: 'main', url: 'https://github.com/bhargav-127/QuickCloset-Picker.git'
            }
        }

        stage('Cleanup Old Containers & Images') {
            steps {
                script {
                    // Stop and remove old container if exists
                    sh """
                    if [ \$(docker ps -a -q -f name=${SERVICE_NAME}) ]; then
                        docker stop ${SERVICE_NAME}
                        docker rm ${SERVICE_NAME}
                    fi
                    """

                    // Remove old image if exists
                    sh """
                    if [ \$(docker images -q ${IMAGE_NAME}) ]; then
                        docker rmi -f ${IMAGE_NAME}
                    fi
                    """
                }
            }
        }

        stage('Build & Run Docker Compose') {
            steps {
                script {
                    // Build and start container in detached mode
                    sh "docker-compose -f ${COMPOSE_FILE} up --build -d"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh "docker ps | grep ${SERVICE_NAME} || echo '❌ Container not running!'"
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Visit http://<your-server-ip>:3000/"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
