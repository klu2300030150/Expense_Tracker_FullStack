FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy the entire project
COPY . .

# Build the application (this will also build React frontend)
RUN cd SpringBootApp && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/SpringBootApp/target/*.jar app.jar

# Expose port
EXPOSE 4000

# Set environment variables (will be overridden by deployment platform)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/expense_tracker
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=password

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
