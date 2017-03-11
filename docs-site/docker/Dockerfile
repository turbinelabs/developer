#@NAME=docs-site
#@MAKE=docs-site
#@ARTIFACT=/tbn/developer/docs-site/_site:www
#@BUILD=go install github.com/turbinelabs/tools/envtemplate
#@ARTIFACT=/tbn/bin/envtemplate:envtemplate
FROM turbinelabs/static-host:latest

ADD docker/build/envtemplate /usr/local/bin/envtemplate
ADD docker/build/www /www
ADD docker/docs_config.sh /etc/my_init.d/docs_config.sh
RUN chmod +x /etc/my_init.d/docs_config.sh
