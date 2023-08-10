FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-18:latest
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-build-18:latest
WORKDIR /opt
COPY api-enumerations ./api-enumerations
COPY ./dist ./package.json ./package-lock.json docker_start.sh ./
CMD ["./docker_start.sh", "./docker_inspect.sh"]
EXPOSE 3000