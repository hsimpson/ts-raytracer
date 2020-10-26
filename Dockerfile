FROM ubuntu:20.04

#install git
RUN apt-get update && \
  apt-get install -y --no-install-recommends git wget gnupg2 ca-certificates curl && \
  curl -sL https://packages.lunarg.com/lunarg-signing-key-pub.asc | apt-key add - && \
  curl -sL -o /etc/apt/sources.list.d/lunarg-vulkan-focal.list https://packages.lunarg.com/vulkan/lunarg-vulkan-focal.list && \
  curl -sL https://deb.nodesource.com/setup_current.x | bash - && \
  apt-get update  && \
  apt-get install -y --no-install-recommends nodejs shaderc && \
  rm -rf /var/lib/apt/lists/*

# checkout
RUN mkdir /home/build

# Create app directory
WORKDIR /home/build

# copy init script
COPY ./build.sh .

# hold
#CMD ["/bin/bash"]
# CMD tail -f /dev/null
CMD ./build.sh