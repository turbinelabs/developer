#@NAME=docs-site
FROM turbinelabs/static-host:latest

#@BUILD=go install github.com/turbinelabs/tools/envtemplate
#@ARTIFACT=/tbn/bin/envtemplate:envtemplate
ADD docker/build/envtemplate /usr/local/bin/envtemplate

#@MAKE=docs-site
#@ARTIFACT=/tbn/developer/docs-site/_site:www
ADD docker/build/www /www

#@ARTIFACT=/tbn/www/src/favicons:favicons
ADD docker/build/favicons/* /www/

ADD docker/docs_config.sh /etc/my_init.d/docs_config.sh
RUN chmod +x /etc/my_init.d/docs_config.sh
