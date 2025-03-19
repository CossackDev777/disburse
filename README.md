Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)

npm or yarn (for frontend dependencies)

Java Development Kit (JDK) (v17 or higher)

Gradle (v7.x or higher)

Git (for cloning the repository)

Frontend Setup (React/Vite)
1. Clone the Repository
   Clone the frontend repository (if separate) or navigate to the frontend directory:

bash
Copy
git clone <frontend-repo-url>
cd <frontend-directory>
2. Install Dependencies
   Install the required dependencies using npm or yarn:

bash
Copy
npm install
# or
yarn install
3. Configure Environment Variables
   Create a .env file in the root of the frontend directory and add the necessary environment variables. For example:

env
Copy
VITE_API_BASE_URL=http://localhost:8080
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
4. Run the Frontend
   Start the development server:

bash
Copy
npm run dev
# or
yarn dev
The frontend will be available at:

Copy
http://localhost:5173
Backend Setup (Spring Boot/Gradle)
1. Clone the Repository
   Clone the backend repository (if separate) or navigate to the backend directory:

bash
Copy
git clone <backend-repo-url>
cd <backend-directory>
2. Configure Environment Variables
   Create an application.properties or application.yml file in the src/main/resources directory and add the necessary configuration. For example:

properties
Copy
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydatabase
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
3. Build the Backend
   Build the backend using Gradle:

bash
Copy
./gradlew build
4. Run the Backend
   Start the Spring Boot application:

bash
Copy
./gradlew bootRun
The backend will be available at:

Copy
http://localhost:8080
Running the Full Stack
1. Start the Backend
   Ensure the Spring Boot backend is running:

bash
Copy
./gradlew bootRun
2. Start the Frontend
   Ensure the React/Vite frontend is running:

bash
Copy
npm run dev
# or
yarn dev
3. Access the Application
   Open your browser and navigate to:

Copy
http://localhost:5173
API Integration
The frontend is configured to communicate with the backend using the VITE_API_BASE_URL environment variable. Ensure the backend is running and accessible at the specified URL (e.g., http://localhost:8080).

Testing
Frontend Tests
Run frontend tests using:

bash
Copy
npm run test
# or
yarn test
Backend Tests
Run backend tests using:

bash
Copy
./gradlew test
Deployment
Frontend
Build the frontend for production:

bash
Copy
npm run build
# or
yarn build
Deploy the generated dist folder to your preferred hosting service (e.g., Netlify, Vercel, or AWS S3).

Backend
Build the backend for production:

bash
Copy
./gradlew build
Deploy the generated .jar file to your preferred hosting service (e.g., AWS EC2, Heroku, or Google Cloud).

Troubleshooting
Frontend
If the frontend fails to start, ensure all dependencies are installed (npm install or yarn install).

Check the browser console for errors.

Backend
If the backend fails to start, ensure the database is running and the connection details in application.properties are correct.

Check the Spring Boot logs for errors.

