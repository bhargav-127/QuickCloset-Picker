pipeline {
    agent any

    environment {
        IMAGE_NAME = "quickcloset-app"
        CONTAINER_NAME = "quickcloset-app"
        PORT = "3000"
        GIT_REPO = "https://github.com/bhargav-127/QuickCloset-Picker.git"
        BRANCH = "main"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: "${BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Remove Old Container') {
            steps {
                sh '''
                if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
                    echo "Stopping old container..."
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                else
                    echo "No old container found."
                fi
                '''
            }
        }

        stage('Remove Old Image') {
            steps {
                sh '''
                if [ "$(docker images -q ${IMAGE_NAME})" ]; then
                    echo "Removing old image..."
                    docker rmi -f ${IMAGE_NAME} || true
                else
                    echo "No old image found."
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "Building new Docker image..."
                docker build -t ${IMAGE_NAME} .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                echo "Starting new container..."
                docker run -d \
                  -p ${PORT}:3000 \
                  --name ${CONTAINER_NAME} \
                  ${IMAGE_NAME}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Checking running container..."
                docker ps | grep ${CONTAINER_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
            echo "🌍 Visit: http://<EC2-PUBLIC-IP>:3000/"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
