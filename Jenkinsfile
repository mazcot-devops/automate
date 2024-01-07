pipeline {
    agent any
    environment {
        IMAGE_NAME = 'node-app'
        CONTAINER_NAME = 'node-app-container'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'jo-cred',
                    url: 'https://github.com/Jirayut-Jo/qa'
            }
        }
        stage('Build Image') {
            steps {
                script {
                    docker.build("$IMAGE_NAME", '.')
                }
            }
        }
        stage('Cleanup-before-stage') {
            steps {
                script {
                    def containerExists = sh(script: "docker ps -q -f name=${CONTAINER_NAME}", returnStatus: true)
                    if (containerExists == 0) {
                        echo "Container ${CONTAINER_NAME} not found, proceeding to the next stage."
                    } else {
                        sh "docker stop ${CONTAINER_NAME}"
                        sh "docker rm ${CONTAINER_NAME}"
                        echo "Container ${CONTAINER_NAME} stopped and removed."
                    }
                }
            }
        }
        stage('Run Container') {
            steps {
                script {
                    sh "docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}"
                    sh "sleep 10"
                    sh "docker logs ${CONTAINER_NAME}"
                }
            }
        }
        stage('Check Container Status') {
            steps {
                script {
                    sh "docker logs node-app-container" 
                }
            }
        }
        stage('Run Robot Tests') {
            steps {
                script {
                    sh "docker exec ${CONTAINER_NAME} robot /app/automate-test/test.robot"
                }
            }
        }
        stage('Copy Robot Results to Workspace') {
            steps {
                script {
                    sh "docker cp ${CONTAINER_NAME}:/app/output.xml /var/lib/jenkins/workspace/robot/output.xml"
                    sh "docker cp ${CONTAINER_NAME}:/app/log.html /var/lib/jenkins/workspace/robot/log.html"
                    sh "docker cp ${CONTAINER_NAME}:/app/report.html /var/lib/jenkins/workspace/robot/report.html"
                }
            }
        }
        stage('Performance Test') {
            steps {
                script {
                    sh "docker exec node-app-container k6 run /app/automate-test/test-performance-k6.js --out json=result.json"
                }
            }
        }
        stage('Copy k6 Performance Results to Workspace') {
            steps {
                script {
                    sh "docker cp ${CONTAINER_NAME}:/app/result.json /var/lib/jenkins/workspace/k6/result.json"
                }
            }
        }
        stage('Cleanup') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME}"
                    sh "docker rm ${CONTAINER_NAME}"
                    sh "docker rmi ${IMAGE_NAME}"
                }
            }
        }
    }
    post {
        success {
            echo 'Tests passed successfully!'
        }
        failure {
            echo 'Tests failed. Check the logs for more information.'
        }
    }
}
