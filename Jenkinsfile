pipeline {
    agent any
    environment {
        IMAGE_NAME = 'node-app'
        CONTAINER_NAME = 'node-app-container'
    }
    stages {
        stage('Cleanup before stage') {
            steps {
                script {
                    def containerExists = sh(script: "docker ps -aq -f name=${CONTAINER_NAME}", returnStdout: true).trim()
                    if (containerExists) {
                        sh "docker stop ${CONTAINER_NAME}"
                        sh "docker rm ${CONTAINER_NAME}"
                        sh "docker rmi ${IMAGE_NAME}"
                        echo "Container${CONTAINER_NAME} and ${IMAGE_NAME}image stopped and removed."
                    } else {
                        echo "Container ${CONTAINER_NAME} not found, proceeding to the next stage."
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    docker.build("$IMAGE_NAME", '.')
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
        stage('Run Robotframework Tests') {
            steps {
                script {
                    sh "docker exec ${CONTAINER_NAME} robot /app/automate-test/test-backend.robot"
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
        stage('Run Performance Test') {
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
                    archiveArtifacts artifacts: '/var/lib/jenkins/workspace/k6/result.json', allowEmptyArchive: true
                }
            }
        }
        stage('Display k6 Summary Data') {
            steps {
                script {
                    def resultData = readFile('result.json')
                    def summaryData = new groovy.json.JsonSlurper().parseText(resultData)
                    echo "Register Time: ${summaryData.registerTime} ms"
                    echo "Login Time: ${summaryData.loginTime} ms"
                    echo "Update Time: ${summaryData.updateTime} ms"
                    echo "Delete Time: ${summaryData.deleteTime} ms"
                }
            }
        }
        stage('Cleanup after stage') {
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
