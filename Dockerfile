# syntax=docker/dockerfile:1

FROM ghcr.io/openstatushq/private-location:latest


EXPOSE 8080

# Run
CMD [ "/opt/bin/private" ]
