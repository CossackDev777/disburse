# Step 1: Use the official Node.js image as a base
FROM node:20 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the React application
RUN npm run build

# Step 7: Use a lightweight web server (like nginx) to serve the built app
FROM nginx:alpine

# Step 8: Copy the build folder from the build stage to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the port
EXPOSE 80

# Step 10: Start nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]

