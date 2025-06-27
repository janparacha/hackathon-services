FROM ollama/ollama:0.9.3-rc3

COPY /entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 11434

ENTRYPOINT [ "/entrypoint.sh" ]