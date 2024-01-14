# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

RUN apt-get update && apt-get install dnsutils -y

# Do secret stuff
RUN echo "VidpciBhYmogb3JwYnpyIG4gem5mZ3JlIHVucHhyZSE=" > /SuperSecret.txt

# Bundle app source
COPY . .

# Make port 7331 available to the world outside this container
EXPOSE 7331

# Define environment variable
ENV NODE_ENV production

# Run server.js when the container launches
CMD ["node", "server.js"]
