FROM semtech/mu-javascript-template:1.8.0

WORKDIR /tests
ADD test-helpers /build/test-helpers
RUN cd /build/test-helpers && npm install && npm run build

ADD . /tests/
RUN rm -rf /tests/test-helpers
RUN cd /tests && npm install
RUN chmod +x /tests/start.sh

ENTRYPOINT [ "/tests/start.sh" ]