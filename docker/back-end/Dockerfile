# For upload to docker hub
FROM openjdk:17.0.1-jdk-slim
ADD back-end/target/ring-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]