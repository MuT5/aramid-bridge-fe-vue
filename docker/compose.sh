if [ "$ver" == "" ]; then
ver=1.0.0
fi

echo "docker build -t \"scholtz2/aramid-bridge-web-app:$ver-beta\" -f Dockerfile /home/cicd/web/aramid-bridge-fe-vue"
docker build -t "scholtz2/aramid-bridge-web-app:$ver-beta" -f Dockerfile  /home/cicd/web/aramid-bridge-fe-vue || error_code=$?
if [ "$error_code" != "" ]; then
echo "$error_code";
  echo "failed to build";
  exit 1;
fi
docker push "scholtz2/aramid-bridge-web-app:$ver-beta"  || error_code=$?
if [ "$error_code" != "" ]; then
echo "$error_code";
  echo "failed to push";
  exit 1;
fi
echo "Image: scholtz2/aramid-bridge-web-app:$ver-beta"