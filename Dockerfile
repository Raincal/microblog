# Dockerfile to create a docker image
FROM daocloud/ci-node:0.12
MAINTAINER cyj94228@gmail.com

ADD ./rootfs.tar /

# Add files to the image
RUN mkdir -p /microblog
COPY . /microblog
WORKDIR /microblog

# Install the dependencies modules
RUN npm install

# Expose the container port
EXPOSE 3000

ENTRYPOINT ["node", "app.js"]

